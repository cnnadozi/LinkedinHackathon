import LinkedInNav from "./LinkedInNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LinkedInNav />
      <div className="app-shell__body">{children}</div>
    </>
  );
}
