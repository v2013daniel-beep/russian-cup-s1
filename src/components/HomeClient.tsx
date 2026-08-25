"use client";

import { Suspense } from "react";
import Link from "next/link";
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
import { MouseGlow3D } from "@/components/effects/MouseGlow3D";
import { Button } from "@/components/ui/Button";
import { History } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

export function HomeClient({
  searchParams,
}: {
  searchParams: { payment?: string };
}) {
  const { data } = useSiteData();

  return (
    <>
      <MouseGlow3D />
      <Header />
      <main>
        <Hero
          tournamentDate={new Date(data.tournament.date)}
          prizePool={data.tournament.prizePool}
          format={data.tournament.format}
          server={data.tournament.server}
        />
        <TournamentInfo
          prizePool={data.tournament.prizePool}
          format={data.tournament.format}
          server={data.tournament.server}
        />
        <LiveStream
          url={data.liveStream.url}
          title={data.liveStream.title}
          isActive={data.liveStream.isActive}
        />
        <section className="py-12 bg-dota-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link href="/tournaments">
              <Button variant="outline" size="lg">
                <History className="w-5 h-5 mr-2" />
                Прошедшие турниры
              </Button>
            </Link>
          </div>
        </section>
        <Registration
          entryFee={data.tournament.entryFee}
          registrationOpen={data.tournament.registrationOpen}
        />
        <Teams teams={data.teams} />
        <Bracket matches={data.matches} />
        <FAQ />
        <Sponsors />
        <HallOfFame />
        <Contacts
          discord={data.contacts.discord}
          telegram={data.contacts.telegram}
          email={data.contacts.email}
          responseTime={data.contacts.responseTime}
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
