import { useState } from "react";
import { Check, Zap, Crown, ArrowRight } from "@/lib/icons";

export default function Freemuim() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const plans = [
    {
      name: "Free",
      tagline: "Get started with the basics",
      price: 0,
      icon: Zap,
      features: [
        "5 practice tests per month",
        "Basic question bank",
        "Instant results",
        "Basic performance tracking",
      ],
      cta: "Start Free",
      color: "slate",
    },
    {
      name: "Premium",
      tagline: "Unlock your full potential",
      price: 25000,
      icon: Crown,
      features: [
        "Unlimited practice tests",
        "Full question bank (10k+)",
        "Advanced analytics",
        "Detailed explanations",
        "Custom study plans",
        "Priority support",
      ],
      cta: "Go Premium",
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Pricing Plans
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            Start free and upgrade anytime to unlock full access
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const isHovered = hoveredPlan === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredPlan(idx)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`bg-white border rounded-xl p-6 transition-transform duration-200 ${
                  isHovered ? "scale-105 shadow-md" : "shadow-sm"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${
                    plan.color === "emerald"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">{plan.tagline}</p>

                {/* Price */}
                <div className="text-2xl font-bold text-slate-900 mb-4">
                  {plan.price === 0
                    ? "Free"
                    : `₦${plan.price.toLocaleString()}`}
                </div>

                {/* Features */}
                <ul className="mb-6 space-y-2 text-sm text-slate-700">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.color === "emerald"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-slate-600 text-white hover:bg-slate-700"
                  }`}
                >
                  {plan.cta} <ArrowRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
