"use client";

import { useState } from "react";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/Button";

export function ToggleRegistrationButton() {
  const { data, updateTournament } = useSiteData();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    updateTournament({ registrationOpen: !data.tournament.registrationOpen });
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleToggle} disabled={loading}>
      {loading
        ? "Обновление..."
        : data.tournament.registrationOpen
        ? "Закрыть регистрацию"
        : "Открыть регистрацию"}
    </Button>
  );
}
