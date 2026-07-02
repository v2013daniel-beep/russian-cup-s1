"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toggleRegistration } from "@/server/actions/admin";

export function ToggleRegistrationButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleRegistration();
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "Обновление..." : "Вкл/Выкл регистрацию"}
    </Button>
  );
}
