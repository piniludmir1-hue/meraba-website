# MERABA - Premium B2B Website

A modern, premium B2B website for MERABA, an international sourcing and supply company specializing in airline serving ware, catering products, CPET trays, food packaging solutions, and custom manufacturing.

## Features

- **Modern Design**: Clean, minimal aesthetic inspired by Apple and premium industrial brands
- **Dark & White Styling**: Professional color scheme with strong typography
- **Responsive Design**: Fully responsive across all devices
- **TypeScript**: Fully typed for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Next.js 14**: Latest React framework with App Router

## Pages

- **Home**: Hero section with company overview, core competencies, and values
- **About**: Company story, mission, vision, and team values
- **Products**: Complete product catalog with specifications and custom solutions
- **Contact**: Contact form, business information, and support details

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── about/
│   │   └── page.tsx        # About page
│   ├── products/
│   │   └── page.tsx        # Products page
│   └── contact/
│       └── page.tsx        # Contact page
└── components/
    ├── Header.tsx          # Navigation header
    ├── Footer.tsx          # Footer with links
    └── HeroSection.tsx     # Reusable hero component
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 16.2.6** - React framework
- **React 19** - UI library
- **TypeScript 5.3** - Static typing
- **Tailwind CSS 3.4** - Utility-first CSS
- **PostCSS** - CSS processor
- **ESLint** - Code linting

## Customization

### Colors
Update the color palette in `tailwind.config.js`:
```js
colors: {
  black: '#000000',
  white: '#FFFFFF',
  // Add more colors as needed
}
```

### Typography
Font configuration is in `tailwind.config.js` under the `theme.extend.fontSize` section.

### Content
Edit page content in the respective `page.tsx` files in the `src/app` directory.

## Performance

- Optimized images (use Next.js Image component)
- Code splitting and lazy loading
- Static generation where possible
- SEO optimized with metadata

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

All rights reserved. MERABA © 2024

## Contact

For inquiries about the website or MERABA services:
- Email: info@meraba.com
- Phone: +1 (555) 000-0000
