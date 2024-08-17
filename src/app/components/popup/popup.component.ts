import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  @Input() public width = 300;
  @Input() public height = 200;
}
