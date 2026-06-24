/** Home page — events feed preview with attendance list and dataset status. */
import Link from "next/link";
import AttendanceList from "@/components/AttendanceList";
import {
  loadDatasetHealth,
  loadEventDetailFromDataset,
} from "@/lib/eventDetail.server";

export default async function Home() {
  const health = loadDatasetHealth();
  const featuredEvent = loadEventDetailFromDataset("event_0001");

  return (
    <main>
      <h1>LinkedIn Gather</h1>
      <p>Events hub — attendance list preview.</p>

      {featuredEvent && (
        <section className="status">
          <strong>Featured event</strong>
          <p>
            <Link href={`/events/${featuredEvent.event.id}`}>
              {featuredEvent.event.name}
            </Link>{" "}
            · {featuredEvent.event.location}
          </p>
        </section>
      )}

      <AttendanceList />

      <section className="status">
        <strong>Dataset status</strong>
        <ul>
          <li>Server: {health.status}</li>
          <li>Users: {health.datasets.users}</li>
          <li>Jobs: {health.datasets.jobs}</li>
          <li>Courses: {health.datasets.courses}</li>
          <li>Events: {health.datasets.events}</li>
        </ul>
      </section>
    </main>
  );
}
