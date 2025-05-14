"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ExportExcelPage() {
  const router = useRouter();

  // Automatyczne przekierowanie do panelu administracyjnego
  useEffect(() => {
    router.replace("/admin/subscriptions");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <p className="text-lg text-gray-600">Przekierowywanie...</p>
      </div>
    </div>
  );
}
