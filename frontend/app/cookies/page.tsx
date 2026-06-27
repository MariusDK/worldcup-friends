import Link from 'next/link';

export default function CookiePolicy() {
  return (
    <main className="page page-wide">
      <Link href="/" className="back-link">← Back</Link>
      <p className="eyebrow">Legal</p>
      <h1 className="page-title mb-5">Cookie Policy</h1>

      <section className="card space-y-5 text-white/75">
        <p><strong className="text-white">Last updated:</strong> 28 June 2026</p>

        <section>
          <h2 className="text-xl font-black text-white">Current Use</h2>
          <p className="mt-2">
            The current app does not use analytics cookies, advertising cookies, tracking pixels, or
            marketing cookies. Login state is stored using a JWT in browser local storage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-white">Essential Technologies</h2>
          <p className="mt-2">
            Browser local storage is used to keep the user logged in. This is necessary for account
            access, group membership, predictions, and leaderboard features. Users can clear local
            storage from browser settings or use Log out.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-white">Future Analytics Or Cookies</h2>
          <p className="mt-2">
            If analytics, advertising, or other non-essential cookies are added later, the app should
            add a cookie consent mechanism before enabling them where required by applicable law.
          </p>
        </section>
      </section>
    </main>
  );
}
