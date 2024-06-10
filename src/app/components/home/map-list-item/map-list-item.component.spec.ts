import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapListItemComponent } from './map-list-item.component';

describe('MapListItemComponent', () => {
  let component: MapListItemComponent;
  let fixture: ComponentFixture<MapListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
