"use client";

import Link from "next/link";
import { Badge } from "../components/ui/Badge";
import { useCheckoutStateMachine } from "../hooks/useCheckoutStateMachine";

const PRICING = [
  {
    id: "free", name: "Starter", price: 0, period: "forever",
    features: ["Access to 80+ free courses", "Community forum access", "Basic certificates", "Mobile access"],
    cta: "Get started free",
    highlight: false,
  },
  {
    id: "premium", name: "Pro", price: 79, period: "per month",
    features: ["All 320+ courses", "Verified certificates", "Live class access", "1-on-1 mentorship sessions", "Priority support", "Offline downloads"],
    cta: "Start Pro — $79/mo",
    highlight: true,
    discount: "Save 35% with annual",
  },
];

export default function CheckoutPage() {
  // State: toda la lógica de transiciones vive en los estados concretos;
  // el componente solo lee datos y delega acciones al contexto.
  const {
    stepName, data, canProceed, proceed, goBack, showBack, getLabel, updateData,
  } = useCheckoutStateMachine();

  const plan = PRICING.find(p => p.id === data.selectedPlan)!;
  const discount = data.couponApplied ? 0.2 : 0;
  const total = data.planPrice * (1 - discount);

  if (stepName === "success") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, position: "relative", zIndex: 1 }}>
        <div className="anim-scale-in" style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{
              width: 96, height: 96, borderRadius: "50%",
              background: "rgba(61,158,110,0.1)", border: "1px solid rgba(61,158,110,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 48, margin: "0 auto",
              animation: "bounceIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) both",
            }}>✓</div>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 400, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.8px" }}>Welcome to Pro</h1>
          <p style={{ fontSize: 16, color: "var(--body)", marginBottom: 8, lineHeight: 1.7, fontWeight: 400 }}>
            Your {plan.name} subscription is active. You now have access to all 320+ courses, live classes, and verified certificates.
          </p>
          <p style={{ fontSize: 14, color: "var(--body-mid)", marginBottom: 36, fontWeight: 400 }}>
            A receipt has been sent to your email.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/courses" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: 15 }}>
              Browse all courses →
            </Link>
            <Link href="/dashboard" className="btn btn-outline" style={{ padding: "12px 28px", fontSize: 15 }}>
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", position: "relative", zIndex: 1 }}>
      {/* Header */}
      <nav style={{
        borderBottom: "1px solid var(--hairline)", padding: "0 40px", height: 60,
        display: "flex", alignItems: "center", gap: 12,
        background: "var(--canvas)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, background: "transparent", borderRadius: 4, border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 400, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>N</div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 16, color: "var(--ink)" }}>NEXUS</span>
        </Link>
        <span style={{ color: "var(--hairline)", fontSize: 18 }}>|</span>
        <span style={{ fontSize: 14, color: "var(--body-mid)", fontWeight: 400 }}>Checkout</span>
        {stepName === "payment" && (
          <>
            <span style={{ color: "var(--hairline)", fontSize: 18 }}>|</span>
            <span style={{ fontSize: 14, color: "var(--body-mid)", fontWeight: 400 }}>Payment</span>
          </>
        )}
      </nav>

      <div style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "flex-start" }}>
        {stepName === "plan" ? (
          /* Plan selection — PlanSelectionState */
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 400, color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.6px" }}>Choose your plan</h1>
            <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 32, fontWeight: 400 }}>Start free, upgrade anytime. Cancel whenever.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {PRICING.map(p => {
                const isFeatured = p.highlight;
                const isSelected = data.selectedPlan === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => updateData({ selectedPlan: p.id, planPrice: p.price })}
                    style={{
                      background: isFeatured ? "#ffffff" : "var(--canvas-soft)",
                      border: isSelected
                        ? (isFeatured ? "2px solid rgba(0,0,0,0.4)" : "2px solid rgba(255,255,255,0.25)")
                        : (isFeatured ? "2px solid rgba(0,0,0,0.15)" : "2px solid var(--hairline)"),
                      borderRadius: 8, padding: "24px 20px",
                      cursor: "pointer", textAlign: "left", position: "relative",
                      transition: "border-color 0.2s ease",
                    }}
                  >
                    {isFeatured && (
                      <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}>
                        <Badge variant="neutral">Most Popular</Badge>
                      </div>
                    )}
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 16, fontWeight: 400, color: isFeatured ? "#0a0a0a" : "var(--ink)", marginBottom: 4 }}>{p.name}</p>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: 36, fontWeight: 400, fontFamily: "var(--font-mono)", color: isFeatured ? "#0a0a0a" : "var(--ink)", letterSpacing: "-1px" }}>
                          {p.price === 0 ? "Free" : `$${p.price}`}
                        </span>
                        {p.price > 0 && <span style={{ fontSize: 13, color: isFeatured ? "rgba(0,0,0,0.5)" : "var(--body-mid)", fontFamily: "var(--font-mono)" }}>{p.period}</span>}
                      </div>
                      {"discount" in p && p.discount && <p style={{ fontSize: 12, color: "#3d9e6e", marginTop: 4, fontFamily: "var(--font-mono)" }}>{p.discount}</p>}
                    </div>
                    {p.features.map(f => (
                      <div key={f} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#3d9e6e", fontSize: 13, marginTop: 1 }}>✓</span>
                        <span style={{ fontSize: 13, color: isFeatured ? "#333333" : "var(--body)", fontWeight: 400 }}>{f}</span>
                      </div>
                    ))}
                    {/* Radio indicator */}
                    <div style={{
                      position: "absolute", top: 16, right: 16,
                      width: 18, height: 18, borderRadius: "50%",
                      border: `2px solid ${isSelected ? (isFeatured ? "#0a0a0a" : "var(--ink)") : (isFeatured ? "rgba(0,0,0,0.25)" : "var(--hairline)")}`,
                      background: isSelected ? (isFeatured ? "#0a0a0a" : "var(--ink)") : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isSelected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: isFeatured ? "#ffffff" : "var(--canvas)" }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* State: proceed() delega a PlanSelectionState.next() */}
            <button
              onClick={proceed}
              disabled={!canProceed}
              className="btn btn-primary"
              style={{ padding: "13px 28px", fontSize: 15 }}
            >
              {getLabel()}
            </button>
          </div>
        ) : (
          /* Payment — PaymentState */
          <div>
            {showBack && (
              <button
                onClick={goBack}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--body-mid)", fontSize: 13, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, fontWeight: 400 }}
              >
                ← Back to plan selection
              </button>
            )}
            <h1 style={{ fontSize: 24, fontWeight: 400, color: "var(--ink)", marginBottom: 24, letterSpacing: "-0.6px" }}>Payment method</h1>

            {/* Payment method toggle */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {(["card", "paypal"] as const).map(method => (
                <button key={method} onClick={() => updateData({ payMethod: method })} style={{
                  padding: "10px 20px", borderRadius: 9999,
                  background: data.payMethod === method ? "rgba(255,255,255,0.1)" : "transparent",
                  border: data.payMethod === method ? "1px solid rgba(255,255,255,0.25)" : "1px solid var(--hairline)",
                  color: data.payMethod === method ? "var(--ink)" : "var(--body-mid)",
                  fontSize: 14, fontWeight: 400, cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  {method === "card" ? "💳 Credit card" : "🅿 PayPal"}
                </button>
              ))}
            </div>

            {data.payMethod === "card" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Card number</label>
                  <input className="input" placeholder="4242 4242 4242 4242" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Expiry</label>
                    <input className="input" placeholder="MM / YY" />
                  </div>
                  <div>
                    <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>CVC</label>
                    <input className="input" placeholder="•••" />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Name on card</label>
                  <input className="input" placeholder="Alex Chen" />
                </div>
              </div>
            )}

            {data.payMethod === "paypal" && (
              <div style={{
                background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
                borderRadius: 8, padding: "24px", textAlign: "center",
              }}>
                <p style={{ color: "var(--body)", fontSize: 14, marginBottom: 16, fontWeight: 400 }}>
                  You&apos;ll be redirected to PayPal to complete payment securely.
                </p>
                <div style={{ fontSize: 32 }}>🅿</div>
              </div>
            )}

            {/* State: proceed() delega a PaymentState.next() que simula el pago */}
            <button
              onClick={proceed}
              disabled={!canProceed}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 24, padding: "13px", fontSize: 15, opacity: data.loading ? 0.7 : 1 }}
            >
              {data.loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <span style={{ width: 16, height: 16, border: "2px solid transparent", borderTopColor: "var(--canvas)", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />
                  Processing payment...
                </span>
              ) : getLabel()}
            </button>

            <p style={{ fontSize: 12, color: "var(--body-mid)", marginTop: 12, textAlign: "center", fontFamily: "var(--font-mono)" }}>
              🔒 Secured by 256-bit SSL encryption
            </p>
          </div>
        )}

        {/* Order summary */}
        <div style={{
          background: "var(--canvas-card)", border: "1px solid var(--hairline)",
          borderRadius: 8, padding: 24, position: "sticky", top: 100,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 20 }}>Order Summary</h3>

          <div style={{
            background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
            borderRadius: 8, padding: 14, marginBottom: 20,
          }}>
            <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)", marginBottom: 2 }}>NEXUS {plan.name} Plan</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)" }}>{plan.features.length} features included</p>
          </div>

          {/* Coupon */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input
              className="input"
              placeholder="Coupon code"
              value={data.coupon}
              onChange={e => updateData({ coupon: e.target.value })}
              style={{ flex: 1, fontSize: 13 }}
            />
            <button
              onClick={() => { if (data.coupon === "NEXUS20") updateData({ couponApplied: true }); }}
              className="btn btn-outline"
              style={{ fontSize: 13, padding: "8px 14px", whiteSpace: "nowrap" }}
            >
              Apply
            </button>
          </div>
          {data.couponApplied && <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#3d9e6e", marginTop: -14, marginBottom: 14 }}>✓ 20% discount applied!</p>}

          {/* Totals */}
          <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--body-mid)", fontWeight: 400 }}>Subtotal</span>
              <span style={{ color: "var(--body)", fontFamily: "var(--font-mono)" }}>{data.planPrice === 0 ? "Free" : `$${data.planPrice}`}</span>
            </div>
            {data.couponApplied && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#3d9e6e", fontFamily: "var(--font-mono)" }}>Discount (20%)</span>
                <span style={{ color: "#3d9e6e", fontFamily: "var(--font-mono)" }}>-${(data.planPrice * 0.2).toFixed(0)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, borderTop: "1px solid var(--hairline)", paddingTop: 10 }}>
              <span style={{ color: "var(--body)", fontWeight: 400 }}>Total</span>
              <span style={{ color: "var(--ink)", fontFamily: "var(--font-mono)", fontWeight: 400, letterSpacing: "-0.4px" }}>{data.planPrice === 0 ? "Free" : `$${total.toFixed(0)}`}</span>
            </div>
          </div>

          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", marginTop: 16, lineHeight: 1.6 }}>
            By completing this purchase you agree to our Terms of Service. Cancel anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
