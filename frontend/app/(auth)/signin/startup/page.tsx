"use client";

import Stepper from "@/components/ui/Stepper";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const lists = [
    { number: 1, title: "Fill out the form" },
    { number: 2, title: "Verify your LinkedIn account" },
  ];

  const [startupInfo, setStartupInfo] = useState({
    name: "",
    industry: "",
    website: "",
    description: "",
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupInfo.name || !startupInfo.industry) return;
    setStep(2);
  };

  const handleLinkedInLogin = async () => {
    // store startup info locally (we’ll read it after LinkedIn login)
    localStorage.setItem("startup-info", JSON.stringify(startupInfo));

    // trigger LinkedIn OAuth through Better Auth
    await authClient.signIn.social({
      provider: "linkedin",
      callbackURL: "/onboarding", // redirect after LinkedIn login
    });
  };
  const [form, setForm] = useState({
    companyName: "",
    stage: "",
    fundingNeed: "",
    valuation: "",
    sector: "",
    equityOffered: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const steps = ["Startup Info", "LinkedIn Login"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/startups/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.companyName,
        stage: form.stage,
        fundingNeed: Number(form.fundingNeed),
        valuation: Number(form.valuation),
        sector: form.sector,
        equityOffered: form.equityOffered,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to register");

    // Save startup ID for later (LinkedIn step)
    localStorage.setItem("startup-id", data.startup._id);

    // Move to LinkedIn step
    setStep(2);
    } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="md:flex-row flex flex-col-reverse items-start p-3 w-full min-h-[90vh]">
      {/* LEFT SIDE */}
      <div
        className="grid w-full h-full items-end bg-cover bg-center p-8 rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/bg.jpg')`,
        }}
      >
        <div className="text-white text-center space-y-4 mb-10">
          <p className="sm:text-5xl font-bold">Pitch Swipe</p>
          <h2 className="sm:text-2xl">Get started with us</h2>
          <h3 className="sm:text-2xl">
            Complete these steps to register your account
          </h3>
        </div>

        <div className="lists space-y-5">
          {lists.map((item) => (
            <div
              key={item.number}
              className="backdrop-blur-2xl bg-white/10 rounded text-white sm:text-xl flex gap-5 items-center p-3"
            >
              <p className="bg-white/10 rounded-full w-10 h-10 text-white flex items-center justify-center font-semibold">
                {item.number}
              </p>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right w-full bg-white h-full flex items-start p-5 justify-center">
        <div className="space-y-2">
            <h2 className="sm:text-2xl font-semibold text-center">Startup Signup</h2>
            <p className="sm:text-xl text-center">Enter your information </p>

            {/* Stepper Indicator */}
      <Stepper currentStep={step} steps={steps} />

      {step === 1 ? (
        // step 1 form here
            <form
                onSubmit={handleSubmit}
                className="space-y-4 grid gap-2 md:grid-cols-2 w-full h-full bg-white p-6 shadow-md"
                >

                <div className="space-y-2">
                    <label htmlFor="companyname">Company name</label>
                    <input
                        type="text"
                        placeholder="eg. Strix"
                        name="companyname"
                        id="companyname"
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        className="w-full bg-gray-100 border p-2 rounded-md"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="stage">Stage</label>
                    <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value})} className="block border border-gray-200 p-2 roudned w-full" name="stage" id="stage">
                        <option>---Select---</option>
                        <option value="pre-seed">pre seed</option>
                        <option value="seed">seed</option>
                        <option value="series-a">series-a</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="">Sector</label>
                    <input
                        type="text"
                        placeholder="Sector"
                        name="sector"
                        id="sector"
                        value={form.sector}
                        onChange={(e) => setForm({ ...form, sector: e.target.value })}
                        className="w-full bg-gray-100 border p-2 rounded-md"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="">Funding need</label>
                    <input
                        type="number"
                        placeholder="funding need"
                        name="fundingNeed"
                        id="fundingNeed"
                        value={form.fundingNeed}
                        onChange={(e) => setForm({ ...form, fundingNeed: e.target.value })}
                        className="w-full bg-gray-100 border p-2 rounded-md"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="">Equity offered</label>
                    <input
                        type="number"
                        placeholder="Equity offered"
                        name="equityOffered"
                        id="equityOffered"
                        value={form.equityOffered}
                        onChange={(e) => setForm({ ...form, equityOffered: e.target.value })}
                        className="w-full bg-gray-100 border p-2 rounded-md"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="">Valuation</label>
                    <input
                        type="number"
                        placeholder="valuation"
                        name="valuation"
                        id="valuation"
                        value={form.valuation}
                        onChange={(e) => setForm({ ...form, valuation: e.target.value })}
                        className="w-full bg-gray-100 border p-2 rounded-md"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
        ) : (
             <div className="flex flex-col items-center space-y-6">
          <p className="text-gray-600 text-center">
            Connect your LinkedIn to verify your startup identity.
          </p>

          <button
            onClick={handleLinkedInLogin}
            className="cursor-pointer flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76s.784-1.74 1.75-1.74 1.75.77 1.75 1.74-.784 1.76-1.75 1.76zm14.25 11.27h-3v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.91v5.59h-3v-10h2.88v1.36h.04c.4-.76 1.39-1.56 2.86-1.56 3.06 0 3.62 2.01 3.62 4.63v5.57z" />
            </svg>
            Continue with LinkedIn
          </button>
        </div>
      )}
      <div className="mt-20 flex items-center gap-5 justify-center">
        <button
            type="submit"
            onClick={() => setStep(1)}
            disabled={loading}
            className={`${step === 2 ? "block" : "hidden"} cursor-pointer px-5 bg-[#7D6115] text-white py-2 rounded-md`}
        >
            ← Back
        </button>
        <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`${step === 1 ? "block" : "hidden"} cursor-pointer px-5 bg-[#7D6115] hover:bg-red-500 transition-all text-white py-2 rounded-md`}
        >
            {step === 1 ? "Sign up" : "Done"}
        </button>
      </div>
        </div>
      </div>
    </div>
  );
}
