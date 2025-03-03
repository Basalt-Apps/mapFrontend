import { SimpleChange, SimpleChanges } from '@angular/core';

export type NgChanges<T> = {
  [K in keyof T]?: NgChange<T[K]>
} & SimpleChanges

type NgChange<T> = {
  [K in keyof SimpleChange]: SimpleChange[K] extends any ? T : SimpleChange[K]
}

