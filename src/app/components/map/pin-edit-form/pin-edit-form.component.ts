import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PopupComponent } from '../../popup/popup.component';
import { Observable } from 'rxjs';
import { V2 } from '../../../models/V2.class';
import { ControlsOf } from '../../../models/controls-of.type';
import { PinEditForm } from '../../../models/pin-edit-form.interface';
import { PinService } from '../../../services/pin.service';
import { ErrorService } from '../../../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OmitPinPos } from '../../../models/omit-pin-pos.type';
import { PinDataService } from '../../../services/pin-data.service';

@Component({
  selector: 'app-pin-edit-form',
  standalone: true,
  imports: [AsyncPipe, FormsModule, PopupComponent, ReactiveFormsModule],
  templateUrl: './pin-edit-form.component.html',
  styleUrl: './pin-edit-form.component.scss',
})
export class PinEditFormComponent implements OnInit {
  @Output() public finished = new EventEmitter<void>();

  @Input() public pin!: OmitPinPos;
  @Input() public pos$!: Observable<V2 | null>;

  public form!: FormGroup<ControlsOf<PinEditForm>>;

  constructor(
    private pinService: PinService,
    private pinDataService: PinDataService,
    private errorService: ErrorService,
  ) {}

  public ngOnInit(): void {
    this.form = new FormGroup<ControlsOf<PinEditForm>>({
      name: new FormControl<string>(this.pin.Name, {
        nonNullable: true,
        validators: Validators.required,
      }),
      content: new FormControl<string>(this.pin.Content, {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    this.form.disable();

    const pin: PinEditForm = {
      name: value.name,
      content: value.content,
    };

    this.pinService.edit(this.pin.ID, pin).subscribe({
      next: () => this.finished.emit(),
      error: (error: HttpErrorResponse) => {
        this.form.enable();
        this.errorService.setErrorHttp(error);
      },
    });
  }
}
