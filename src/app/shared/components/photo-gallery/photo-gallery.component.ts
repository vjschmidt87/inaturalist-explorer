import { Component, ChangeDetectionStrategy, Input, signal, computed, inject } from '@angular/core';
import { Photo, getPhotoUrl } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  template: `
    @if (photos.length > 0) {
      <div class="gallery">
        <div class="gallery-main">
          <img
            [src]="mainPhotoUrl()"
            [alt]="'Photo ' + (selectedIndex() + 1)"
            class="main-image"
          />
          <span class="photo-attribution">{{ photos[selectedIndex()].attribution }}</span>
        </div>
        @if (photos.length > 1) {
          <div class="gallery-thumbnails">
            @for (photo of photos; track photo.id; let i = $index) {
              <button
                class="thumbnail"
                [class.active]="i === selectedIndex()"
                (click)="selectedIndex.set(i)"
              >
                <img [src]="getThumbUrl(photo)" [alt]="'Thumbnail ' + (i + 1)" />
              </button>
            }
          </div>
        }
      </div>
    } @else {
      <div class="no-photo">
        <span>{{ t.t('photo.noPhotos') }}</span>
      </div>
    }
  `,
  styleUrl: './photo-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGalleryComponent {
  readonly t = inject(TranslationService);

  @Input({ required: true }) photos: Photo[] = [];

  selectedIndex = signal(0);

  mainPhotoUrl = computed(() => {
    const photo = this.photos[this.selectedIndex()];
    return photo ? getPhotoUrl(photo, 'large') : '';
  });

  getThumbUrl(photo: Photo): string {
    return getPhotoUrl(photo, 'square');
  }
}
