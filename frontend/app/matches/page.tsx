'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {ApiError, api, isLoggedIn} from '@/lib/api';
import {countryFlag} from '@/lib/countryFlags';
import Nav from '@/components/Nav';

type Match = {id: string; homeTeam: string; awayTeam: string; kickoffAt: string; localKickoffAt?: string; timeZone?: string; status: string};
type Group = {id: string; name: string; inviteCode: string};
type Prediction = {id: string; matchId: string; groupId: string; homeScore: number; awayScore: number};
type Scores = Record<string, {home: string; away: string}>;
type SaveState = Record<string, string>;

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [scores, setScores] = useState<Scores>({});
  const [saveState, setSaveState] = useState<SaveState>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setLoggedIn(isLoggedIn());
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    api<Match[]>(`/api/matches/today?timeZone=${encodeURIComponent(timeZone)}`)
      .then(setMatches)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load matches'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!mounted || !loggedIn) return;
    api<Group[]>('/api/groups')
      .then((items) => {
        setGroups(items);
        setSelectedGroupId((current) => current || items[0]?.id || '');
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 403) {
          localStorage.removeItem('token');
          setLoggedIn(false);
        }
      });
  }, [mounted, loggedIn]);

  useEffect(() => {
    if (!mounted || !loggedIn || !selectedGroupId) return;
    api<Prediction[]>(`/api/groups/${selectedGroupId}/my-predictions`)
      .then((items) => {
        setScores((current) => {
          const next = {...current};
          for (const prediction of items) {
            next[prediction.matchId] = {
              home: String(prediction.homeScore),
              away: String(prediction.awayScore),
            };
          }
          return next;
        });
        setSaveState((current) => {
          const next = {...current};
          for (const prediction of items) {
            next[prediction.matchId] = 'Prediction saved.';
          }
          return next;
        });
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 403) {
          localStorage.removeItem('token');
          setLoggedIn(false);
        }
      });
  }, [mounted, loggedIn, selectedGroupId]);

  function updateScore(matchId: string, field: 'home' | 'away', value: string) {
    setScores((current) => ({
      ...current,
      [matchId]: {...(current[matchId] || {home: '', away: ''}), [field]: value},
    }));
  }

  async function savePrediction(match: Match) {
    if (isLocked(match)) {
      setSaveState((current) => ({...current, [match.id]: 'Prediction locked: match already started.'}));
      return;
    }
    if (!loggedIn) {
      router.push('/login');
      return;
    }
    if (!selectedGroupId) {
      setSaveState((current) => ({...current, [match.id]: 'Create or join a group first.'}));
      return;
    }

    const score = scores[match.id] || {home: '', away: ''};
    const homeScore = Number(score.home);
    const awayScore = Number(score.away);

    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
      setSaveState((current) => ({...current, [match.id]: 'Enter valid scores.'}));
      return;
    }

    setSaveState((current) => ({...current, [match.id]: 'Saving...'}));
    try {
      await api('/api/predictions', {
        method: 'POST',
        body: JSON.stringify({groupId: selectedGroupId, matchId: match.id, homeScore, awayScore}),
      });
      setSaveState((current) => ({...current, [match.id]: 'Prediction saved.'}));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        localStorage.removeItem('token');
        setLoggedIn(false);
        router.push('/login');
        return;
      }
      setSaveState((current) => ({
        ...current,
        [match.id]: e instanceof Error ? e.message : 'Could not save prediction.',
      }));
    }
  }

  if (!mounted) {
    return (
      <main className="page">
        <Link href="/" className="back-link">← Back</Link>
        <p className="eyebrow">Predictions</p>
        <h1 className="page-title mb-5">Current matches</h1>
        <div className="card text-white/60">Loading matches...</div>
        <Nav/>
      </main>
    );
  }

  return (
    <main className="page">
      <Link href="/" className="back-link">← Back</Link>
      <div className="mb-5">
        <p className="eyebrow">Predictions</p>
        <h1 className="page-title">Current matches</h1>
      </div>

      {loggedIn && groups.length > 0 && (
        <label className="block mb-4">
          <span className="block text-white/60 text-sm mb-2">Group</span>
          <select className="input" value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
            {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select>
        </label>
      )}

      {loggedIn && groups.length === 0 && (
        <div className="card mb-4 text-white/70">
          <p>Create a group before saving predictions.</p>
          <Link className="btn mt-3" href="/groups/new">Create group</Link>
        </div>
      )}

      {error && <div className="card mb-3 text-red-200">{error}</div>}
      {loading && <div className="card text-white/60">Loading matches...</div>}
      {!loading && !error && matches.length === 0 && <div className="card text-white/60">No current matches found.</div>}

      <div className="grid gap-3">
        {matches.map((match) => {
          const state = saveState[match.id];
          const score = scores[match.id] || {home: '', away: ''};
          const locked = isLocked(match);
          return (
            <div className="card" key={match.id}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-white/70">{formatKickoff(match)}</p>
                <span className={`rounded-full px-2 py-1 text-xs font-black ${locked ? 'bg-white/10 text-white/55' : 'bg-emerald-300 text-black'}`}>
                  {locked ? 'Locked' : 'Open'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <TeamBlock align="left" flag={countryFlag(match.homeTeam)} name={match.homeTeam}/>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/45">VS</span>
                <TeamBlock align="right" flag={countryFlag(match.awayTeam)} name={match.awayTeam}/>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <input className="input text-center text-lg font-black" inputMode="numeric" min="0" value={score.home} onChange={(e) => updateScore(match.id, 'home', e.target.value)} placeholder="Home"/>
                <input className="input text-center text-lg font-black" inputMode="numeric" min="0" value={score.away} onChange={(e) => updateScore(match.id, 'away', e.target.value)} placeholder="Away"/>
              </div>
              <button className="btn mt-3" disabled={locked} onClick={() => savePrediction(match)}>{locked ? 'Prediction locked' : 'Save prediction'}</button>
              {state && <p className="text-white/60 text-sm mt-3">{state}</p>}
            </div>
          );
        })}
      </div>
      <Nav/>
    </main>
  );
}

function TeamBlock({align, flag, name}: {align: 'left' | 'right'; flag: string; name: string}) {
  return (
    <div className={`min-w-0 ${align === 'right' ? 'text-right' : ''}`}>
      <p className="text-3xl">{flag}</p>
      <h2 className="mt-1 truncate text-lg font-black">{name}</h2>
    </div>
  );
}

function isLocked(match: Match) {
  return !isOpenForPredictions(match.status);
}

function isOpenForPredictions(status: string) {
  return !status || status.toUpperCase() === 'SCHEDULED' || status.toUpperCase() === 'NOTSTARTED';
}

function formatKickoff(match: Match) {
  const date = new Date(match.kickoffAt);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  if (Number.isNaN(date.getTime())) {
    return match.kickoffAt;
  }

  return `${date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone,
  })}, ${date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
    hour12: false,
  })} ${shortTimeZone(timeZone)}`;
}

function shortTimeZone(timeZone: string) {
  return timeZone.split('/').at(-1)?.replaceAll('_', ' ') || timeZone;
}
