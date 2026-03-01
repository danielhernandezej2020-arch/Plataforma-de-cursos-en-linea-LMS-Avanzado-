import { IPaymentProvider } from "@/domain/services/IPaymentProvider";

export class PaymentProviderRegistry {
  private static instance: PaymentProviderRegistry | null = null;
  private providers: Map<string, IPaymentProvider> = new Map();
  private processedTransactions: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): PaymentProviderRegistry {
    if (!PaymentProviderRegistry.instance) {
      PaymentProviderRegistry.instance = new PaymentProviderRegistry();
    }
    return PaymentProviderRegistry.instance;
  }

  public registerProvider(name: string, provider: IPaymentProvider): void {
    this.providers.set(name, provider);
  }

  public getProvider(name: string): IPaymentProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Payment provider "${name}" not registered`);
    }
    return provider;
  }

  public isProcessed(transactionKey: string): boolean {
    return this.processedTransactions.has(transactionKey);
  }

  public markProcessed(transactionKey: string): void {
    this.processedTransactions.add(transactionKey);
  }
}
