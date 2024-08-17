import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from '../interceptors/api.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    provideHttpClient(withInterceptors([apiInterceptor])),
    AuthService,
  ],
})
export class AuthModule {}
