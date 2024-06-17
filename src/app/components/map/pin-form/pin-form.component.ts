import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ControlsOf} from "../../../models/controls-of.type";
import {PinCreateForm} from "../../../models/pin-create-form.interface";
import {V2} from "../../../models/V2.class";
import {PinCreateDto} from "../../../models/pin-create.dto";
import {combineLatestWith, filter, map, Observable, switchMap, take, throwError} from "rxjs";
import {MapModel} from "../../../models/map.model";
import {PinService} from "../../../services/pin.service";
import {PinCreateComponentMetadata} from "../../../models/pin-create-component-metadata.interface";
import {PopupComponent} from "../../popup/popup.component";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-pin-form',
  standalone: true,
  imports: [
    PopupComponent,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './pin-form.component.html',
  styleUrl: './pin-form.component.scss'
})
export class PinFormComponent implements OnInit {
  @Output() public finished = new EventEmitter<void>();

  @Input() public map$!: Observable<MapModel | null>;
  @Input() public clicked$!: Observable<PinCreateComponentMetadata | null>;

  public form!: FormGroup<ControlsOf<PinCreateForm>>

  constructor(private pinService: PinService) {
  }

  public ngOnInit(): void {
    this.form = new FormGroup<ControlsOf<PinCreateForm>>({
      name: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
      content: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
      pos: new FormControl<V2 | null>(null, {validators: Validators.required}),
    })
  }

  public onSubmit(): void {
    this.form.disable()
    this.clicked$.pipe(
      take(1),
      combineLatestWith(this.map$),
      take(1),
      filter((data: [PinCreateComponentMetadata | null, MapModel | null]):
        data is [PinCreateComponentMetadata, MapModel] => !!data[0] && !!data[1]),
      map(([data, map]: [PinCreateComponentMetadata, MapModel]): [V2, number] => [data.position, map.ID]),
      switchMap(([pos, id]: [V2, number]): Observable<void> => {
        this.form.controls.pos.setValue(pos);

        if (this.form.invalid) return throwError(() => new Error('invalid :('));

        const value = this.form.getRawValue()
        if (value.pos === null) return throwError(() => new Error('position not set :('));



        const pin: PinCreateDto = {
          name: value.name,
          content: value.content,
          mapId: id,
          y: value.pos.y,
          x: value.pos.x
        }

        return this.pinService.createNew(pin)
      })
    ).subscribe({
      next: () => this.finished.emit(),
      error: () => this.form.enable()
    })


  }


}
