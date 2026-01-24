# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wingsearch is a web application for searching throughout the Wingspan board game card collection. The app is built with Angular 9 and published as a Progressive Web App at https://navarog.github.io/wingsearch/.

## Tech Stack

- **Angular 9**: Main framework
- **NgRx 10**: State management (store, effects, router-store, devtools)
- **Angular Material**: UI components
- **FlexSearch**: Fast full-text search library
- **TypeScript 3.8**
- **SCSS**: Styling
- **Service Worker**: PWA functionality
- **Python + Jupyter Notebooks**: Data transformation pipeline

## Development Commands

```bash
# Start development server
npm start

# Build for production (deployed to GitHub Pages)
npm run build-prod

# Build for local testing
npm run build-local

# Run tests
npm test

# Run linter
npm lint

# Serve built application locally
npm run http-server
```

**Note:** The project requires Node v14.17.4 and npm 8.12.2 (see `engines` in package.json).

## Architecture

### State Management (NgRx)

The application uses a single NgRx store defined in [src/app/store/](src/app/store/):

- **app.reducer.ts**: Main reducer containing all state logic
- **app.actions.ts**: Action definitions
- **app.effects.ts**: Side effects handling
- **app.interfaces.ts**: TypeScript interfaces for BirdCard, BonusCard, and AppState
- **cards-search.ts**: FlexSearch index initialization and search logic
- **bonus-search-map.ts**: Bonus card filtering logic

The AppState contains:
- Card collections (bird cards, bonus cards, hummingbird cards)
- Search indexes (FlexSearch instances)
- Display state (filtered/visible cards, stats)
- User preferences (expansions, language, asset pack)
- Translated content for internationalization

### Data Flow

1. **Source Data**: Excel files in [scripts/](scripts/) directory:
   - `wingspan-card-list.xlsx`: Bird card data
   - `wingspan-bonuscard-list.xlsx`: Bonus card data
   - `wingspan-note-list.xlsx`: Additional notes and rulings

2. **Transform**: Python scripts/Jupyter notebooks in [scripts/](scripts/) convert Excel to JSON:
   - `json-transformer.ipynb`: Main transformation notebook
   - Generated files go to `scripts/generated/` (not committed)

3. **Assets**: JSON files in [src/assets/data/](src/assets/data/):
   - `master.json`: Main bird cards
   - `hummingbirds.json`: Hummingbird cards (Americas expansion)
   - `bonus.json`: Bonus cards
   - `goals.json`: Goal cards
   - `parameters.json`: App configuration

4. **Search**: FlexSearch indexes are initialized in the reducer from JSON data

### Component Structure

- **search/**: Main search interface with filters and controls
  - `language-dialog/`: Language selection dialog
  - `asset-pack-dialog/`: Asset pack (card art) selection
- **display/**: Card display grid with infinite scroll
- **bird-card/**: Bird card visualization
  - `bird-card-detail/`: Detailed card modal
- **hummingbird-card/**: Hummingbird-specific card display
- **bonus-card/**: Bonus card visualization
  - `bonus-card-detail/`: Detailed bonus card modal
- **stats/**: Statistics display (card counts, habitat distribution)
- **consent/**: Cookie consent UI

### Internationalization

Translation files are managed as Excel spreadsheets in [i18n/](i18n/):
- Each language has its own `.xlsx` file (e.g., `de.xlsx`, `fr.xlsx`)
- `template.xlsx`: Template for new translations
- See [i18n/README.md](i18n/README.md) for translation contribution guidelines
- Translations are converted to JSON and stored in `src/assets/data/i18n/`
- The `TranslatePipe` handles runtime translation based on selected language

### Custom Directives and Pipes

- **IconizePipe**: Converts text markers like `[forest]` to icon images
- **TranslatePipe**: Runtime translation based on loaded language data
- **FitTextDirective**: Dynamic font scaling for card text
- **AnalyticsEventDirective**: Google Analytics event tracking
- **SafePipe**: Bypass Angular's security for trusted HTML

## Build and Deployment

The production build is deployed to GitHub Pages:
- Output directory: `docs/` (configured in `build-prod` script)
- Base href: `/wingsearch/`
- Service worker enabled for PWA functionality
- 404.html is a copy of index.html for client-side routing

## Data Updates

When updating bird/bonus card data:

1. Edit the Excel files in [scripts/](scripts/)
2. Run the Jupyter notebooks to generate JSON files
3. Copy generated JSON from `scripts/generated/` to `src/assets/data/`
4. Ensure JSON files are properly formatted
5. Test search functionality and card display

## Key Files

- [src/app/app.module.ts](src/app/app.module.ts): Main module with NgRx store configuration
- [src/app/store/app.reducer.ts](src/app/store/app.reducer.ts): Core business logic and filtering
- [angular.json](angular.json): Angular CLI configuration
- [ngsw-config.json](ngsw-config.json): Service worker configuration
- [scripts/json-transformer.ipynb](scripts/json-transformer.ipynb): Data transformation pipeline

## Testing

- Testing framework: Jasmine + Karma
- Components are configured with `skipTests: true` in Angular schematics
- Run tests with `npm test`
