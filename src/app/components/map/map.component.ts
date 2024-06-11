import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  BehaviorSubject,
  combineLatestWith,
  filter,
  map,
  Observable,
  switchMap
} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {MapModel} from "../../models/map.model";
import {MapDataService} from "../../services/map-data.service";
import {V2} from "../../models/V2.class";
import {PinDataService} from "../../services/pin-data.service";
import {PinService} from "../../services/pin.service";
import { PinModel } from '../../models/pin.model';
import { MarkerComponent } from './marker/marker.component';
import { RealInitDirective } from '../../directives/real-init.directive';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    RealInitDirective,
    MarkerComponent
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
  public pins$!: Observable<PinModel[]>

  constructor(
    private route: ActivatedRoute,
    private dataService: MapDataService,
    private pinDataService: PinDataService,
    private pinService: PinService,
    private elRef: ElementRef
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
      moved = true;
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
    const mapSize = new V2(mapImg.offsetWidth, mapImg.offsetHeight);
    const layer = new V2(event.layerX, event.layerY);

    const mapSpacePos = layer.hadamardDivision(mapSize)


    this.map$.pipe(
      map((map: MapModel | null): number => map?.ID ?? -1),
      filter((id: number): boolean => id >= 0),
      switchMap((id: number): Observable<void> => this.pinService.createNew({
        name: 'fourth',
        mapId: id,
        content: 'none',
        y: mapSpacePos.y,
        x: mapSpacePos.x,
      }))
    ).subscribe()
  }

  private placePins(mapImg: HTMLImageElement): void {
    this.pins$ = this.map$.pipe(
      map((map: MapModel | null): number => map?.ID ?? -1),
      combineLatestWith(this.pinDataService.getAll(), this.mapPos$, this.zoomLevel$),
      filter(([id, pins]: [number, PinModel[], V2, number]): boolean =>
        id >= 0 && pins.length > 0),
      map(([id, pins, mapPos, zoomLevel]: [number, PinModel[], V2, number]): PinModel[] => pins
          .filter((pin: PinModel) => pin.MapID === id)
          .map((pin: PinModel) => {
            return {
              Pos: pin.Pos
                .hadamardProduct(new V2(mapImg))
                .add(mapPos)
                .subtract(
                  new V2(this.basePinSize * zoomLevel / 100, this.basePinSize * zoomLevel / 100).hadamardDivision(new V2(2, 1.1))
                ),
              MapID: pin.MapID,
              ID: pin.ID,
              Name: pin.Name,
              Content: pin.Content
            }
          })
      )
    )
  }

  protected readonly environment = environment;
}
