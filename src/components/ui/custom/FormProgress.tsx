"use client";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-sky-950 transition-all duration-500 ease-in-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>
          Krok {currentStep} z {totalSteps}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
