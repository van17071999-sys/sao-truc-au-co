import { SalesDetail } from "../../cms-content-pages";
import { catalogMetadata } from "../../catalog-metadata";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return catalogMetadata(params, "Sheet nhạc", "sheet"); }
export default function Page() { return <SalesDetail collection="materials" typeLabel="Sheet nhạc" backHref="/#materials" backLabel="Giáo trình & sheet" />; }
