import { PinModel } from './pin.model';

export type OmitPinPos = Omit<PinModel, 'Pos'>

type Ommit<T, O extends keyof T> = {
  [K in keyof T]: K extends O ? never : T[K]
}

