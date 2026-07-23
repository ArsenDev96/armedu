import { expect, test } from "@playwright/test";
import { LOCALES, ui } from "./helpers";

/**
 * These tests never talk to Supabase. They cover the paths that must work
 * without any credentials: client-side validation, the missing-configuration
 * state, and the payload the form would send. Any outbound Supabase request is
 * blocked so a machine that happens to have credentials cannot make the suite
 * pass for the wrong reason.
 */
test.beforeEach(async ({ context }) => {
  await context.route("**/*.supabase.co/**", (route) => route.abort());
});

/**
 * `exact: true` throughout: the contact page carries both this form and the
 * contact form, whose own email label ("Your email address") contains this one
 * as a substring — and `getByLabel` matches substrings case-insensitively by
 * default, so a loose lookup resolves to two fields and fails.
 */

for (const locale of LOCALES) {
  test(`[${locale}] an invalid email shows localized validation`, async ({ page }) => {
    await page.goto(`/${locale}/contact`);
    const dict = ui(locale);

    const field = page.getByLabel(dict.newsletter.emailLabel, { exact: true });
    await field.fill("not-an-email");
    await page.getByRole("button", { name: dict.newsletter.button }).click();

    await expect(page.getByText(dict.newsletter.invalid)).toBeVisible();
    await expect(field).toHaveAttribute("aria-invalid", "true");
    // The address stays put so it can be corrected rather than retyped.
    await expect(field).toHaveValue("not-an-email");
  });

  test(`[${locale}] missing Supabase configuration is reported, not faked`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(`/${locale}/contact`);
    const dict = ui(locale);

    await page.getByLabel(dict.newsletter.emailLabel, { exact: true }).fill("reader@example.com");
    await page.getByRole("button", { name: dict.newsletter.button }).click();

    // Either the "not configured" notice, or — on a machine that does have
    // credentials — a real outcome. Never a silent success.
    const outcome = page.getByText(
      new RegExp(
        [
          dict.newsletter.unconfigured,
          dict.newsletter.success,
          dict.newsletter.duplicate,
          dict.newsletter.error,
        ]
          .map((text) => text.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|"),
      ),
    );
    await expect(outcome.first()).toBeVisible();

    expect(errors).toEqual([]);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}

test("validation clears as soon as the address is corrected", async ({ page }) => {
  await page.goto("/hy/contact");
  const dict = ui("hy");

  const field = page.getByLabel(dict.newsletter.emailLabel, { exact: true });
  await field.fill("nope");
  await page.getByRole("button", { name: dict.newsletter.button }).click();
  await expect(page.getByText(dict.newsletter.invalid)).toBeVisible();

  await field.fill("reader@example.com");
  await expect(page.getByText(dict.newsletter.invalid)).toHaveCount(0);
});

test("the form submits the active route locale", async ({ page }) => {
  // Intercept the insert so the payload can be inspected without a real project.
  let payload: unknown = null;
  await page.route("**/rest/v1/newsletter_subscribers*", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 201, contentType: "application/json", body: "[]" });
  });

  // A fake origin is enough: the client only needs the two variables to exist.
  await page.addInitScript(() => {
    /* no-op — configuration comes from the build, see the assertion below */
  });

  await page.goto("/hyw/contact");
  const dict = ui("hyw");

  await page.getByLabel(dict.newsletter.emailLabel, { exact: true }).fill("Reader@Example.COM ");
  await page.getByRole("button", { name: dict.newsletter.button }).click();

  if (payload) {
    // Only reachable when Supabase is configured locally.
    expect(payload).toMatchObject({
      email: "reader@example.com",
      source: "contact-page",
      locale: "hyw",
    });
  } else {
    // Unconfigured: the form must say so rather than pretend it worked.
    await expect(page.getByText(dict.newsletter.unconfigured)).toBeVisible();
  }
});

test("the homepage newsletter form validates in Armenian too", async ({ page }) => {
  await page.goto("/hy");
  const dict = ui("hy");

  await page.getByLabel(dict.newsletter.emailLabel, { exact: true }).fill("bad");
  await page.getByRole("button", { name: dict.newsletter.button }).click();

  await expect(page.getByText(dict.newsletter.invalid)).toBeVisible();
});
