# Professional Portfolio Website

A modern, elegant, and SEO-friendly portfolio website built with React, Tailwind CSS, and best practices for web development.

## Features

### Design & Aesthetics
- **Dark Theme with Gold Accents**: Professional, elegant color scheme with oklch color system
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Smooth Animations**: Custom animations (fadeInUp, slideInLeft, slideInRight, pulse-glow, shimmer)
- **Glass Morphism Effects**: Modern UI with glass morphism and gradient backgrounds
- **Typography**: Playfair Display for headings, Inter for body text

### Pages
1. **Home** (`/`)
   - Hero section with compelling headline
   - Features showcase (Clean Code, High Performance, Beautiful Design)
   - Featured projects grid
   - Call-to-action sections

2. **About** (`/about`)
   - Personal biography
   - Professional experience timeline
   - Skills grid organized by category
   - Core values section
   - Statistics showcase

3. **Portfolio** (`/portfolio`)
   - Filterable project grid (All, Web, Mobile, Full-Stack)
   - Project cards with images, descriptions, and tags
   - Links to live demos and GitHub repositories
   - Hover effects and image overlays

4. **Contact** (`/contact`)
   - Contact form with validation
   - Contact information (email, phone, location)
   - Social media links
   - FAQ section with collapsible items

### SEO Features
- **Meta Tags**: Comprehensive meta tags for all pages
- **Open Graph Tags**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific meta tags
- **Sitemap**: XML sitemap for search engines (`/sitemap.xml`)
- **Robots.txt**: Search engine crawling rules (`/robots.txt`)
- **Canonical URLs**: Proper canonical URL handling
- **SEO Component**: Reusable SEOHead component for page-specific metadata

### Performance
- **Fast Load Times**: Optimized images and lazy loading
- **Code Splitting**: Route-based code splitting with Wouter
- **CSS Optimization**: Tailwind CSS with PurgeCSS
- **Minimal Dependencies**: Lightweight and maintainable codebase

## Project Structure

```
client/
├── public/
│   ├── robots.txt          # Search engine crawling rules
│   └── sitemap.xml         # XML sitemap for SEO
├── src/
│   ├── components/
│   │   ├── Layout.tsx      # Main layout with header and footer
│   │   ├── SEOHead.tsx     # SEO meta tag management
│   │   ├── Hero.tsx        # Reusable hero section
│   │   ├── Section.tsx     # Reusable section wrapper
│   │   ├── Card.tsx        # Reusable card component
│   │   └── ui/             # shadcn/ui components
│   ├── pages/
│   │   ├── Home.tsx        # Home page
│   │   ├── About.tsx       # About page
│   │   ├── Portfolio.tsx   # Portfolio page
│   │   ├── Contact.tsx     # Contact page
│   │   └── NotFound.tsx    # 404 page
│   ├── lib/
│   │   └── seo.ts          # SEO utilities and metadata
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles and animations
├── index.html              # HTML template with SEO meta tags
└── tailwind.config.ts      # Tailwind CSS configuration
```

## Customization Guide

### 1. Update Personal Information

Edit `/client/src/lib/seo.ts`:
```typescript
export const siteConfig = {
  name: "Your Name",
  description: "Your professional description",
  url: "https://yourdomain.com",
  twitter: "@yourhandle",
  author: "Your Name",
};
```

### 2. Update Contact Information

Edit `/client/src/pages/Contact.tsx`:
- Update email address in `contactInfo` array
- Update phone number
- Update location
- Update social media links

### 3. Customize Colors

Edit `/client/src/index.css`:
- Primary color: `oklch(0.75 0.15 60)` (gold)
- Background: `oklch(0.12 0 0)` (dark)
- Foreground: `oklch(0.98 0 0)` (light)

### 4. Update Projects

Edit `/client/src/pages/Portfolio.tsx`:
- Add/remove projects from the `projects` array
- Update project images, descriptions, and links
- Modify categories as needed

### 5. Update Experience

Edit `/client/src/pages/About.tsx`:
- Update experience timeline in `experience` array
- Update skills in `skills` array
- Modify statistics in `stats` array

### 6. Update Navigation Links

Edit `/client/src/components/Layout.tsx`:
- Modify `navLinks` array to change navigation items
- Update footer links and social media URLs

## SEO Best Practices

1. **Page Titles**: Each page has a unique, descriptive title
2. **Meta Descriptions**: Compelling descriptions for all pages
3. **Keywords**: Relevant keywords for each page
4. **Open Graph**: Social media sharing with images and descriptions
5. **Canonical URLs**: Proper canonical URL handling
6. **Mobile Friendly**: Fully responsive design
7. **Fast Loading**: Optimized images and code splitting
8. **Structured Data**: Ready for schema.org integration

## Performance Optimization

- **Image Optimization**: Use optimized image formats (WebP, AVIF)
- **Lazy Loading**: Images load on demand
- **CSS Optimization**: Tailwind CSS with PurgeCSS removes unused styles
- **Code Splitting**: Routes are code-split for faster initial load
- **Caching**: Static assets are cached aggressively

## Deployment

The site is ready to deploy to any static hosting platform:

- **Vercel**: Recommended for Next.js-like projects
- **Netlify**: Great for static sites
- **GitHub Pages**: Free hosting for static sites
- **AWS S3 + CloudFront**: Scalable solution

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **React 19**: UI library
- **Tailwind CSS 4**: Utility-first CSS framework
- **Wouter**: Lightweight routing library
- **Lucide Icons**: Beautiful icon library
- **shadcn/ui**: High-quality UI components
- **TypeScript**: Type-safe development

## Development

### Install Dependencies
```bash
pnpm install
```

### Start Development Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please refer to the documentation or create an issue in the repository.

