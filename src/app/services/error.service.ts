import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorElements = new Subject<string[]>();

  public setErrorHttp(error: HttpErrorResponse): void {
    this.setError([error.error.statusCode + '', error.error.message])
  }


  public setError(error: string): void;
  public setError(error: string[]): void;
  public setError(error: string | string[]): void {
    this.errorElements.next(typeof error === 'string' ? [error] : (error[0] ? error : []));
  }

  public getErrorElements(): Observable<string[]> {
    return this.errorElements.asObservable();
  }
}
