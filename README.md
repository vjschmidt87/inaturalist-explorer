# iNaturalist Explorer

An Angular frontend client for the [iNaturalist API v1](https://api.inaturalist.org/v1/docs/), built as a portfolio project to demonstrate RxJS, SCSS architecture, and modern Angular best practices.

## Features

- **Observations Browser** — Search, filter, and paginate wildlife observations
- **Species Directory** — Explore taxonomy with species cards and detail pages
- **User Profiles** — View observer stats and recent activity
- **Interactive Map** — Leaflet-powered map with live observation markers
- **Responsive Design** — Works across desktop, tablet, and mobile

## Tech Stack

- Angular 17+ (standalone components, signals, new control flow)
- RxJS 7.8 (combineLatest, switchMap, debounceTime, BehaviorSubject)
- SCSS with shared variables, mixins, and placeholder selectors
- Leaflet for interactive maps
- Docker + Nginx for production deployment

## Architecture

```
src/
├── app/
│   ├── core/              # Services, interceptors, models
│   ├── shared/            # Reusable components, pipes
│   ├── features/
│   │   ├── home/          # Landing page
│   │   ├── observations/  # Observation list + detail
│   │   ├── species/       # Species list + detail + taxonomy
│   │   ├── users/         # User profiles
│   │   └── explore/       # Interactive map
│   └── layout/            # Header, footer
├── styles/                # Shared SCSS (_variables, _mixins, etc.)
└── environments/          # Environment configs
```

## Quick Start

### Docker

```bash
docker compose up --build
# Open http://localhost:4200
```

### Local Development

```bash
npm install
npm start
# Open http://localhost:4200
```

## RxJS Patterns Demonstrated

- `combineLatest` + `switchMap` for reactive multi-filter search
- `debounceTime` + `distinctUntilChanged` for search-as-you-type
- `BehaviorSubject` for component state management
- `takeUntilDestroyed` for automatic subscription cleanup
- `finalize` for loading state management

## SCSS Architecture

All components share a common design system:
- `_variables.scss` — Colors, typography, spacing, breakpoints
- `_mixins.scss` — Responsive helpers, card styles, flex utilities
- `_typography.scss` — Text placeholder selectors
- `_buttons.scss` — Button placeholder selectors
- `_forms.scss` — Form element placeholders

## API

This project consumes the public iNaturalist API v1 (no authentication required for read-only endpoints):
- `GET /observations` — Search observations
- `GET /observations/{id}` — Observation detail
- `GET /taxa` — Search species
- `GET /taxa/{id}` — Species detail
- `GET /taxa/autocomplete` — Taxon autocomplete
- `GET /users/{id}` — User profile
- `GET /places/autocomplete` — Place autocomplete

## Disclaimer

This is a portfolio project and is not affiliated with iNaturalist.
