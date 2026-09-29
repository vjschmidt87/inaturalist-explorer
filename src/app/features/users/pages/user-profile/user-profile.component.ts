import { Component, ChangeDetectionStrategy, DestroyRef, inject, OnInit, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { UserService } from '@core/services/user.service';
import { UserDetail } from '@core/models';
import { TranslationService } from '@core/i18n/translation.service';
import { UserStatsComponent } from '../../components/user-stats/user-stats.component';
import { UserObservationsComponent } from '../../components/user-observations/user-observations.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { BehaviorSubject, switchMap, filter, finalize } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    DatePipe,
    UserStatsComponent,
    UserObservationsComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
  ],
  template: `
    @if (loading) {
      <app-loading-spinner [message]="t.t('loading.profile')" />
    } @else if (error) {
      <app-error-message [message]="error" (retry)="reload()" />
    } @else if (user) {
      <div class="profile-page">
        <div class="profile-header">
          <img
            [src]="user.icon_url || user.icon || 'assets/default-avatar.svg'"
            [alt]="user.login"
            class="profile-avatar"
          />
          <div class="profile-info">
            <h1 class="profile-name">{{ user.name || user.login }}</h1>
            @if (user.name) {
              <p class="profile-login">&#64;{{ user.login }}</p>
            }
            <p class="profile-joined">{{ t.t('user.joined') }} {{ user.created_at | date:'mediumDate' }}</p>
          </div>
        </div>

        @if (user.description) {
          <div class="profile-bio">
            <p>{{ user.description }}</p>
          </div>
        }

        <app-user-stats [user]="user" />

        <section class="profile-section">
          <h2 class="section-title">{{ t.t('user.recentObservations') }}</h2>
          <app-user-observations [userLogin]="user.login" />
        </section>
      </div>
    }
  `,
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  readonly t = inject(TranslationService);

  @Input() login!: string;

  user: UserDetail | null = null;
  loading = true;
  error: string | null = null;

  private login$ = new BehaviorSubject<string | null>(null);

  ngOnInit(): void {
    this.login$.next(this.login);

    this.login$
      .pipe(
        filter((login): login is string => login !== null),
        switchMap((login) => {
          this.loading = true;
          this.error = null;
          return this.userService
            .getByLogin(login)
            .pipe(finalize(() => (this.loading = false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (user) => (this.user = user),
        error: (err) => (this.error = err.message),
      });
  }

  reload(): void {
    this.login$.next(this.login);
  }
}
