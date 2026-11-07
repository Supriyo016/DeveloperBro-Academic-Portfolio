import type { Metadata } from "next";
import { CookieSettingsButton } from "@/components/layout/CookieNotice";
import { PageHeader } from "@/components/ui/primitives";
import { CONSENT_COOKIE, storedPreferences } from "@/lib/consent";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "Which cookies and browser storage this site uses, and how to change your choice.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cookie policy"
        title="Cookies, kept to a minimum"
        intro="This site has no analytics, no advertising and no third-party trackers. It uses one cookie for your choice, and, only if you allow it, browser storage for a few conveniences."
      />
      <div className="container-page max-w-3xl space-y-10">
        <section aria-labelledby="essential-title">
          <h2 id="essential-title" className="text-2xl">Essential</h2>
          <p className="mt-2 text-ink-2">Always on, because the site needs it to respect your choice.</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-[0.95rem]">
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="py-2 pr-3 font-medium">Name</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Type</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Purpose</th>
                  <th scope="col" className="py-2 font-medium">Lifetime</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line">
                  <th scope="row" className="py-2 pr-3 font-mono text-sm font-normal">{CONSENT_COOKIE}</th>
                  <td className="py-2 pr-3">First-party cookie</td>
                  <td className="py-2 pr-3 text-ink-2">Remembers whether you allowed preferences</td>
                  <td className="py-2">6 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="preferences-title">
          <h2 id="preferences-title" className="text-2xl">Preferences</h2>
          <p className="mt-2 text-ink-2">
            Stored in your browser only, never sent to a server. If you choose essential only, these are cleared and your settings last for the current page view.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-[0.95rem]">
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="py-2 pr-3 font-medium">Name</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Type</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Purpose</th>
                  <th scope="col" className="py-2 font-medium">Lifetime</th>
                </tr>
              </thead>
              <tbody>
                {storedPreferences.map((item) => (
                  <tr key={item.key} className="border-b border-line">
                    <th scope="row" className="py-2 pr-3 font-mono text-sm font-normal">{item.key}</th>
                    <td className="py-2 pr-3">{item.store}</td>
                    <td className="py-2 pr-3 text-ink-2">{item.purpose}</td>
                    <td className="py-2">{item.lifetime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="none-title">
          <h2 id="none-title" className="text-2xl">Analytics and advertising</h2>
          <p className="mt-2 text-ink-2">None. The site does not load analytics, advertising or social-media tracking scripts.</p>
        </section>

        <section aria-labelledby="change-title">
          <h2 id="change-title" className="text-2xl">Change your choice</h2>
          <p className="mt-2 text-ink-2">You can change it at any time. Clearing this site&apos;s data in your browser also resets it.</p>
          <div className="mt-3">
            <CookieSettingsButton />
          </div>
        </section>
      </div>
    </>
  );
}
