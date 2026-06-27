import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="page page-wide">
      <Link href="/" className="back-link">← Back</Link>
      <p className="eyebrow">Legal</p>
      <h1 className="page-title mb-5">Terms of Service</h1>

      <section className="card space-y-5 text-white/75">
        <p><strong className="text-white">Last updated:</strong> 28 June 2026</p>

        <TermBlock title="Entertainment Only">
          <p>
            Football Friends Predictor is a fan-made football score prediction game for
            entertainment purposes only. It does not offer betting, gambling, deposits, withdrawals,
            entry fees, cash prizes, or real-money rewards.
          </p>
        </TermBlock>

        <TermBlock title="Unofficial Project Disclaimer">
          <p>
            This application is an independent fan-made football prediction game for entertainment
            purposes only. It is not affiliated with, endorsed by, sponsored by, or associated with
            FIFA or any football federation. All trademarks belong to their respective owners.
          </p>
        </TermBlock>

        <TermBlock title="Accounts">
          <p>
            Users are responsible for keeping login credentials secure and for all activity under
            their account. Do not create accounts using someone else's email or impersonate another
            person.
          </p>
        </TermBlock>

        <TermBlock title="Acceptable Use">
          <ul className="list-disc space-y-2 pl-5">
            <li>Do not abuse, attack, scrape, overload, or interfere with the service.</li>
            <li>Do not attempt to access another user's account or private group without permission.</li>
            <li>Do not submit unlawful, abusive, misleading, or infringing content.</li>
            <li>Do not use the service for gambling, wagering, or real-money prize schemes.</li>
          </ul>
        </TermBlock>

        <TermBlock title="Prediction Rules">
          <p>
            Users may submit score predictions for matches while predictions are open. Predictions
            are locked once a match starts, finishes, or is otherwise marked closed by the system.
            Points are virtual only and have no monetary value.
          </p>
        </TermBlock>

        <TermBlock title="Third-Party Match Data">
          <p>
            Match schedules, teams, scores, stadiums, and related data currently come from the free
            and open-source worldcup2026 API project, which documents an ISC License and optional
            support for its development. The app must continue to follow that project's license and
            Terms of Service. The app makes no claim that external match data is official unless
            separately documented.
          </p>
        </TermBlock>

        <TermBlock title="Intellectual Property">
          <p>
            The application code, design, and original content belong to the app operator or their
            licensors. Football competition names, team names, marks, and other third-party
            trademarks belong to their respective owners. Users receive no rights in third-party
            trademarks.
          </p>
        </TermBlock>

        <TermBlock title="User Content">
          <p>
            Users remain responsible for content they submit, including display names, group names,
            and predictions. By submitting content, users allow the app to store and display it as
            needed to provide the service.
          </p>
        </TermBlock>

        <TermBlock title="Suspension Or Termination">
          <p>
            Accounts may be suspended or terminated for abuse, security risk, legal compliance,
            violation of these Terms, or misuse of the service.
          </p>
        </TermBlock>

        <TermBlock title="Availability And Changes">
          <p>
            The service is provided on an as-is and as-available basis. Features, match data,
            scoring, and availability may change, fail, or be discontinued.
          </p>
        </TermBlock>

        <TermBlock title="Limitation Of Liability">
          <p>
            To the maximum extent permitted by law, the operator is not liable for indirect,
            incidental, special, consequential, or punitive damages, loss of data, loss of access, or
            inaccurate match data.
          </p>
        </TermBlock>

        <TermBlock title="Governing Law">
          <p>
            These Terms are governed by the laws of Romania. If you are a consumer located in the
            European Union, you may also have mandatory rights under the laws of your country of
            residence.
          </p>
        </TermBlock>
      </section>
    </main>
  );
}

function TermBlock({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section>
      <h2 className="text-xl font-black text-white">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
