'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Nav from '@/components/Nav';
import {ApiError, api, isLoggedIn} from '@/lib/api';

type Group = {id: string; name: string; inviteCode: string};
type LeaderboardRow = {userId: string; displayName: string; role?: string; points: number; predictions: number};

export default function Leaderboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }

    api<Group[]>('/api/groups')
      .then((items) => {
        setGroups(items);
        setSelectedGroupId(items[0]?.id || '');
      })
      .catch(handleAuthError)
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!mounted || !selectedGroupId) return;

    setError('');
    api<LeaderboardRow[]>(`/api/groups/${selectedGroupId}/leaderboard`)
      .then(setRows)
      .catch(handleAuthError);
  }, [mounted, selectedGroupId]);

  function handleAuthError(e: unknown) {
    if (e instanceof ApiError && e.status === 403) {
      localStorage.removeItem('token');
      router.replace('/login');
      return;
    }
    setError(e instanceof Error ? e.message : 'Could not load leaderboard.');
  }

  if (!mounted) {
    return (
      <main className="page">
        <p className="eyebrow">Group standings</p>
        <h1 className="page-title mb-5">Leaderboard</h1>
        <div className="card text-white/60">Loading leaderboard...</div>
        <Nav/>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="mb-5">
        <p className="eyebrow">Group standings</p>
        <h1 className="page-title">Leaderboard</h1>
      </div>

      {error && <div className="card mb-3 text-red-200">{error}</div>}
      {loading && <div className="card text-white/60">Loading leaderboard...</div>}

      {!loading && groups.length === 0 && (
        <div className="card text-white/70">
          <p>Create or join a group first.</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link className="btn text-center" href="/groups/new">Create</Link>
            <Link className="btn text-center" href="/groups/join">Join</Link>
          </div>
        </div>
      )}

      {groups.length > 0 && (
        <>
          <label className="block mb-4">
            <span className="block text-white/60 text-sm mb-2">Group</span>
            <select className="input" value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
              {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
          </label>

          <div className="grid gap-3">
            {rows.map((row, index) => (
              <div className="card flex items-center justify-between gap-4" key={row.userId}>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 font-black text-white">
                    #{index + 1}
                  </div>
                  <div className="min-w-0">
                  <h2 className="truncate text-lg font-black">{row.displayName}</h2>
                  <p className="text-white/50 text-sm">
                    {roleLabel(row.role)} · {row.predictions} predictions
                  </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black">{row.points}</p>
                  <p className="text-white/50 text-sm">points</p>
                </div>
              </div>
            ))}
          </div>

          {rows.length === 0 && <div className="card text-white/60">No leaderboard rows yet.</div>}
        </>
      )}

      <Nav/>
    </main>
  );
}

function roleLabel(role?: string) {
  return role?.toUpperCase() === 'OWNER' ? 'Owner' : 'Member';
}
