import { SimpleChange, SimpleChanges } from '@angular/core';

export type NgChanges<T> = {
  [K in keyof T]?: NgChange<T[K]>;
} & SimpleChanges;

type NgChange<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof SimpleChange]: SimpleChange[K] extends any ? T : SimpleChange[K];
};
