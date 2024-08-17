import { Directive, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appRealInit]',
  standalone: true,
})
export class RealInitDirective implements OnInit {
  @Output() public init = new EventEmitter<void>();

  constructor() {}

  public ngOnInit(): void {
    this.init.emit();
  }
}
