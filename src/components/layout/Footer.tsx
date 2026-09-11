"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-dota-void border-t border-dota-gold/10 py-12 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "url('/svgs/dota-pattern.svg')" }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <img src="/svgs/hero-emblem.svg" alt="RUSSIAN CUP" className="w-full h-full" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white block tracking-wider">
                RUSSIAN CUP SEASON 1
              </span>
              <span className="text-xs text-dota-muted">
                Главный турнир сезона по Dota 2
              </span>
            </div>
          </div>

          <div className="text-center md:text-right text-dota-muted text-sm">
            <p>© 2026 RUSSIAN CUP. Все права защищены.</p>
            <p className="mt-1">18+ | Турнир проводится для любителей Dota 2</p>
          </div>
        </div>

        <div className="border-t border-dota-gold/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-dota-muted">
          <div className="text-center md:text-left">
            <p>ИП БАХТИЕВА РИММА ШАЙМАРДАНОВНА</p>
            <p>ИНН: 024202629803</p>
            <p>ОГРНИП: 326028000205896</p>
          </div>
          <div className="text-center text-dota-muted">
            <p>
              <a href="mailto:russiancup@mail.ru" className="hover:text-dota-gold transition-colors">
                russiancup@mail.ru
              </a>
            </p>
            <p className="mt-1">
              <a href="tel:+79297484631" className="hover:text-dota-gold transition-colors">
                +7 929 748-46-31
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/oferta" className="hover:text-dota-gold transition-colors">
              Публичная оферта
            </Link>
            <Link href="/privacy" className="hover:text-dota-gold transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
