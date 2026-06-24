# LinkedIn Gather

Elevating and expanding LinkedIn's event experience for seamless discovery and connection.

## The Vision
LinkedIn Gather is a reimagined LinkedIn events experience. Built with Next.js (App Router), React, and TypeScript, our solution turns event discovery into a proactive networking tool. It helps professionals seamlessly track their schedules, discover opportunities, and leverage mutual connections to make meaningful real-world interactions.

## AI Features (Powered by Google Gemini)
We use the Google Gemini API (`gemini-1.5-flash`) to power intelligent event discovery and networking suggestions. Each AI feature has a markdown prompt stored in `prompts/` and a deterministic heuristic fallback, ensuring the app functions perfectly even without an API key.

*   **Personalized Event Ranking:** (`lib/eventRanking.server.ts`) Orders the main events feed based on the user's location, industry, skills, and courses. 
*   **AI-Powered Nudge Follow-Ups:** (`lib/nudgeSuggestions.server.ts`) Generates insights for the AI connection panel, pulling shared themes and mutual events from real data, and offering three suggested talking points to help users craft a personalized message in their own voice.

## Pages
*   `/` — Automatically redirects to `/events`.
*   `/events` — The main personalized events feed. Features an "All events" vs "Attending" filter, attendee counts, pagination, and a collapsible side calendar panel tracking your RSVPs.
*   `/events/[eventId]` — The detailed event page containing the banner, host info, an expandable description, attendance summary (e.g., *"248 attendees · 12 connections"*), an RSVP toggle, and the attendee modal.
*   `/gather` — A dedicated, full-page calendar view of RSVP'd and upcoming events, complete with an industry-colored legend.

## Key Components
*   **Attendee Modal (`AttendeeModal.tsx`):** The comprehensive guest list. Filter attendees by connection degree (1st/2nd/3rd+), location, company, and industry. Each row displays the guest's headline, location, inline connection degree, "Also attending" mutual events, and a "Nudge" button.
*   **Nudge Chat (`NudgeChat.tsx`):** A floating, LinkedIn-style chat window triggered by the Nudge button. Messages here are local-only and not persisted. 
*   **AI Connection Panel (`AiConnectionPanel.tsx`):** A collapsible, sparkle-iconed panel inside the Nudge Chat. It contains three sections: Shared Themes, Mutual Events (last 6 months), and Suggested Talking Points (read-only idea prompts for what to bring up, *not* pre-written clickable messages).
*   **LinkedIn Primitives:** A set of reusable UI components in `components/linkedin/`, including the calendar overlay, event cards, and the main navigation shell.

## Data Structure
All application data lives in flat JSON files inside the `data/` directory:
*   `user_data.json`: Contains members, skills, courses, schools, posts, connections, and attending event IDs.
*   `jobs_data.json` & `course_data.json`: Supplemental professional data.
*   `events_data.json`: The database of events generated specifically for this project. 

*Note: Original member, job, and course data was sourced from pit.najera.cc.*

## Tech & Tooling
*   **Frameworks:** Next.js (App Router), React, TypeScript
*   **AI Integration:** `@google/generative-ai` (Gemini API)
*   **Icons:** `lucide-react`, `@heroicons/react`
*   **Testing:** Vitest + Testing Library (jsdom). We currently have 73 tests across 18 files (configured via `vitest.config.mts`). Run tests with `npm test`.

## Contributors
*   **Paul Osei Afriyie**
*   **Chikaosolu Nnadozie**
*   **Juliana Noreus**
*   **Atiqa Ullah**
*   **Folashewa Olaniyi**

## Note
Visit the `docs/` folder and read **[docs/APP_MAP.md](./docs/APP_MAP.md)**, **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**, **[docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)**, **[docs/UI_DESIGN.md](./docs/UI_DESIGN.md)**, and **AGENTS.md** for more context! 

**Important:** The demo’s logged-in member is fixed — **Alice Johnson** (`user_5736`, `MAIN_USER_ID`). See the **Main user** section in [docs/APP_MAP.md](./docs/APP_MAP.md) for her attending events and everywhere her identity/signals are used to drive personalization and connections.

## Getting started

```bash
npm install
npm run dev          # UI + API at http://localhost:3000
npm test             # run unit tests