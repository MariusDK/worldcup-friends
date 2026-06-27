'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';

const items = [
  {href: '/', label: 'Home'},
  {href: '/matches', label: 'Matches'},
  {href: '/leaderboard', label: 'Table'},
  {href: '/profile', label: 'Profile'},
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <nav className="nav-shell grid grid-cols-5 gap-1 p-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link className={`nav-item ${active ? 'nav-item-active' : ''}`} href={item.href} key={item.href}>
            {item.label}
          </Link>
        );
      })}
      <button className="nav-item" onClick={logout}>Log out</button>
    </nav>
  );
}
