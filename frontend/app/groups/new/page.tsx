'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Nav from '@/components/Nav';
import {ApiError, api, isLoggedIn} from '@/lib/api';

type Group = {
  id: string;
  name: string;
  inviteCode: string;
};

export default function NewGroup() {
  const [name, setName] = useState('Office League');
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) router.replace('/login');
  }, [router]);

  async function create() {
    setError('');

    try {
      setGroup(await api<Group>('/api/groups', {method: 'POST', body: JSON.stringify({name})}));
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        localStorage.removeItem('token');
        router.replace('/login');
        return;
      }
      setError(e instanceof Error ? e.message : 'Could not create group');
    }
  }

  return (
    <main className="page">
      <Link href="/" className="back-link">← Back</Link>
      <div className="mb-5">
        <p className="eyebrow">Private league</p>
        <h1 className="page-title">Create group</h1>
      </div>

      {error && <div className="card mb-3 text-red-200">{error}</div>}

      <div className="card">
        <label className="block">
          <span className="block text-sm font-bold text-white/60 mb-2">Group name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)}/>
        </label>
        <button className="btn mt-3" onClick={create}>Create group</button>
      </div>

      {group && (
        <div className="card mt-4">
          <p className="eyebrow">Invite code</p>
          <p className="mt-2 rounded-lg bg-black/25 p-4 text-center text-4xl font-black tracking-widest">{group.inviteCode}</p>
          <Link className="btn mt-4" href="/matches">Go to matches</Link>
        </div>
      )}

      <Nav/>
    </main>
  );
}
