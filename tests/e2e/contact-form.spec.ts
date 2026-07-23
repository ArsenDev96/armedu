import { expect, test } from "@playwright/test";
import { LOCALES, ui } from "./helpers";

/**
 * The contact form is covered without ever sending a real message: `/api/contact`
 * is intercepted, so the suite passes or fails on the form's own behaviour and
 * never depends on SMTP credentials or a Supabase table existing. The one thing
 * these tests must never allow is a success message for a message that did not
 * actually leave the browser.
 */

const API = "**/api/contact";

/** The payload the form claims to have sent, captured from the request body. */
async function submit(
  page: import("@playwright/test").Page,
  locale: (typeof LOCALES)[number],
  values: { name: string; email: string; message: string },
) {
  const dict = ui(locale).contactForm;
  await page.getByLabel(dict.nameLabel, { exact: false }).fill(values.name);
  await page.getByLabel(dict.emailLabel, { exact: false }).fill(values.email);
  await page.getByLabel(dict.messageLabel, { exact: false }).fill(values.message);
  await page.getByRole("button", { name: dict.submit }).click();
}

for (const locale of LOCALES) {
  test(`[${locale}] an empty form is rejected in the reader's language`, async ({ page }) => {
    let called = false;
    await page.route(API, (route) => {
      called = true;
      return route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await page.goto(`/${locale}/contact`);
    const dict = ui(locale).contactForm;

    await page.getByRole("button", { name: dict.submit }).click();

    await expect(page.getByText(dict.invalidName)).toBeVisible();
    await expect(page.getByText(dict.invalidEmail)).toBeVisible();
    await expect(page.getByText(dict.invalidMessage)).toBeVisible();

    // Nothing may reach the server until the form is actually valid.
    expect(called).toBe(false);
  });

  test(`[${locale}] a valid message is sent and confirmed`, async ({ page }) => {
    const payloads: Record<string, unknown>[] = [];

    await page.route(API, async (route) => {
      payloads.push(JSON.parse(route.request().postData() ?? "{}"));
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto(`/${locale}/contact`);
    const dict = ui(locale).contactForm;

    await submit(page, locale, {
      name: "Reader",
      email: "reader@example.com",
      message: "This message is comfortably longer than ten characters.",
    });

    await expect(page.getByText(dict.success)).toBeVisible();

    expect(payloads).toHaveLength(1);
    // The edition is carried so an editor knows which language to reply in,
    // and the honeypot must be empty for a genuine submission.
    expect(payloads[0]).toMatchObject({
      name: "Reader",
      email: "reader@example.com",
      locale,
      // The honeypot. Named `reference_id`, not `website` — password managers
      // recognise and fill URL-ish fields even off-screen, and were tripping
      // the server's bot rejection for real readers.
      reference_id: "",
    });

    // A confirmed send clears the form so the same message is not sent twice.
    await expect(page.getByLabel(dict.nameLabel, { exact: false })).toHaveValue("");
    await expect(page.getByLabel(dict.messageLabel, { exact: false })).toHaveValue("");
  });
}

test("a server failure is reported, never faked as success", async ({ page }) => {
  await page.route(API, (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, reason: "error" }),
    }),
  );

  await page.goto("/hy/contact");
  const dict = ui("hy").contactForm;

  await submit(page, "hy", {
    name: "Ընթերցող",
    email: "reader@example.com",
    message: "Բավականաչափ երկար հաղորդագրություն։",
  });

  await expect(page.getByText(dict.error)).toBeVisible();
  await expect(page.getByText(dict.success)).toHaveCount(0);
  // The message stays in the field so it can be retried, not retyped.
  await expect(page.getByLabel(dict.messageLabel, { exact: false })).not.toHaveValue("");
});

test("rate limiting and missing configuration have their own messages", async ({ page }) => {
  const dict = ui("hy").contactForm;

  for (const [status, reason, expected] of [
    [429, "rate-limited", dict.rateLimited],
    [503, "unconfigured", dict.unconfigured],
  ] as const) {
    await page.route(API, (route) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, reason }),
      }),
    );

    await page.goto("/hy/contact");
    await submit(page, "hy", {
      name: "Ընթերցող",
      email: "reader@example.com",
      message: "Բավականաչափ երկար հաղորդագրություն։",
    });

    await expect(page.getByText(expected)).toBeVisible();
    await page.unroute(API);
  }
});

test("validation clears as soon as a field is corrected", async ({ page }) => {
  await page.goto("/en/contact");
  const dict = ui("en").contactForm;

  await page.getByRole("button", { name: dict.submit }).click();
  await expect(page.getByText(dict.invalidEmail)).toBeVisible();

  await page.getByLabel(dict.emailLabel, { exact: false }).fill("reader@example.com");
  await expect(page.getByText(dict.invalidEmail)).toHaveCount(0);
});
