import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent implements OnInit {
  public elements$!: Observable<string[]>;
  public opacity = 0;

  constructor(private errorService: ErrorService) {}

  public ngOnInit(): void {
    this.elements$ = this.errorService.getErrorElements();
    this.elements$.subscribe(() => {
      this.opacity = 1;
      setTimeout(() => (this.opacity = 0), 4000);
    });
  }
}
