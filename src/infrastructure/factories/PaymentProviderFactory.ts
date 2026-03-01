import { IPaymentProviderFactory } from "@/domain/factories/IPaymentProviderFactory";
import { IPaymentProvider } from "@/domain/services/IPaymentProvider";
import { StripeProvider } from "@/infrastructure/payments/StripeProvider";
import { PayPalProvider } from "@/infrastructure/payments/PayPalProvider";

export class PaymentProviderFactory implements IPaymentProviderFactory {
  create(providerName: "stripe" | "paypal"): IPaymentProvider {
    switch (providerName) {
      case "stripe":
        return new StripeProvider();
      case "paypal":
        return new PayPalProvider();
      default:
        throw new Error(`Unknown payment provider: ${providerName}`);
    }
  }
}
