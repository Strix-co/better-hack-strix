"use client";

import React from "react";

type StepperProps = {
  currentStep: number;
  steps: string[];
};

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {steps.map((step, index) => {
        const isActive = currentStep === index + 1;
        const isCompleted = currentStep > index + 1;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold ${
                  isActive
                    ? "bg-black"
                    : isCompleted
                    ? "bg-[#7D6115]"
                    : "bg-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm mt-1 ${
                  isActive ? "text-black" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`w-12 h-[2px] ${
                  isCompleted ? "bg-[#7D6115]" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
