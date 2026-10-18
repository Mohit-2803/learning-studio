# Learning Studio

A local course hub for learning software tools through clear lessons and hands-on examples. The landing page at `/` links to two courses:

- **GraphQL** at `/courses/graphql/`: an 18 chapter path from client/server fundamentals through schema design, pagination, errors, authorization, resolver performance, API security, subscriptions, and a final practice lab.
- **Docker** at `/courses/docker/`: a 20 chapter path from Engine and containers through Compose, health, capacity, image design, secrets, registries, least privilege, operational diagnosis, and a final capstone.

## Start the project

You need Node.js 18 or newer and npm.

```sh
npm install
npm start
```

Open <http://localhost:3000> to browse the course catalog. The GraphQL sample library is stored in memory, so added books and reading status changes reset when you restart the server.

## Firebase accounts and saved progress

Firebase Authentication provides email/password and Google sign-in. Cloud Firestore stores a learner's course position, GraphQL challenge and interview progress, Docker interview progress, and Docker lab project state at `users/{uid}/progress/course-progress`. Learners enter through the account page from the course library; course links carry their destination through sign-in or account creation.

1. In Firebase Console, enable **Email/Password** and **Google** under Authentication → Sign-in method. Add `localhost` to Authentication → Settings → Authorized domains if it is not already listed.
2. Create a **Cloud Firestore** database. After creation, publish the rules from [`firestore.rules`](./firestore.rules) in Firestore → Rules. They restrict progress access to the signed-in owner.
3. Copy [`.env.example`](./.env.example) to `.env` if needed. The Firebase project values from the registered web app are already in the local, ignored `.env`; fill in `FIREBASE_API_KEY` from the web app config.
4. Start the app with `npm start`. The landing page offers separate **Sign in** and **Create account** actions; choosing a course opens the account page first, then returns the learner to that course. Course headers link back to the same account flow when a learner wants to sync progress.

The Firebase web API key identifies the project; it is public client configuration. The server exposes only the six Firebase web config fields through `/api/firebase-config`; it never sends other environment variables to the browser. Do not add service-account JSON, private keys, or other server credentials to `public/`. Firebase Storage is not needed for course progress because there are no user file uploads; Firestore is the appropriate store for this structured data. The GraphQL demo API remains a local teaching API and does not use Firebase authentication to protect its sample records.

## What to explore

The GraphQL lessons progress from foundations to applied query and schema work, then cover cursor pagination, error behavior, authorization boundaries, N+1 resolver work, query-cost controls, and real-time trade-offs. Each chapter has its own experiment; the final lab gathers the examples, fourteen hands-on challenges, and twelve interview questions. The live API implements cursor pagination and exposes resolver traces. It deliberately has no authentication, authorization, or query-cost enforcement; those production concerns are explained as design exercises rather than represented as working safeguards.

The Docker course progresses from Engine startup through images, containers, networking, persistence, Compose, build cache, health, resource limits, multi-stage images, secret hygiene, registry workflows, least privilege, and evidence-based operations. Each chapter has context, pitfalls, learning checks, and a hands-on mission. The final lab has fourteen goals and twelve interview scenarios. The modeled Engine starts off; learners start it and check `docker info` before using daemon commands. The browser terminal simulates common CLI behavior and object changes without starting Docker on the host or contacting a registry. Commands such as `docker tag` and `docker push` are explicitly simulated. Docker security and isolation settings are recorded for learning but are not applied to the host kernel.

The Node.js server defines a schema, validates each operation, and runs resolver functions that read or change the sample data. The GraphQL course sends POST requests to `/graphql`; `GET /api/state` returns live sample data and `POST /api/reset` restores it. The current sample data lives in memory rather than a database; a real resolver can call an existing database or service. If a backend currently offers only REST, it needs a GraphQL server or gateway as well—using GraphQL in React alone does not add GraphQL support to the backend. For example:

```json
{"query":"{ books { title author } }"}
```

Queries read data. Mutations modify the in-memory sample data. `server/schema.js` describes the API contract, `server/data.js` owns starter data and reset behavior, and `server/resolvers.js` contains query and mutation logic.

## Project structure

```text
Learning/
├── server.js                 # Static server and GraphQL HTTP endpoint
├── server/                   # Schema, resolvers, and in-memory sample data
├── public/
│   ├── index.html            # Course catalog
│   ├── shared.css            # Shared type and layout defaults
│   └── courses/
│       ├── graphql/          # GraphQL course page, styling, and lesson logic
│       └── docker/           # Docker course page, styling, and simulator
└── obsidian/                 # Course notes and reusable learning blueprint
```
