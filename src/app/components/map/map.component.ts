import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {map, Observable, switchMap} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {MapModel} from "../../models/map.model";
import {MapDataService} from "../../services/map-data.service";
import {MapInitDirective} from "../../directives/map-init.directive";
import {V2} from "../../models/V2.class";
import {PinDataService} from "../../services/pin-data.service";
import {PinService} from "../../services/pin.service";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    MapInitDirective
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  public mapPos = new V2();
  public zoomLevel = 100;
  public map$!: Observable<MapModel | null>

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
    })
  }

  private handleClick(mapImg: HTMLImageElement, event: MouseEvent): void {
    const mapSize = new V2(mapImg.offsetWidth, mapImg.offsetHeight);
    const layer = new V2(event.layerX, event.layerY);
    const client = new V2(event.clientX, event.clientY);

    const mapSpacePos = layer.hadamardDivision(mapSize)
    this.pinService.createNew({
      mapId: 7,
      content: 'none',
      y: mapSpacePos 
    })
  }
}
