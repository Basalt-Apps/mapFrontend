import { Component } from '@angular/core';
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ErrorComponent} from "../error/error.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent,
    RouterOutlet,
    ErrorComponent
  ],
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss'
})
export class RootComponent {

}
