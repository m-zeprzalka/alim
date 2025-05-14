"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormStore } from "@/lib/store/form-store";
import { useState } from "react";

export default function TestFormFlow() {
  const { formData, resetForm } = useFormStore();
  const [visible, setVisible] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-4">Test form state</h1>

          <div className="mb-4">
            <Button onClick={() => setVisible(!visible)}>
              {visible ? "Hide" : "Show"} Form Data
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure you want to reset the form data?")) {
                  resetForm();
                  window.location.href = "/";
                }
              }}
              className="ml-4"
            >
              Reset Form Data
            </Button>
          </div>

          {visible && (
            <div className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-[70vh]">
              <pre className="text-xs">{JSON.stringify(formData, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
