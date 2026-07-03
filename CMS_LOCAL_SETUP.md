# MERABA CMS local setup

The MERABA site uses Decap CMS with a Git-based content structure.

Editable content lives in focused JSON files:

- `src/content/site-settings.json`
- `src/content/media.json`
- `src/content/homepage.json`
- `src/content/products-page.json`
- `src/content/about-page.json`
- `src/content/contact-page.json`
- `src/content/categories.json`
- `src/content/products.json`

`src/content/site.json` is kept as an older combined reference file. The live site reads the split files through `src/lib/content.ts`.

Uploaded media goes to `public/uploads`.

The admin is organized into:

- Site Settings
- Media / Images
- Homepage
- Products Page
- Product Categories
- Products
- About Page
- Contact Page

## Local development

Run two terminals from the project folder.

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
npm run cms
```

Then open:

```text
http://localhost:3000/admin
```

When `npm run cms` is running, Decap uses the local backend proxy at:

```text
http://localhost:8081/api/v1
```

Local editing should not require an email/password login. If the login screen appears locally, the CMS proxy is not running or port `8081` is blocked.

The Netlify Identity widget is not loaded on `localhost` or `127.0.0.1`. If you still see a Netlify site URL prompt during local development:

1. Make sure `npm run cms` is still running.
2. Hard-refresh the admin page.
3. Open `http://localhost:3000/admin` rather than a deployed URL.
4. Confirm the proxy is reachable at `http://localhost:8081/api/v1`.

## Testing local edits

1. Open `http://localhost:3000/admin`.
2. Open the relevant admin area, such as `Product Categories` or `Homepage`.
3. Edit a field, such as a product category title or description.
4. Save/publish the entry.
5. Confirm the matching JSON file changed, such as `src/content/categories.json`.
6. Refresh the website page to see the update.

For images, upload through the CMS image fields. Files are written to:

```text
public/uploads
```

## Production admin access

Production admin access should remain protected.

The current config uses:

```yaml
backend:
  name: git-gateway
  branch: main
```

For deployment, configure:

- Git Gateway or another supported Decap backend
- an identity/auth provider
- invited admin users who are allowed to edit content

If deploying on Netlify, enable:

1. Identity
2. Git Gateway
3. Invite the MERABA admin user by email
4. Open `/admin` on the live site and log in with that invited user

Do not enable public self-registration for the CMS unless intentionally desired.
