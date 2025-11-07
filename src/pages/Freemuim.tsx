import { useState } from "react";
import { Check, Zap, Crown, ArrowRight } from "@/lib/icons";

export default function Freemium() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const plans = [
    {
      name: "Free",
      tagline: "Perfect for first-time learners",
      price: 0,
      icon: Zap,
      features: [
        "5 practice tests each month",
        "Standard question bank access",
        "Instant scoring & feedback",
        "Basic performance tracking",
      ],
      cta: "Start Practicing",
      color: "slate",
    },
    {
      name: "Premium",
      tagline: "For serious candidates aiming to master every topic",
      price: 25000,
      icon: Crown,
      features: [
        "Unlimited practice sessions",
        "Access to all 10,000+ questions",
        "Detailed performance insights",
        "Step-by-step question explanations",
        "Custom study plans",
        "Priority chat support",
      ],
      cta: "Upgrade to Premium",
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Find Your Focus Plan
          </h1>
          <p className="text-base text-gray-500">
            Choose the plan that fits your learning pace. You can start free and
            upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const isHovered = hoveredPlan === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredPlan(idx)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 shadow-sm hover:shadow-md ${
                  isHovered ? "translate-y-[-4px]" : ""
                }`}
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                      plan.color === "emerald"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-500 mb-6">{plan.tagline}</p>

                {/* Price */}
                <div className="flex items-end mb-8">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price === 0
                      ? "Free"
                      : `₦${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="ml-1 text-sm text-gray-500">
                      / lifetime
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-700 text-sm"
                    >
                      <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    plan.color === "emerald"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
