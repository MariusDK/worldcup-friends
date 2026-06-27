import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="page page-wide">
      <Link href="/" className="back-link">← Back</Link>
      <p className="eyebrow">Legal</p>
      <h1 className="page-title mb-5">Privacy Policy</h1>

      <section className="card space-y-5 text-white/75">
        <p><strong className="text-white">Last updated:</strong> 28 June 2026</p>
        <p>
          Football Friends Predictor is an independent fan-made football prediction game for
          entertainment purposes only. This policy explains what personal data is collected, why it
          is used, and the choices users have.
        </p>

        <PolicyBlock title="Data We Collect">
          <ul className="list-disc space-y-2 pl-5">
            <li>Account data: email address, display name, user ID, account creation time.</li>
            <li>Authentication data: password hash, JWT login token stored in browser local storage.</li>
            <li>Game data: predictions, points, group memberships, invite codes, and challenge records if used.</li>
            <li>Operational data: server logs, error logs, IP address metadata, browser/device metadata, and security events where hosting providers collect them.</li>
          </ul>
        </PolicyBlock>

        <PolicyBlock title="Why We Use Data">
          <ul className="list-disc space-y-2 pl-5">
            <li>To create and secure accounts.</li>
            <li>To let users create groups, join groups, save predictions, and view leaderboards.</li>
            <li>To prevent abuse, debug errors, maintain service availability, and protect users.</li>
            <li>To comply with legal obligations and respond to valid user privacy requests.</li>
          </ul>
        </PolicyBlock>

        <PolicyBlock title="GDPR Legal Bases">
          <ul className="list-disc space-y-2 pl-5">
            <li>Contract: providing the account, groups, predictions, and leaderboard features.</li>
            <li>Legitimate interests: security, fraud prevention, debugging, and service improvement.</li>
            <li>Legal obligation: responding to valid legal, privacy, or regulatory requests.</li>
            <li>Consent: only where optional cookies, analytics, or marketing are added in the future.</li>
          </ul>
        </PolicyBlock>

        <PolicyBlock title="Third-Party Services">
          <p>
            The app may use hosting providers, Supabase/PostgreSQL, deployment providers, and a
            third-party football match data API. Match data is currently provided by the free and
            open-source worldcup2026 API project, which documents an ISC License and optional
            support for its development. The app should continue to follow that project's license
            and Terms of Service. No external data source should be described as official unless
            that is documented in writing.
          </p>
        </PolicyBlock>

        <PolicyBlock title="Cookies And Local Storage">
          <p>
            The current app does not use analytics or advertising cookies. Authentication uses a JWT
            stored in browser local storage. If analytics, advertising, or non-essential cookies are
            added later, the app should add a consent mechanism before enabling them where required
            by law.
          </p>
        </PolicyBlock>

        <PolicyBlock title="Retention">
          <p>
            Account, group, prediction, and leaderboard data is kept while the account remains
            active. Users may request deletion from the Profile page. Operational logs are retained
            only as long as reasonably needed for security, debugging, legal compliance, or hosting
            provider requirements.
          </p>
        </PolicyBlock>

        <PolicyBlock title="Security">
          <p>
            Passwords are stored as hashes, not plain text. The production service should use HTTPS,
            keep secrets outside source control, restrict database access, and avoid logging
            passwords, JWTs, or unnecessary personal data.
          </p>
        </PolicyBlock>

        <PolicyBlock title="Your Rights">
          <p>
            Depending on your location, you may have rights to access, correct, export, delete,
            object to, or restrict processing of your personal data. Logged-in users can use the
            Profile page to update account details, change password, export account data, and delete
            the account.
          </p>
        </PolicyBlock>

        <PolicyBlock title="Contact">
          <p>
            For privacy requests, contact: <strong className="text-white">footballpredictor95@gmail.com</strong>.
          </p>
        </PolicyBlock>
      </section>
    </main>
  );
}

function PolicyBlock({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section>
      <h2 className="text-xl font-black text-white">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
