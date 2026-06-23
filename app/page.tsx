const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type HealthResponse = {
  status: string;
  datasets: {
    users: number;
    jobs: number;
    courses: number;
  };
};

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
      <h1>LinkedIn Hackathon</h1>
      <p>Bare-bones Next.js frontend + Express API.</p>

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
