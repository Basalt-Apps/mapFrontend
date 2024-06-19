import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ControlsOf } from '../../../models/controls-of.type';
import { LoginDTO } from '../../models/login.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit {
  public form!: FormGroup<ControlsOf<LoginDTO>>

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.form = new FormGroup<ControlsOf<LoginDTO>>({
      username: new FormControl<string>('',
        { nonNullable: true, validators: Validators.required }
      ),
      password: new FormControl<string>('',
        { nonNullable: true, validators: Validators.required }
      )
    })
  }

  public onSubmit(): void {
    if (this.form.invalid) return;

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => void this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => console.error(err)
    })
  }
}
