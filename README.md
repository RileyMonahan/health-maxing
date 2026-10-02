# Health Maxing

A simple, premium health and fitness app for young men: training, nutrition,
sleep, energy and progress, with an in-app coach chat.

Built with React Native + Expo (SDK 57), TypeScript and Expo Router.
See [docs/PLAN.md](docs/PLAN.md) for the architecture, navigation, data models
and development plan.

## Preview on Windows

Double-click `Start Preview.bat`. See [SETUP-WINDOWS.md](SETUP-WINDOWS.md) for the one-time setup.

## Run it

```bash
npm install
npx expo start        # then scan the QR code with Expo Go, or press i / a / w
```

Everything runs locally on the device. No backend or API keys are needed.

## Checks

```bash
npm run typecheck     # tsc --noEmit
npm test              # domain logic tests (scores, targets, schedule, streaks, strength)
```

## Where things live

| Folder | What it holds |
|---|---|
| `src/app` | Screens and navigation (Expo Router, file based) |
| `src/components` | Shared UI kit and the line chart |
| `src/features` | Pieces that belong to one area (workout, nutrition, coach…) |
| `src/store` | App state, persisted on the device (Zustand + AsyncStorage) |
| `src/domain` | Pure logic and data models, no React |
| `src/content` | Training plans, exercises, nutrition plans, sample foods |
| `src/services` | Food database and coach messaging interfaces + mock versions |

## Common changes

- **Edit or add a training plan:** `src/content/trainingPlans.ts`. Each plan lists
  its workouts and which workouts run for each number of days per week.
- **Add an exercise:** `src/content/exercises.ts`.
- **Edit a nutrition plan:** `src/content/nutritionPlans.ts` (`proteinPerKg` and
  `fatPct` drive the calculated targets).
- **Connect a real food database:** write a class implementing `FoodService`
  (`src/services/food/FoodService.ts`) and use it in `src/services/index.ts`.
- **Connect real coach messaging:** implement `CoachService`
  (`src/services/coach/CoachService.ts`) on your backend (e.g. Supabase Realtime)
  and switch it in `src/services/index.ts`.
- **Move data to Supabase:** see "Moving to Supabase later" in `docs/PLAN.md`.

## Mocked in V1, on purpose

- Food search uses sample foods; barcode scanning is a placeholder that looks up
  sample barcodes through the same service the real scanner will use.
- Coach chat stores messages on the device and sends a labelled demo reply.
- Notification toggles are saved but don't schedule push reminders yet.
