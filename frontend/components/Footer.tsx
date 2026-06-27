import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-lg px-4 pb-28 pt-8 text-sm text-white/55">
      <p>
        This application is an independent fan-made football prediction game for entertainment
        purposes only. It is not affiliated with, endorsed by, sponsored by, or associated with FIFA
        or any football federation. All trademarks belong to their respective owners.
      </p>
      <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-bold text-white/70">
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/cookies">Cookies</Link>
      </nav>
    </footer>
  );
}
