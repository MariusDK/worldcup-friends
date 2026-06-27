'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Nav from '@/components/Nav';
import {ApiError, api, isLoggedIn} from '@/lib/api';

type UserProfile = {
  id?: string;
  displayName: string;
  email: string;
  createdAt?: string;
};

type Group = {
  id: string;
  name: string;
  inviteCode: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }

    Promise.all([api<UserProfile>('/api/me'), api<Group[]>('/api/groups')])
      .then(([user, userGroups]) => {
        setProfile(user);
        setDisplayName(user.displayName);
        setEmail(user.email);
        setGroups(userGroups);
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [router]);

  function handleError(e: unknown) {
    if (e instanceof ApiError && e.status === 403) {
      localStorage.removeItem('token');
      router.replace('/login');
      return;
    }

    setError(e instanceof Error ? e.message : 'Could not load profile.');
  }

  async function updateProfile() {
    setError('');
    setMessage('');

    try {
      const updated = await api<UserProfile>('/api/account', {
        method: 'PATCH',
        body: JSON.stringify({displayName, email}),
      });
      setProfile(updated);
      setDisplayName(updated.displayName);
      setEmail(updated.email);
      setMessage('Account details updated.');
    } catch (e) {
      handleError(e);
    }
  }

  async function changePassword() {
    setError('');
    setMessage('');

    try {
      await api('/api/account/password', {
        method: 'POST',
        body: JSON.stringify({currentPassword, newPassword}),
      });
      setCurrentPassword('');
      setNewPassword('');
      setMessage('Password changed.');
    } catch (e) {
      handleError(e);
    }
  }

  async function exportData() {
    setError('');
    setMessage('');

    try {
      const data = await api<unknown>('/api/account/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'football-friends-account-export.json';
      link.click();
      URL.revokeObjectURL(url);
      setMessage('Account export created.');
    } catch (e) {
      handleError(e);
    }
  }

  async function deleteAccount() {
    if (!deletePassword) {
      setError('Enter your password to delete the account.');
      return;
    }

    const confirmed = window.confirm('Delete your account and personal game data? This cannot be undone.');
    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      await api('/api/account', {
        method: 'DELETE',
        body: JSON.stringify({password: deletePassword}),
      });
      localStorage.removeItem('token');
      router.replace('/login');
    } catch (e) {
      handleError(e);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    router.replace('/login');
  }

  if (!mounted || loading) {
    return (
      <main className="page">
        <p className="eyebrow">Account</p>
        <h1 className="page-title mb-5">Profile</h1>
        <div className="card text-white/60">Loading profile...</div>
        <Nav/>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="mb-5">
        <p className="eyebrow">Account</p>
        <h1 className="page-title">Profile</h1>
      </div>

      {error && <div className="card mb-3 text-red-200">{error}</div>}
      {message && <div className="card mb-3 text-emerald-200">{message}</div>}

      {profile && (
        <section className="card">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-emerald-300 to-yellow-300 text-black text-2xl font-black">
              {profile.displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-black truncate">{profile.displayName}</h2>
              <p className="text-white/60 truncate">{profile.email}</p>
              {profile.createdAt && <p className="text-white/40 text-sm">Joined {new Date(profile.createdAt).toLocaleDateString()}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-3xl font-black">{groups.length}</p>
              <p className="text-white/50 text-sm">groups</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-3xl font-black">On</p>
              <p className="text-white/50 text-sm">account status</p>
            </div>
          </div>
        </section>
      )}

      <section className="card mt-5">
        <p className="eyebrow">Privacy rights</p>
        <h2 className="mt-2 text-xl font-black">Account details</h2>
        <div className="mt-4 grid gap-3">
          <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name"/>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
          <button className="btn" onClick={updateProfile}>Update details</button>
        </div>
      </section>

      <section className="card mt-5">
        <p className="eyebrow">Security</p>
        <h2 className="mt-2 text-xl font-black">Change password</h2>
        <div className="mt-4 grid gap-3">
          <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password"/>
          <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password"/>
          <button className="btn" onClick={changePassword}>Change password</button>
        </div>
      </section>

      <section className="card mt-5">
        <p className="eyebrow">Data controls</p>
        <h2 className="mt-2 text-xl font-black">Export or delete</h2>
        <p className="subtle mt-2">
          Export includes account, group membership, prediction, and challenge records held by the app.
        </p>
        <div className="mt-4 grid gap-3">
          <button className="btn btn-secondary" onClick={exportData}>Export my data</button>
          <input className="input" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Password for account deletion"/>
          <button className="btn" onClick={deleteAccount}>Delete account</button>
        </div>
      </section>

      <div className="grid gap-3 mt-5">
        <Link className="card" href="/matches">Current matches</Link>
        <Link className="card" href="/leaderboard">Leaderboard</Link>
        <Link className="card" href="/groups/join">Join group</Link>
        <button className="btn" onClick={logout}>Log out</button>
      </div>

      <Nav/>
    </main>
  );
}
