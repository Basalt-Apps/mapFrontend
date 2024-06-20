import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BehaviorSubject, combineLatestWith, filter, map, Observable, of, switchMap, take} from "rxjs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {MapModel} from "../../models/map.model";
import {MapDataService} from "../../services/map-data.service";
import {V2} from "../../models/V2.class";
import {PinDataService} from "../../services/pin-data.service";
import {PinFormComponent} from "./pin-form/pin-form.component";
import { PinModel } from '../../models/pin.model';
import { MarkerComponent } from './marker/marker.component';
import { RealInitDirective } from '../../directives/real-init.directive';
import { environment } from '../../../environments/environment';
import { OmitPinPos } from '../../models/omit-pin-pos.type';
import { PinPopupService } from '../../services/pin-popup.service';
import {
  PinCreateComponentMetadata
} from '../../models/pin-create-component-metadata.interface';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    RealInitDirective,
    MarkerComponent,
    PinFormComponent,
    SettingsMenuComponent
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  public mapPos = new V2();
  public mapPos$ = new BehaviorSubject<V2>(new V2())
  public basePinSize = 40
  public zoomPinMod = 4
  public zoomLevel = 100;
  public zoomLevel$ = new BehaviorSubject<number>(100);
  public map$!: Observable<MapModel | null>
  public pins$!: Observable<OmitPinPos[]>
  public pinPositions$!: Observable<Observable<V2>[]>
  public clicked$ = new BehaviorSubject<PinCreateComponentMetadata | null>(null);
  public settingsMenu = true;

  constructor(
    private route: ActivatedRoute,
    private dataService: MapDataService,
    private pinDataService: PinDataService,
    private elRef: ElementRef,
    private pinPopupService: PinPopupService,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.map$ = this.route.params.pipe(
      map((params: Params): number => +params['id']),
      switchMap((id: number) => this.dataService.getById(id))
    )
  }

  public onMapInit(): void {
    const mapImg = this.elRef.nativeElement.querySelector('#mapImg') as HTMLImageElement

    this.placePins(mapImg);
    this.draggingLogic(mapImg);
    this.scrollingLogic(mapImg);
  }

  private draggingLogic(mapImg: HTMLImageElement): void {
    let mouseDown = false;
    let baseline = new V2();
    let initialMousePos = new V2();
    let moved = false;

    mapImg.addEventListener('mousedown', (event: MouseEvent) => {
      const layerPos = new V2(event.layerX, event.layerY)
      const clientPos = new V2(event.clientX, event.clientY);

      initialMousePos = clientPos;
      baseline = clientPos.subtract(layerPos);
      mouseDown = true
      moved = false;
    })

    mapImg.addEventListener('mouseup', (event: MouseEvent) => {
      mouseDown = false
      if (moved) return;
      this.handleClick(mapImg, event);
    })
    mapImg.addEventListener('dragstart', (event: MouseEvent) => event.preventDefault())
    mapImg.addEventListener('mouseout', () => mouseDown = false);

    mapImg.addEventListener('mousemove', (event: MouseEvent) => {
      if (!mouseDown) return;
      if (!moved) moved = true;
      const layerPos = new V2(event.clientX, event.clientY);
      const movement = layerPos.subtract(initialMousePos)

      this.mapPos = baseline.add(movement)
      this.mapPos$.next(this.mapPos)
    })
  }

  private scrollingLogic(mapImg: HTMLImageElement): void {
    mapImg.addEventListener('wheel', (event: WheelEvent) => {
      const widthScalar = Math.pow(1.1, -Math.sign(event.deltaY))
      const oldSize = new V2(mapImg.offsetWidth, mapImg.offsetHeight)
      const newSize = oldSize.multiply(widthScalar)
      const layer = new V2(event.layerX, event.layerY);
      const mapSpacePos = layer.hadamardDivision(oldSize)

      this.mapPos = this.mapPos.add(oldSize.subtract(newSize).hadamardProduct(mapSpacePos))
      this.zoomLevel *= widthScalar;
      setTimeout(() => this.mapPos$.next(this.mapPos), 50)
      this.zoomLevel$.next(this.zoomLevel)
    })
  }

  private handleClick(mapImg: HTMLImageElement, event: MouseEvent): void {
    this.pinPopupService.getIfSet().pipe(take(1),
      map((set: boolean): boolean | void => this.clicked$.value !== null ? this.clicked$.next(null) : set),
      filter((set: boolean | void): set is boolean => set !== void 0),
      switchMap((set: boolean): Observable<true | null | void> => of(set ? this.pinPopupService.unset() : true)),
      filter((map: true | null | void): boolean => !!map),
    ).subscribe(() => {
      const mapSize = new V2(mapImg.offsetWidth, mapImg.offsetHeight);
      const layer = new V2(event.layerX, event.layerY);
      const client = new V2(event.clientX, event.clientY)

      const mapSpacePos = layer.hadamardDivision(mapSize)

      // TODO: you can open markers without the form closing first, fix this

      this.clicked$.next({
        position: mapSpacePos,
        positionTransformed: client
          .max(new V2(300, 250))
          .min(new V2((window.visualViewport?.width ?? 1920) - 300, (window.visualViewport?.height ?? 927) - 50))
      })
    })
  }

  private placePins(mapImg: HTMLImageElement): void {
    this.pins$ = this.map$.pipe(
      map((map: MapModel | null): number => map?.ID ?? -1),
      combineLatestWith(this.pinDataService.getAll()),
      filter(([id, pins]: [number, PinModel[]]): boolean =>
        id >= 0 && pins.length > 0),
      map(([id, pins]: [number, PinModel[]]): OmitPinPos[] => pins
        .filter((pin: PinModel) => pin.MapID === id)
        .map((pin: PinModel) => {
          return {
            MapID: pin.MapID,
            ID: pin.ID,
            Name: pin.Name,
            Content: pin.Content
          }
        })
      )
    )
    this.pinPositions$ = this.map$.pipe(
      map((map: MapModel | null): number => map?.ID ?? -1),
      combineLatestWith(this.pinDataService.getAll(), this.mapPos$, this.zoomLevel$),
      filter(([id, pins]: [number, PinModel[], V2, number]): boolean =>
        id >= 0 && pins.length > 0),
      map(([id, pins, mapPos, zoomLevel]: [number, PinModel[], V2, number]): Observable<V2>[] => pins
        .filter((pin: PinModel) => pin.MapID === id)
        .map((pin: PinModel): Observable<V2> => of(this.transformPos(pin.Pos, mapImg, zoomLevel, mapPos)))
      )
    )
  }

  private transformPos(pos: V2, mapImg: HTMLImageElement, zoomLevel: number, mapPos: V2): V2 {
    return pos
      .hadamardProduct(new V2(mapImg))
      .add(mapPos)
      .subtract(
        new V2(1,1)
          .multiply(this.basePinSize * (zoomLevel / this.zoomPinMod + 100 * (1 - 1/this.zoomPinMod)) / 100)
          .hadamardDivision(new V2(2, 1.1))
      )
  }

  public onFormFinish(): void {
    this.clicked$.next(null);
  }

  public onPinClicked(): void {
    this.clicked$.next(null);
  }

  public onBack(): void {
    void this.router.navigate(['/'])
  }

  protected readonly environment = environment;
  protected readonly of = of;
}
