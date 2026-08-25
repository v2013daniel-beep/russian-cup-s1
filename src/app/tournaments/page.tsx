import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { getSiteData } from "@/server/actions/site";
import { Trophy, Users, Calendar, Medal } from "lucide-react";

export const metadata: Metadata = {
  title: "Прошедшие турниры | RUSSIAN CUP SEASON 1",
  description: "История прошедших турниров RUSSIAN CUP по Dota 2.",
};

export const dynamic = "force-dynamic";

export default async function TournamentsPage() {
  const data = await getSiteData();
  const tournaments = data.pastTournaments;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dota-black pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Прошедшие турниры
            </h1>
            <p className="text-dota-muted text-lg">
              История турниров RUSSIAN CUP
            </p>
          </div>

          {tournaments.length === 0 ? (
            <Card className="py-16 text-center">
              <Trophy className="w-16 h-16 text-dota-muted mx-auto mb-6" />
              <p className="text-xl text-dota-muted">
                История турниров пока пуста
              </p>
              <p className="text-dota-gold mt-2">
                Следите за обновлениями
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Trophy className="w-6 h-6 text-dota-gold" />
                        <h2 className="text-2xl font-display font-bold text-white">
                          {tournament.name}
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-dota-muted">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{tournament.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{tournament.teamsCount} команд</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Medal className="w-4 h-4" />
                          <span>{tournament.prizePool}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-80">
                      <div className="bg-dota-surface rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-dota-gold font-bold">1 место</span>
                          <span className="text-white font-medium">{tournament.winner}</span>
                        </div>
                        {tournament.secondPlace && (
                          <div className="flex items-center justify-between">
                            <span className="text-dota-muted font-bold">2 место</span>
                            <span className="text-white font-medium">{tournament.secondPlace}</span>
                          </div>
                        )}
                        {tournament.thirdPlace && (
                          <div className="flex items-center justify-between">
                            <span className="text-orange-400 font-bold">3 место</span>
                            <span className="text-white font-medium">{tournament.thirdPlace}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
