import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input() public uploadUrl!: string;
  @Output() public returnObservable = new EventEmitter<Observable<string>>();
  public fileName = '';
  public image$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onFileSelected(event: any): void {
    if (!this.uploadUrl) return;

    const file: File | null = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('image', file);

      const upload$ = this.http.post<{ url: string }>(
        '/' + this.uploadUrl,
        formData,
      );

      this.returnObservable.emit(
        upload$.pipe(
          map((url: { url: string }): string => url.url),
          tap((url: string): void =>
            this.image$.next(environment.backendUrl + '/api/images/' + url),
          ),
        ),
      );
    }
  }
}
