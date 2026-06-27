import Link from 'next/link';
import Nav from '@/components/Nav';

const actions = [
  {href: '/matches', title: 'Current matches', detail: 'Pick scores before kick-off'},
  {href: '/leaderboard', title: 'Leaderboard', detail: 'Track points in your group'},
  {href: '/groups/new', title: 'Create group', detail: 'Start a private league'},
  {href: '/groups/join', title: 'Join group', detail: 'Enter an invite code'},
  {href: '/challenges', title: 'Challenges', detail: 'Head-to-head bets coming next'},
];

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Football Friends Predictor</p>
            <h1 className="mt-2 text-4xl font-black leading-none">Predict every match with your group.</h1>
          </div>
          <img className="hero-mark shrink-0" src="/icon.svg" alt="" width={72} height={72}/>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-white/10 p-3">
            <p className="text-2xl font-black">3</p>
            <p className="text-xs text-white/60">exact score</p>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <p className="text-2xl font-black">1</p>
            <p className="text-xs text-white/60">right result</p>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <p className="text-2xl font-black">Live</p>
            <p className="text-xs text-white/60">standings</p>
          </div>
        </div>

        <Link className="btn mt-5" href="/matches">Open matches</Link>
      </section>

      <section className="mt-5 grid gap-3">
        {actions.map((action) => (
          <Link className="card group" href={action.href} key={action.href}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-black">{action.title}</h2>
                <p className="subtle mt-1 text-sm">{action.detail}</p>
              </div>
              <span className="text-xl text-white/50 transition group-hover:text-white">{'>'}</span>
            </div>
          </Link>
        ))}
      </section>

      <Nav/>
    </main>
  );
}
