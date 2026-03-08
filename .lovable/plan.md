

## Plan: Update App Logo

Replace the current `src/assets/heyme-logo.png` with the uploaded Korean finger heart image.

### Steps
1. Copy `user-uploads://IMG_20260308_191953.jpg` to `src/assets/heyme-logo.png`, overwriting the existing logo
2. Also update the favicon (`public/favicon.png`) to match

This will automatically update the logo across Login, Subscription, Index, and Dashboard pages since they all import from `src/assets/heyme-logo.png`.

