export interface IPrototype<T, O extends Partial<T> = Partial<T>> {
  clone(overrides?: O): T;
}
