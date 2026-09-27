# Adding & Removing Products — A Guide for Bluepetal

You don't need to know any coding to keep the website's catalogue up to
date. Everything is controlled from a Google Sheet.

## The short version

1. Open the Bluepetal **Products** Google Sheet.
2. Add one new row per product, filling in the columns described below.
3. Upload the product photo to the website's GitHub page (steps below).
4. Save — the website picks up your change automatically the next time
   someone visits (no need to tell the developer, no rebuilding anything).

## The Sheet's columns

| Column | What to put there | Required? |
|---|---|---|
| `category` | One of: `hand-painted-clutches`, `hand-painted-sarees`, `hand-painted-stoles` (ask the developer to add a new one if you need it) | Yes |
| `title` | The product's name, e.g. `Marigold Bloom Clutch` | Yes |
| `description` | A short one- or two-line description | No |
| `price` | Just the number, e.g. `1899` — leave blank to show "Price on request" | No |
| `currency` | Leave blank — defaults to `INR` | No |
| `image` | The exact photo filename you uploaded, e.g. `clutch-blue-floral.jpg` | Yes (unless using `image_url`) |
| `image_url` | Only use this if you're linking to a photo hosted somewhere else instead of uploading one | No |
| `alt_text` | A short description of what's in the photo, for accessibility and search engines, e.g. `Hand-painted blue floral clutch` | Recommended |
| `tags` | Comma-separated keywords people might search for, e.g. `floral, blue, wedding` | No |
| `featured` | Type `TRUE` if you want it on the homepage, otherwise leave blank | No |
| `status` | Leave blank for a normal listing. Type `Hidden` to temporarily take it off the site without deleting the row. Type `SoldOut` to show a "Sold Out" tag. | No |
| `sku` | An internal reference code, if you use one | No |

**Worked example row:**

| category | title | description | price | image | alt_text | tags | featured | status |
|---|---|---|---|---|---|---|---|---|
| hand-painted-clutches | Marigold Bloom Clutch | A hand-painted floral motif in warm marigold tones. | 1899 | clutch-marigold.jpg | Hand-painted marigold floral clutch | floral, festive, wedding | TRUE | |

## Uploading a photo (no coding needed)

1. Go to the website's GitHub page: `https://github.com/kulakshay/bluepetalportal`
2. Open the `images/products/` folder, then open the folder for the right
   category (e.g. `hand-painted-clutches`).
3. Click **Add file → Upload files**, then drag in your photo.
4. Scroll down and click **Commit changes** to save.
5. Copy the exact filename (including `.jpg`/`.png` and matching upper/lower
   case) into the `image` column of your Sheet row.

**Filename tips:** use lowercase letters, numbers, and hyphens only — no
spaces — e.g. `clutch-blue-floral.jpg`, not `Clutch Blue Floral.JPG`.

**Photo tips (optional but recommended):** where possible, take one clean
close-up photo of the hand-painted artwork itself, and one photo of the
piece styled or worn, in natural daylight — this keeps photos looking
consistent across the catalogue.

## Removing a product

You don't need to delete the row. Just set its `status` column to `Hidden`
and it will disappear from the site while staying in your records. If you
truly want it gone, you can delete the row entirely.

## Troubleshooting

- **Photo doesn't show up on the site:** the filename in the `image` column
  must exactly match the uploaded file, including capitalization and the
  file extension (`.jpg` vs `.JPG` vs `.png`).
- **A new product doesn't appear:** double check the `status` column isn't
  set to `Hidden`, and that `category` is spelled exactly like one of the
  existing categories.
- **The whole catalogue looks wrong/empty:** the site automatically falls
  back to a saved sample listing if it can't reach the Sheet — this fixes
  itself once the Sheet is reachable again. Check that the Sheet is still
  shared as "Anyone with the link — Viewer".
