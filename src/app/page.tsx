import { Suspense } from "react";
import { SiteDataProvider } from "@/hooks/useSiteData";
import { HomeClient } from "@/components/HomeClient";
import { trackVisit } from "@/server/actions/visit";
import { getSiteData } from "@/server/actions/site";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { payment?: string };
}) {
  await trackVisit();
  const initialData = await getSiteData();

  return (
    <SiteDataProvider initialData={initialData}>
      <HomeClient searchParams={searchParams} />
    </SiteDataProvider>
  );
}
