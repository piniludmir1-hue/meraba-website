# MERABA Website Image Specification for Designers

This document defines the production image requirements for CMS-managed MERABA website images.

The public website is the source of truth. Images must be prepared for the rendered frontend containers, not only for the upload field labels.

## Global Rules

- Use clean, premium, product-focused images.
- Avoid small text, logos, tiny details, busy backgrounds, or important details near the edges.
- Preferred formats: WebP for best web delivery, or high-quality JPG / JPEG for photographic images.
- PNG is acceptable for graphics that require transparency, but not preferred for large photos.
- Do not upload very large uncompressed files. Aim for the best visual quality at practical file size.
- Recommended file size for card/product photos: ideally under 600 KB, maximum around 1 MB unless there is a strong quality reason.
- Most rendered image areas use `object-fit: cover` or `background-size: cover`. Cover behavior crops any image whose aspect ratio does not match the container.

## Active CMS Image Fields

| CMS Location | Field | Public Location / Component | Desktop Rendered Container | Tablet Rendered Container | Mobile Rendered Container | Final Designer Spec | Crop / Behavior | Safe Composition |
|---|---|---|---:|---:|---:|---|---|---|
| Admin -> Homepage -> Hero -> Continuous Hero Grid Image | `homepage.hero.continuousImage.src` | Homepage hero continuous image, `HeroMediaGrid` | One image is mapped across the full responsive hero grid. At 1440px viewport, approximate full grid is 562 x 640 px before tile masking. | At 768px viewport, approximate full grid is 683 x 576 px. | At 390px viewport, approximate full grid is 362 x 363 px. | Recommended 2400 x 2800 px. Minimum 1800 x 2100 px. Near-portrait, approx 6:7 to 4:5. | Uses calculated `background-size: cover` across multiple tiles. Responsive crop is expected. | Keep all important products/details in the central 60%. Avoid tile gaps and all outer edges. |
| Admin -> Homepage -> Hero -> Homepage Hero Main Image | `homepage.hero.mainImage.src` | Homepage large hero tile, `HeroMediaGrid` | At 1440px viewport approx 414 x 640 px, ratio 0.65:1. | At 768px viewport approx 509 x 576 px, ratio 0.88:1. | At 390px viewport approx 224 x 363 px, ratio 0.62:1. | Recommended 1500 x 2500 px. Minimum 1200 x 2000 px. Tall portrait, approx 3:5. | Rendered as CSS background with `background-size: cover; background-position: center`. Responsive crop is expected. | Keep subject centered inside the central 65%. No important edge details. |
| Admin -> Homepage -> Hero -> Homepage Hero Side Image 1 | `homepage.hero.sideImage1.src` | Homepage top side hero tile, `HeroMediaGrid` | At 1440px viewport approx 129 x 251 px, ratio 0.51:1. | At 768px viewport approx 158 x 227 px, ratio 0.70:1. | At 390px viewport approx 131 x 146 px, ratio 0.90:1. | Recommended 1200 x 1500 px. Minimum 900 x 1125 px. 4:5 portrait. | Rendered as CSS background with `background-size: cover; background-position: 68% 62%`. Responsive crop is expected. | Keep subject in the central 60%. Add extra margin on all edges. |
| Admin -> Homepage -> Hero -> Homepage Hero Side Image 2 | `homepage.hero.sideImage2.src` | Homepage middle side hero tile, `HeroMediaGrid` | At 1440px viewport approx 129 x 197 px, ratio 0.66:1. | At 768px viewport approx 158 x 178 px, ratio 0.89:1. | At 390px viewport approx 131 x 114 px, ratio 1.15:1. | Recommended 1200 x 1200 px. Minimum 900 x 900 px. 1:1 square. | Rendered as CSS background with `background-size: cover; background-position: 86% 82%`. Crop can favor lower-right. | Keep important detail in the central 60%. Avoid edge details. |
| Admin -> Homepage -> Hero -> Homepage Hero Side Image 3 | `homepage.hero.sideImage3.src` | Homepage bottom side hero tile, `HeroMediaGrid` | At 1440px viewport approx 129 x 155 px, ratio 0.84:1. | At 768px viewport approx 158 x 140 px, ratio 1.13:1. | At 390px viewport approx 131 x 90 px, ratio 1.46:1. | Recommended 1600 x 1200 px. Minimum 1200 x 900 px. 4:3 landscape. | Rendered as CSS background with `background-size: cover; background-position: 48% 78%`. Responsive crop is expected, especially mobile. | Keep subject centered in the central 65%. Avoid edge details. |
| Admin -> Homepage -> Homepage Product Areas -> Homepage Product Area Image | `homepage-product-areas.areas[].image` | Homepage Product Area card, `EditableMedia` | Fixed 4:3. 1280px viewport: 264 x 198 px. 1440px: 300 x 225 px. 1600px: 320 x 240 px. 1920px: 332 x 249 px. | Fixed 4:3. At 768px viewport approx 322 x 242 px. | Fixed 4:3. At 390px viewport approx 319 x 239 px. | Required ratio 4:3. Recommended 2400 x 1800 px. Minimum 1600 x 1200 px. Maximum useful 3200 x 2400 px. | Uses `<img>` with `object-fit: cover`. A correct 4:3 image does not crop at rest. Hover scale is 1.018, causing a tiny edge crop. | Keep key details inside central 90%. Use centered product/category composition. |
| Admin -> Products Page -> Products Page Categories -> Products Page Category Image | `categories.categories[].image` | Products Page category card, `ProductVisual` | Fixed 4:3 after standardization. Approx media content size: 1280px viewport 242 x 182 px; 1440px 258 x 194 px; 1600px 286 x 215 px; 1920px 302 x 227 px. | Fixed 4:3. At 768px viewport approx 307 x 230 px. | Fixed 4:3. At 390px viewport approx 304 x 228 px; at 430px approx 344 x 258 px. | Required ratio 4:3. Recommended 2400 x 1800 px. Minimum 1600 x 1200 px. Maximum useful 3200 x 2400 px. | Uses `<img>` with `object-fit: cover`. A correct 4:3 image does not crop. | Keep product family large, centered, and inside central 90%. |

## Unused / Future CMS Image Fields

These fields exist in the CMS for stored legacy/future data but are not currently displayed on the public website. They should not be used for current production image preparation unless the public design changes.

| CMS Location | Field | Current Public Status | Recommended Future Spec If Enabled |
|---|---|---|---|
| Admin -> Products Page -> Specific Products / Optional Product Items -> Specific Product Image | `products.products[].image` | Not currently displayed publicly. | 4:3. Recommended 2400 x 1800 px. Minimum 1600 x 1200 px. |
| Admin -> About Page -> Unused About Hero Image | `about-page.hero.image.src` | Not currently displayed publicly. | Define only if a future About image section is designed. |
| Admin -> About Page -> Unused Company Statement Image | `about-page.companyStatement.image.src` | Not currently displayed publicly. | Define only if a future About image section is designed. |
| Admin -> About Page -> Unused Support Image | `about-page.support.image.src` | Not currently displayed publicly. | Define only if a future About image section is designed. |

## Why Correctly Sized Images Were Still Cropping

The main mismatch was the Products Page category card image.

Previously, the Admin specified 4:3 images, but the public Products Page category media container used a variable fixed-height layout. That produced wider-than-4:3 containers on several breakpoints. Because the image used `object-fit: cover`, a correct 4:3 upload still cropped vertically.

The container has now been standardized to 4:3, matching the Admin specification and the Homepage Product Area system.

Hero images are different. The hero image grid is an editorial collage with different tile ratios across responsive breakpoints. It intentionally uses `background-size: cover`. Cropping is part of that design and cannot be eliminated without changing the hero design or adding focal-point controls.

## Final Production Standards

### Product / Category Cards

- Ratio: 4:3.
- Ideal: 2400 x 1800 px.
- Minimum: 1600 x 1200 px.
- Maximum useful: 3200 x 2400 px.
- Format: WebP or high-quality JPG / JPEG.
- File size: ideally under 600 KB, maximum around 1 MB.
- Composition: centered product/category subject, central 90% safe area.
- Expected crop: none at rest when the image is true 4:3. Homepage cards have a tiny hover crop from scale.

### Homepage Hero Collage

- Use the individual specs in the table above.
- Cropping is expected.
- Keep subjects away from edges.
- Avoid small text or details.
- Use simple, high-contrast compositions that tolerate responsive cropping.
