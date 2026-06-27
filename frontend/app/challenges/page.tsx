import Link from 'next/link';
import Nav from '@/components/Nav';

export default function Challenges() {
  return (
    <main className="page">
      <Link href="/" className="back-link">← Back</Link>
      <div className="mb-5">
        <p className="eyebrow">Head to head</p>
        <h1 className="page-title">Challenges</h1>
      </div>

      <section className="card">
        <p className="eyebrow">No changes</p>
        <h2 className="mt-2 text-2xl font-black leading-tight">No challenges at the moment.</h2>
        <p className="subtle mt-3">
          This area is not active yet. Check matches and leaderboard for the current game.
        </p>
        <Link className="btn mt-5" href="/matches">Back to matches</Link>
      </section>

      <Nav/>
    </main>
  );
}
