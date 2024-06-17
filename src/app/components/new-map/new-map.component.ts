import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {ControlsOf} from "../../models/controls-of.type";
import {MapCreateDto} from "../../models/create-map.dto";
import {Observable} from "rxjs";
import {MapService} from "../../services/map.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";



@Component({
  selector: 'app-new-map',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent,
    ReactiveFormsModule
  ],
  templateUrl: './new-map.component.html',
  styleUrl: './new-map.component.scss'
})
export class NewMapComponent implements OnInit {
  public form!: FormGroup<ControlsOf<MapCreateDto>>;

  constructor(
    private mapService: MapService,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.form = new FormGroup<ControlsOf<MapCreateDto>>({
      name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      url: new FormControl<string>('', { nonNullable: true, validators: [
        Validators.required,
        Validators.pattern(/.*\.png/)]
      })
    })
  }

  public uploadReturn(urlObservable: Observable<string>): void {
    urlObservable.pipe().subscribe((url: string) => {
      console.log(url)
      this.form.controls.url.setValue(url);
    })
  }

  public onSubmit(): void {
    if (this.form.invalid) return;

    this.form.disable()
    const value = this.form.getRawValue();

    if (!(value.url && value.name)) return;

    this.mapService.create(value).subscribe({
      next: () => void this.router.navigate(['/']),
      error: (error: HttpErrorResponse) => {
        this.form.enable()
        console.error(error)
      }
    });
  }
}
