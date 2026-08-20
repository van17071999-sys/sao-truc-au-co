import { SubjectDetail } from "../../cms-content-pages";
import { catalogMetadata } from "../../catalog-metadata";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return catalogMetadata(params, "Lớp học", "bo-mon");
}

export default function Page() {
  return <SubjectDetail />;
}

