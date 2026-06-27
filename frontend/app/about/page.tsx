import Link from 'next/link';

export default function About() {
  return (
    <main className="page page-wide">
      <Link href="/" className="back-link">← Back</Link>
      <p className="eyebrow">About</p>
      <h1 className="page-title mb-5">Football Friends Predictor</h1>

      <section className="card space-y-5 text-white/75">
        <p>
          Football Friends Predictor is a private-group football score prediction game. Friends can
          create groups, join with invite codes, predict scores, and compare virtual points on a
          leaderboard.
        </p>

        <section>
          <h2 className="text-xl font-black text-white">No Betting Or Gambling</h2>
          <p className="mt-2">
            The app uses virtual points only. It does not support entry fees, deposits, withdrawals,
            betting, cash prizes, or real-money rewards.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-white">Unofficial Fan Project</h2>
          <p className="mt-2">
            This application is an independent fan-made football prediction game for entertainment
            purposes only. It is not affiliated with, endorsed by, sponsored by, or associated with
            FIFA or any football federation. All trademarks belong to their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-white">Match Data Notice</h2>
          <p className="mt-2">
            Match data is currently provided by the free and open-source worldcup2026 API project,
            which documents an ISC License and optional support for its development. The app should
            continue to follow that project's license and Terms of Service, and should not claim
            that external match data is official unless that is documented in writing.
          </p>
        </section>
      </section>
    </main>
  );
}
