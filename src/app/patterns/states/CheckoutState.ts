export interface CheckoutData {
  selectedPlan: string;
  planPrice: number;
  payMethod: "card" | "paypal";
  coupon: string;
  couponApplied: boolean;
  loading: boolean;
}

export interface ICheckoutState {
  readonly name: "plan" | "payment" | "success";
  canProceed(ctx: CheckoutContext): boolean;
  next(ctx: CheckoutContext): void;
  back(ctx: CheckoutContext): void;
  getLabel(ctx: CheckoutContext): string;
  showBack(ctx: CheckoutContext): boolean;
}

/**
 * Contexto que delega el comportamiento al estado activo.
 * Llama a onUpdate() para forzar un re-render del hook React cada vez que
 * cambia de estado o actualiza datos.
 */
export class CheckoutContext {
  private currentState: ICheckoutState;
  public data: CheckoutData;
  private readonly onUpdate: () => void;

  constructor(onUpdate: () => void) {
    this.onUpdate = onUpdate;
    this.data = {
      selectedPlan: "premium",
      planPrice: 79,
      payMethod: "card",
      coupon: "",
      couponApplied: false,
      loading: false,
    };
    this.currentState = new PlanSelectionState();
  }

  transition(state: ICheckoutState): void {
    this.currentState = state;
    this.onUpdate();
  }

  patchData(patch: Partial<CheckoutData>): void {
    this.data = { ...this.data, ...patch };
    this.onUpdate();
  }

  proceed(): void    { this.currentState.next(this); }
  goBack(): void     { this.currentState.back(this); }
  canProceed(): boolean  { return this.currentState.canProceed(this); }
  getStepName(): "plan" | "payment" | "success" { return this.currentState.name; }
  getLabel(): string { return this.currentState.getLabel(this); }
  showBack(): boolean { return this.currentState.showBack(this); }
}

// ── Estados concretos ────────────────────────────────────────────────────────

export class PlanSelectionState implements ICheckoutState {
  readonly name = "plan" as const;

  canProceed(_ctx: CheckoutContext): boolean { return true; }

  next(ctx: CheckoutContext): void {
    if (ctx.data.planPrice === 0) {
      if (typeof window !== "undefined") window.location.href = "/dashboard";
    } else {
      ctx.transition(new PaymentState());
    }
  }

  back(_ctx: CheckoutContext): void {}

  getLabel(ctx: CheckoutContext): string {
    return ctx.data.planPrice === 0 ? "Get started free →" : "Continue to payment →";
  }

  showBack(_ctx: CheckoutContext): boolean { return false; }
}

export class PaymentState implements ICheckoutState {
  readonly name = "payment" as const;

  canProceed(ctx: CheckoutContext): boolean { return !ctx.data.loading; }

  next(ctx: CheckoutContext): void {
    ctx.patchData({ loading: true });
    // Simula llamada a pasarela de pago
    setTimeout(() => {
      ctx.patchData({ loading: false });
      ctx.transition(new SuccessState());
    }, 1800);
  }

  back(ctx: CheckoutContext): void {
    ctx.transition(new PlanSelectionState());
  }

  getLabel(ctx: CheckoutContext): string {
    if (ctx.data.loading) return "Processing...";
    const discount = ctx.data.couponApplied ? 0.2 : 0;
    const total = ctx.data.planPrice * (1 - discount);
    return `Pay $${total.toFixed(0)} →`;
  }

  showBack(_ctx: CheckoutContext): boolean { return true; }
}

export class SuccessState implements ICheckoutState {
  readonly name = "success" as const;
  canProceed(_ctx: CheckoutContext): boolean { return false; }
  next(_ctx: CheckoutContext): void {}
  back(_ctx: CheckoutContext): void {}
  getLabel(_ctx: CheckoutContext): string { return ""; }
  showBack(_ctx: CheckoutContext): boolean { return false; }
}
