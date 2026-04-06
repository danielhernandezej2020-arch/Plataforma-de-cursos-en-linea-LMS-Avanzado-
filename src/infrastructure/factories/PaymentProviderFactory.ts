import { IPaymentProviderFactory } from "@/domain/factories/IPaymentProviderFactory";
import { IPaymentProvider } from "@/domain/services/IPaymentProvider";
import { StripePaymentAdapter } from "@/infrastructure/payments/StripePaymentAdapter";
import { PayPalPaymentAdapter } from "@/infrastructure/payments/PayPalPaymentAdapter";
import { StripeSDK } from "@/infrastructure/payments/external/StripeSDK";
import { PayPalSDK } from "@/infrastructure/payments/external/PayPalSDK";

export class PaymentProviderFactory implements IPaymentProviderFactory {
  create(providerName: "stripe" | "paypal"): IPaymentProvider {
    switch (providerName) {
      case "stripe":
        return new StripePaymentAdapter(new StripeSDK());
      case "paypal":
        return new PayPalPaymentAdapter(new PayPalSDK());
      default:
        throw new Error(`Unknown payment provider: ${providerName}`);
    }
  }
}
