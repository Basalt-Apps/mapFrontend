import {Directive, EventEmitter, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[appMapInit]',
  standalone: true
})
export class MapInitDirective implements OnInit {
  @Output() public init = new EventEmitter<void>();

  constructor() { }

  public ngOnInit(): void {
    this.init.emit()
  }

}
