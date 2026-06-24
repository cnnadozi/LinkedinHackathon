/** Home page — events feed preview with attendance list and API health check. */
import AttendanceList from "@/components/AttendanceList";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type HealthResponse = {
  status: string;
  datasets: {
    users: number;
    jobs: number;
    courses: number;
  };
};

/** Ping Express on the server; returns null when the API is offline. */
async function getHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const health = await getHealth();

  return (
    <main>
      <h1>LinkedIn Gather</h1>
      <p>Events hub — attendance list preview.</p>

      <AttendanceList />

      <section className="status">
        <strong>API status</strong>
        {health ? (
          <ul>
            <li>Server: {health.status}</li>
            <li>Users: {health.datasets.users}</li>
            <li>Jobs: {health.datasets.jobs}</li>
            <li>Courses: {health.datasets.courses}</li>
          </ul>
        ) : (
          <p className="error">
            Could not reach the API at {API_BASE}. Run{" "}
            <code>npm run dev:server</code> in another terminal.
          </p>
        )}
      </section>
    </main>
  );
}
