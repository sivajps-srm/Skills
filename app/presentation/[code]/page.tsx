import PresentationView from "./view";
export default async function Presentation({params}:{params:Promise<{code:string}>}){const {code}=await params;return <PresentationView code={code}/>}
