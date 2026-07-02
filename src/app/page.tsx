import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { TournamentInfo } from "@/components/sections/TournamentInfo";
import { Registration } from "@/components/sections/Registration";
import { Teams } from "@/components/sections/Teams";
import { Bracket } from "@/components/sections/Bracket";
import { LiveStream } from "@/components/sections/LiveStream";
import { FAQ } from "@/components/sections/FAQ";
import { Sponsors } from "@/components/sections/Sponsors";
import { HallOfFame } from "@/components/sections/HallOfFame";
import { Contacts } from "@/components/sections/Contacts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getTournament, getPublicStats } from "@/server/actions/tournament";
import { getTeams } from "@/server/actions/team";
import { trackVisit } from "@/server/actions/visit";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { payment?: string };
}) {
  await trackVisit();

  const tournament = await getTournament();
  const teams = await getTeams();
  const stats = await getPublicStats();

  return (
    <>
      <Header />
      <main>
        <Hero
          tournamentDate={new Date(tournament.date)}
          prizePool={tournament.prizePool}
          format={tournament.format}
          server={tournament.server}
        />
        <TournamentInfo
          prizePool={tournament.prizePool}
          format={tournament.format}
          server={tournament.server}
        />
        <Registration
          entryFee={tournament.entryFee}
          registrationOpen={tournament.registrationOpen}
        />
        <Teams teams={teams} />
        <Bracket />
        <LiveStream />
        <FAQ />
        <Sponsors />
        <HallOfFame />
        <Contacts
          discord={tournament.contacts?.discord || "#"}
          telegram={tournament.contacts?.telegram || "#"}
          email={tournament.contacts?.email || "#"}
          responseTime={
            tournament.contacts?.responseTime ||
            "ежедневно с 10:00 до 22:00 (MSK)"
          }
        />
      </main>
      <Footer />

      {searchParams.payment === "success" && (
        <Suspense fallback={null}>
          <PaymentSuccessToast />
        </Suspense>
      )}
    </>
  );
}

function PaymentSuccessToast() {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-dota-gold text-dota-black px-6 py-4 rounded-xl shadow-glow-gold font-bold animate-bounce">
      Оплата прошла успешно! Спасибо за участие.
    </div>
  );
}
