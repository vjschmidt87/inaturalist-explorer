import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Taxon } from '@core/models';

@Component({
  selector: 'app-taxonomy-tree',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (ancestors && ancestors.length > 0) {
      <nav class="taxonomy-tree">
        @for (ancestor of ancestors; track ancestor.id; let last = $last) {
          <a
            [routerLink]="['/species', ancestor.id]"
            class="taxon-node"
            [class.current]="last"
          >
            <span class="rank">{{ ancestor.rank }}</span>
            <span class="name">{{ ancestor.preferred_common_name || ancestor.name }}</span>
            <span class="scientific" [class.visible]="ancestor.preferred_common_name">
              {{ ancestor.name }}
            </span>
          </a>
          @if (!last) {
            <span class="arrow">→</span>
          }
        }
      </nav>
    }
  `,
  styleUrl: './taxonomy-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxonomyTreeComponent {
  @Input() ancestors: Taxon[] = [];
}
