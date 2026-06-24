# LinkedIn Gather

LinkedIn Gather helps Gen Z discover events, manage their schedule, and connect with attendees before and after they show up.

## What it does

- **Personalized event feed** — browse all events or filter to ones you're attending
- **Event detail pages** — host info, RSVP, attendee list with connection filters, and mutual-event overlap
- **Gather calendar** — full-page view of your RSVP'd and upcoming events, color-coded by industry
- **Nudge chat** — start a conversation from the attendee list with AI-suggested talking points (Gemini API with a heuristic fallback when no key is set)


## How to run

```bash
npm install
npm run dev          # http://localhost:3000
npm test
```

Optional: set `GEMINI_API_KEY` in `.env.local` for live AI suggestions. Set `MAIN_USER_ID` to swap the demo user.

See `docs/` and `AGENTS.md` for architecture, UI patterns, and more information

## Contributors

- Atiqa Ullah
- Chikaosolu Nnadozie
- Paul Osei Afriyie
- Juliana Noreus
- Folashewa Olaniyi
