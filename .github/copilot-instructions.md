# MERABA Website Development Guidelines

## Project Overview

This is a modern premium B2B website for MERABA, built with Next.js 16.2.6 and Tailwind CSS 3.4.0. The site features a clean, minimal design with dark and white styling inspired by premium industrial and aviation brands.

## Technology Stack

- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4.0
- **Runtime**: Node.js 18+
- **Package Manager**: npm

## Project Structure

```
MERABA NEW/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout with metadata
│   │   ├── page.tsx      # Home page
│   │   ├── globals.css   # Global styles and Tailwind directives
│   │   ├── about/        # About page
│   │   ├── products/     # Products page
│   │   └── contact/      # Contact page
│   └── components/       # Reusable React components
│       ├── Header.tsx    # Navigation header with mobile menu
│       ├── Footer.tsx    # Footer with links and info
│       └── HeroSection.tsx # Reusable hero section
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── next.config.js        # Next.js configuration
└── README.md             # Project documentation
```

## Development Workflow

### Start Development Server
```bash
npm install  # First time only
npm run dev
```
Server runs at http://localhost:3000

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Design System

### Colors
- **Primary**: Black (#000000) and White (#FFFFFF)
- **Neutral**: Gray scale from #F9FAFB to #111827
- **Accent**: Black for CTAs and important elements

### Typography
- **Font Family**: System fonts (system-ui, Segoe UI, Roboto, etc.)
- **Font Weights**: Primarily `font-light` for premium feel
- **Letter Spacing**: `tracking-tight` for headings, `tracking-widest` for labels

### Spacing & Layout
- **Container**: `container-max` utility class (max-w-7xl with padding)
- **Padding**: Responsive (6px mobile, 8px tablet, 12px desktop)
- **Sections**: py-20 (mobile) to py-32 (desktop)

## Key Components

### Header Component
- Responsive navigation with mobile hamburger menu
- Sticky positioning (can be added)
- Links to: Home, About, Products, Contact

### Footer Component
- Company information
- Navigation links organized by category
- Copyright notice with dynamic year
- Dark background (#000000)

### HeroSection Component
- Flexible subtitle, title, description
- Optional CTA button
- Optional background image support
- Centered text layout

## Pages

### Home (`src/app/page.tsx`)
- Hero section
- Core competencies (4 pillars)
- Why Choose MERABA (3 values)
- CTA section

### About (`src/app/about/page.tsx`)
- Hero section
- Company story with stats
- Mission & vision
- Core values (4 items)

### Products (`src/app/products/page.tsx`)
- Hero section
- Product cards (6 products)
- Quality standards section
- Custom solutions section

### Contact (`src/app/contact/page.tsx`)
- Hero section
- Contact form with validation
- Contact information (address, email, phone, hours)
- Benefits section

## Styling Guidelines

### Utility Classes
- **Headings**: `.text-hero`, `.text-display`, `.text-heading`, `.text-subheading`
- **Containers**: `.container-max` for consistent width
- **Transitions**: `.transition-smooth` for smooth color/border changes

### Dark Mode
Currently not implemented but can be added via Tailwind's dark mode configuration.

### Responsive Design
- Mobile-first approach
- Breakpoints: `md` (768px), `lg` (1024px)
- All pages fully responsive

## Important Files to Modify

### Page Content
- Edit markdown/text content in `src/app/*/page.tsx` files
- Update metadata in root `layout.tsx`

### Styling
- Global styles: `src/app/globals.css`
- Component styles: Inline Tailwind classes
- Config: `tailwind.config.js` for design tokens

### Assets
- Place static images in `public/` directory
- Update image paths in components

## Development Best Practices

1. **TypeScript**: Always define props interfaces for components
2. **Naming**: Use PascalCase for components, camelCase for functions
3. **Imports**: Use `@/*` path alias for cleaner imports
4. **Components**: Keep components focused and reusable
5. **Styles**: Prefer Tailwind utilities over custom CSS
6. **Accessibility**: Include proper ARIA labels and semantic HTML

## Deployment

The site is optimized for deployment to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## Performance Checklist

- [ ] Images optimized with Next.js Image component
- [ ] Metadata/SEO configured
- [ ] lighthouse score checked
- [ ] Mobile responsive tested
- [ ] Form submissions configured (currently logs to console)
- [ ] Analytics configured (if needed)

## Common Tasks

### Add a New Page
1. Create folder in `src/app/` (e.g., `src/app/newpage/`)
2. Create `page.tsx` in the folder
3. Add route to Header component navigation

### Add a New Component
1. Create file in `src/components/` with `.tsx` extension
2. Export as default function
3. Define prop types with interface
4. Use Tailwind classes for styling

### Update Contact Form
- Currently logs to console
- To enable email: Install email service (sendgrid, nodemailer, etc.)
- Add API route in `src/app/api/contact/route.ts`

### Add Images
1. Place images in `public/` directory
2. Use Next.js Image component:
```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>
```

## Environment Variables

Create `.env.local` if needed for:
- API endpoints
- Contact form endpoints
- Analytics keys

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### TypeScript errors
```bash
# Restart TypeScript server in your editor
# Or clear .next folder and rebuild
rm -rf .next
npm run build
```

### Tailwind styles not applied
- Ensure content paths in `tailwind.config.js` are correct
- Restart dev server after config changes

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
