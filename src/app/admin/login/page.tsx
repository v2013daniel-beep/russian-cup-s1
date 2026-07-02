"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminLogin } from "@/server/actions/admin";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await adminLogin(password);
      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || "Неверный пароль");
      }
    } catch {
      setError("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dota-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-dota-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-dota-red" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">
              Админ-панель
            </h1>
            <p className="text-dota-muted mt-2">RUSSIAN CUP SEASON 1</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-dota-red/10 border border-dota-red/30 rounded-lg text-dota-red text-sm">
                {error}
              </div>
            )}
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль администратора"
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
