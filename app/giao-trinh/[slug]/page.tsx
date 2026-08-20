import { SalesDetail } from "../../cms-content-pages";
import { catalogMetadata } from "../../catalog-metadata";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return catalogMetadata(params, "Giáo trình", "giao-trinh"); }
export default function Page() { return <SalesDetail collection="curriculums" typeLabel="Giáo trình" backHref="/giao-trinh-va-sheet" backLabel="Giáo trình & sheet" />; }
