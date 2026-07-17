import { AdminHeader } from "@/components/admin/AdminHeader";
import { SiteDataProvider } from "@/hooks/useSiteData";
import { getSiteData } from "@/server/actions/site";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialData = await getSiteData();

  return (
    <SiteDataProvider initialData={initialData}>
      <div className="min-h-screen bg-dota-black">
        <AdminHeader />
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </SiteDataProvider>
  );
}
