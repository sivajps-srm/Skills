import { readSession } from "../lib/auth";
import SalesTransitionLab from "./sales-transition-lab";
export const dynamic = "force-dynamic";
export default async function LearnerPage(){const session=await readSession();if(session?.role!=="learner")return <main className="access-denied"><h1>Learner access required</h1><p>Enter the access code shared by your facilitator.</p><a href="/login/learner">Go to learner login →</a></main>;return <SalesTransitionLab learnerName={session.name}/>}
