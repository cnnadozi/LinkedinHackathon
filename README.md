# LinkedIn Gather

A reimagined LinkedIn events experience for the Possibilities in Tech Hackathon 2026. Built with Next.js, React, and TypeScript, it helps professionals discover events, manage their schedule, and connect with attendees before and after they show up.

## What it does

- **Personalized event feed** — browse all events or filter to ones you're attending
- **Event detail pages** — host info, RSVP, attendee list with connection filters, and mutual-event overlap
- **Gather calendar** — full-page view of your RSVP'd and upcoming events, color-coded by industry
- **Nudge chat** — start a conversation from the attendee list with AI-suggested talking points (Gemini API with a heuristic fallback when no key is set)


## Tech stack

Next.js (App Router), React, TypeScript, Google Gemini API, Vitest

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm test
```

Optional: set `GEMINI_API_KEY` in `.env.local` for live AI suggestions. Set `MAIN_USER_ID` to swap the demo user.

See `docs/` and `AGENTS.md` for architecture, UI patterns, and agent guidelines.

## Contributors

- Atiqa Ullah
- Chikaosolu Nnadozie
- Paul Osei Afriyie
- Juliana Noreus
- Folashewa Olaniyi
