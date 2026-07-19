import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { site } from "@/data/site";

const title = "Privacy Policy";
const description = `How ${site.name} handles visitor data. The platform collects no personal information beyond an optional newsletter address.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title: `${title} | ${site.name}`, description, url: "/privacy", type: "website" },
};

const sections = [
  {
    heading: "What we collect",
    body: "Reading an article on this site requires no account and no personal information. If you subscribe to the newsletter, we store the email address you provide and nothing else. The subscription form on this version of the site is a placeholder and does not yet transmit data anywhere.",
  },
  {
    heading: "Analytics",
    body: "We use aggregated, anonymous statistics to understand which articles are read, so that we know what to write next. These statistics contain no names, no email addresses and no advertising identifiers, and they are not shared with third parties.",
  },
  {
    heading: "Cookies",
    body: "The site does not use advertising or tracking cookies. Any storage in your browser is limited to remembering interface preferences, such as your chosen language.",
  },
  {
    heading: "Children",
    body: "The platform is written for school-age readers and deliberately avoids collecting information from them. No account is needed, no profile is created and no message can be posted.",
  },
  {
    heading: "Your rights",
    body: `You can ask us at any time to remove your email address from the newsletter list. Write to ${site.contactEmail} and we will confirm the deletion.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="border-b border-line bg-surface">
      <div className="container-page py-8 md:py-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-4 text-sm text-ink-3">Last updated: 1 June 2026</p>
          <div className="prose-article mt-8">
            <p>
              {site.name} is an educational project and is built to work without collecting personal
              data. This page explains, in plain language, what that means in practice.
            </p>
            {sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
