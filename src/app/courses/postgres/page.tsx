import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageScripts from "../../../components/PageScripts";
import { SESSION_COOKIE } from "../../../lib/session-cookie";
import { verifyFirebaseIdToken } from "../../../lib/firebase-session";
import PostgresCourse from "./PostgresCourse";

export const metadata = { title: "PostgreSQL SQL Learning Lab · Learning Studio" };
export const dynamic = "force-dynamic";

export default async function PostgresCoursePage() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifyFirebaseIdToken(token))) {
    redirect("/auth/?mode=signin&next=%2Fcourses%2Fpostgres%2F");
  }

  return (
    <>
      <PostgresCourse />
      <PageScripts scripts={[
        { src: "/scripts/progress-tracker.js" },
        { src: "/scripts/firebase-client.js", module: true },
      ]} />
    </>
  );
}
