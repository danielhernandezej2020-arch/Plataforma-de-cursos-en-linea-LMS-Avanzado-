import { IPaymentProvider } from "@/domain/services/IPaymentProvider";

export interface IPaymentProviderFactory {
  create(providerName: "stripe" | "paypal"): IPaymentProvider;
}
