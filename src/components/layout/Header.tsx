"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const navItems = [
  { label: "Главная", href: "#hero" },
  { label: "Регистрация", href: "#register" },
  { label: "Команды", href: "#teams" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-dota-black/90 backdrop-blur-xl border-b border-dota-gold/20 shadow-lg shadow-dota-red/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#hero");
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <img 
                src="/svgs/hero-emblem.svg" 
                alt="" 
                className="w-full h-full group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg leading-tight text-white tracking-wider">
                RUSSIAN CUP
              </span>
              <span className="block text-xs text-dota-gold font-display tracking-[0.2em]">
                SEASON 1
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className="relative text-sm font-medium text-dota-muted hover:text-dota-gold transition-colors uppercase tracking-wider group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dota-red transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button size="sm" onClick={() => scrollToSection("#register")}>
              Участвовать
            </Button>
          </div>

          <button
            className="md:hidden text-dota-text p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dota-black/95 backdrop-blur-xl border-b border-dota-gold/10"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className="block text-dota-muted hover:text-dota-gold transition-colors uppercase tracking-wider py-2"
                >
                  {item.label}
                </a>
              ))}
              <Button
                fullWidth
                size="sm"
                onClick={() => scrollToSection("#register")}
              >
                Участвовать
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
