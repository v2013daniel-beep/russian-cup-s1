import { Suspense } from "react";
import { SiteDataProvider } from "@/hooks/useSiteData";
import { HomeClient } from "@/components/HomeClient";
import { trackVisit } from "@/server/actions/visit";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { payment?: string };
}) {
  await trackVisit();

  return (
    <SiteDataProvider>
      <HomeClient searchParams={searchParams} />
    </SiteDataProvider>
  );
}
