import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  private readonly socket: Socket;

  constructor() {
    this.socket = io(environment.socketUri);
  }

  public getSocket(): Socket | undefined {
    return this.socket;
  }
}
