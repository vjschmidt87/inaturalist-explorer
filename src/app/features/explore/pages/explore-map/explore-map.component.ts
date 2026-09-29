import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ObservationService } from '@core/services/observation.service';
import { Observation, getPhotoUrl } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import {
  BehaviorSubject,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  finalize,
  startWith,
  combineLatest,
} from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-explore-map',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="explore-page">
      <div class="map-sidebar">
        <h2 class="sidebar-title">{{ t.t('explore.title') }}</h2>

        <div class="filter-group">
          <label class="filter-label">{{ t.t('explore.searchSpecies') }}</label>
          <input
            type="text"
            class="filter-input"
            [placeholder]="t.t('explore.speciesPlaceholder')"
            [formControl]="taxonControl"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ t.t('explore.qualityGrade') }}</label>
          <select class="filter-select" [formControl]="qualityControl">
            <option value="">{{ t.t('explore.all') }}</option>
            <option value="research">{{ t.t('explore.researchGrade') }}</option>
            <option value="needs_id">{{ t.t('explore.needsId') }}</option>
          </select>
        </div>

        @if (loading) {
          <div class="loading-indicator">
            <div class="spinner"></div>
            <span>{{ t.t('loading.observations') }}</span>
          </div>
        }

        <div class="results-list">
          @for (obs of observations; track obs.id) {
            <a [routerLink]="['/observations', obs.id]" class="result-item" (mouseenter)="highlightMarker(obs.id)">
              <div class="result-thumb">
                @if (obs.photos.length > 0) {
                  <img [src]="getPhotoUrl(obs.photos[0], 'square')" [alt]="obs.species_guess" />
                } @else {
                  <div class="no-thumb">🌿</div>
                }
              </div>
              <div class="result-info">
                <span class="result-name">{{ obs.species_guess || t.t('explore.unknown') }}</span>
                <span class="result-user">{{ obs.user.login }}</span>
              </div>
            </a>
          }
        </div>

        <p class="results-count">{{ t.t('explore.observationsShown', { count: observations.length }) }}</p>
      </div>

      <div class="map-container" #mapContainer></div>
    </div>
  `,
  styleUrl: './explore-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreMapComponent implements OnInit, AfterViewInit {
  private readonly observationService = inject(ObservationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly t = inject(TranslationService);

  @ViewChild('mapContainer', { static: true }) mapRef!: ElementRef<HTMLDivElement>;

  taxonControl = new FormControl('', { nonNullable: true });
  qualityControl = new FormControl('', { nonNullable: true });

  observations: Observation[] = [];
  loading = false;

  readonly getPhotoUrl = getPhotoUrl;

  private map!: L.Map;
  private markerLayer = L.layerGroup();
  private markers = new Map<number, L.Marker>();
  private bounds$ = new BehaviorSubject<L.LatLngBounds | null>(null);

  ngAfterViewInit(): void {
    this.map = L.map(this.mapRef.nativeElement).setView([20, 0], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);

    this.map.on('moveend', () => {
      this.bounds$.next(this.map.getBounds());
    });

    setTimeout(() => this.bounds$.next(this.map.getBounds()), 100);
  }

  ngOnInit(): void {
    const taxon$ = this.taxonControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith('')
    );

    const quality$ = this.qualityControl.valueChanges.pipe(
      distinctUntilChanged(),
      startWith('')
    );

    combineLatest([this.bounds$, taxon$, quality$])
      .pipe(
        debounceTime(300),
        switchMap(([bounds, taxon, quality]) => {
          if (!bounds) return [];
          this.loading = true;
          const center = bounds.getCenter();
          return this.observationService
            .search({
              lat: center.lat,
              lng: center.lng,
              radius: this.boundsToRadius(bounds),
              taxon_name: taxon || undefined,
              quality_grade: (quality as Observation['quality_grade']) || undefined,
              per_page: 100,
              photos: true,
              geo: true,
              order_by: 'created_at',
              order: 'desc',
            })
            .pipe(finalize(() => (this.loading = false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (Array.isArray(response)) return;
          this.observations = response.results;
          this.updateMarkers(response.results);
        },
      });
  }

  highlightMarker(obsId: number): void {
    const marker = this.markers.get(obsId);
    if (marker) {
      marker.openPopup();
    }
  }

  private updateMarkers(observations: Observation[]): void {
    this.markerLayer.clearLayers();
    this.markers.clear();

    observations.forEach((obs) => {
      if (obs.geojson) {
        const [lng, lat] = obs.geojson.coordinates;
        const marker = L.marker([lat, lng])
          .bindPopup(this.createPopup(obs))
          .addTo(this.markerLayer);
        this.markers.set(obs.id, marker);
      } else if (obs.latitude && obs.longitude) {
        const marker = L.marker([obs.latitude, obs.longitude])
          .bindPopup(this.createPopup(obs))
          .addTo(this.markerLayer);
        this.markers.set(obs.id, marker);
      }
    });
  }

  private createPopup(obs: Observation): string {
    const photo = obs.photos.length > 0
      ? `<img src="${getPhotoUrl(obs.photos[0], 'small')}" style="width:100%;border-radius:4px;margin-bottom:4px;" />`
      : '';
    const viewDetails = this.t.t('explore.viewDetails');
    return `
      <div style="max-width:200px;">
        ${photo}
        <strong>${obs.species_guess || this.t.t('explore.unknown')}</strong><br/>
        <small>${obs.user.login}</small><br/>
        <a href="/observations/${obs.id}">${viewDetails}</a>
      </div>
    `;
  }

  private boundsToRadius(bounds: L.LatLngBounds): number {
    const center = bounds.getCenter();
    const ne = bounds.getNorthEast();
    const distKm = center.distanceTo(ne) / 1000;
    return Math.min(Math.round(distKm), 500);
  }
}
