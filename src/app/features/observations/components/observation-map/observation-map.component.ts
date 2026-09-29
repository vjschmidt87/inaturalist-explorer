import {
  Component,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnChanges,
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-observation-map',
  standalone: true,
  template: `<div class="map" #mapEl></div>`,
  styleUrl: './observation-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationMapComponent implements AfterViewInit, OnChanges {
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;

  @ViewChild('mapEl', { static: true }) mapRef!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private marker: L.Marker | null = null;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapRef.nativeElement).setView(
      [this.latitude ?? 0, this.longitude ?? 0],
      this.latitude ? 10 : 2
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(this.map);

    this.updateMarker();
  }

  ngOnChanges(): void {
    if (this.map) {
      this.updateMarker();
    }
  }

  private updateMarker(): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    if (this.latitude && this.longitude) {
      this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map);
      this.map.setView([this.latitude, this.longitude], 10);
    }
  }
}
