# Football Friends Predictor

Mobile-first prediction game with friends. No real-money betting: points, private groups, 1v1 challenges, leaderboard.

## Run locally

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Postgres: localhost:5432/worldcup

## MVP flow

1. Register/login
2. Create a group
3. Share invite code
4. See football matches
5. Submit predictions before kickoff
6. Create 1v1 challenges
7. View leaderboard

## Backend

Java 25 + Spring Boot + PostgreSQL + Liquibase.

Main packages:

- `auth`
- `users`
- `groups`
- `matches`
- `predictions`
- `challenges`
- `leaderboard`

## API

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/me

POST /api/groups
GET  /api/groups
POST /api/groups/join/{inviteCode}
GET  /api/groups/{groupId}

GET  /api/matches
GET  /api/matches/today
POST /api/predictions
GET  /api/groups/{groupId}/predictions

POST /api/challenges
POST /api/challenges/{challengeId}/accept
POST /api/challenges/{challengeId}/decline
GET  /api/groups/{groupId}/challenges

GET  /api/groups/{groupId}/leaderboard
```

## Next steps

- Connect match prediction form to `/api/predictions` with selected group.
- Add group member list and opponent picker.
- Add scoring job when match result changes.
- Verify third-party match data licensing before public launch.
- Add PWA manifest + push notifications.

## Legal/product rule

Keep the first version clean:

- no wallet
- no deposits
- no withdrawals
- no stake wording
- no betting wording

Use: challenge, prediction, points, private league.

Public launch disclaimer:

This application is an independent fan-made football prediction game for entertainment purposes only.
It is not affiliated with, endorsed by, sponsored by, or associated with FIFA or any football federation.
All trademarks belong to their respective owners.
