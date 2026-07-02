import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUSSIAN CUP SEASON 1 | Турнир по Dota 2",
  description:
    "Главный турнир сезона по Dota 2. Собери команду и докажи своё превосходство. Регистрация команд, призовой фонд, формат 5x5.",
  keywords: "Dota 2, турнир, Russian Cup, киберспорт, 5x5, призовой фонд",
  openGraph: {
    title: "RUSSIAN CUP SEASON 1 | Турнир по Dota 2",
    description:
      "Главный турнир сезона по Dota 2. Собери команду и докажи своё превосходство.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
