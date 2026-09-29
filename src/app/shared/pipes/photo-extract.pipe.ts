import { Pipe, PipeTransform } from '@angular/core';
import { Photo, TaxonPhoto } from '@core/models';

@Pipe({ name: 'photoExtract', standalone: true })
export class PhotoExtractPipe implements PipeTransform {
  transform(taxonPhotos: TaxonPhoto[]): Photo[] {
    return taxonPhotos.map((tp) => tp.photo);
  }
}
