# Deployment Guide

This portfolio website is a static site that can be deployed to any modern hosting platform. Follow the instructions below for your preferred platform.

## Build the Project

Before deploying, build the project for production:

```bash
pnpm build
```

This will create a `dist/public` directory with all static files ready for deployment.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the best choice for this project as it provides excellent performance and seamless integration.

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Connect Your Repository**
   - Click "New Project"
   - Select your repository
   - Vercel will auto-detect the project configuration

3. **Configure Build Settings**
   - Build Command: `pnpm build`
   - Output Directory: `dist/public`
   - Install Command: `pnpm install`

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at a Vercel URL
   - Connect a custom domain if desired

### Option 2: Netlify

Netlify offers excellent static site hosting with great performance.

1. **Create a Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Connect Your Repository**
   - Click "New site from Git"
   - Select your repository

3. **Configure Build Settings**
   - Build Command: `pnpm build`
   - Publish Directory: `dist/public`

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live at a Netlify URL
   - Connect a custom domain if desired

### Option 3: GitHub Pages

GitHub Pages provides free hosting directly from your repository.

1. **Build the Project**
   ```bash
   pnpm build
   ```

2. **Create a `gh-pages` Branch**
   ```bash
   git checkout -b gh-pages
   git add dist/public
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **Configure GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages"
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch and `/root` folder

4. **Access Your Site**
   - Your site will be available at `https://username.github.io/repository-name`

### Option 4: AWS S3 + CloudFront

For a scalable, production-grade solution:

1. **Create S3 Bucket**
   - Create a bucket for your domain name
   - Enable static website hosting
   - Upload files from `dist/public`

2. **Set Up CloudFront**
   - Create a CloudFront distribution
   - Point to your S3 bucket
   - Configure custom domain

3. **Deploy**
   - Upload files to S3
   - CloudFront will cache and serve them globally

### Option 5: Traditional Web Hosting

For traditional web hosts (cPanel, etc.):

1. **Build the Project**
   ```bash
   pnpm build
   ```

2. **Upload Files**
   - Connect via FTP/SFTP
   - Upload all files from `dist/public` to your public_html directory

3. **Configure Domain**
   - Point your domain to your hosting provider's nameservers
   - Configure DNS records as needed

## Custom Domain Setup

### For Vercel/Netlify:
1. Go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### For GitHub Pages:
1. Add a `CNAME` file to your repository with your domain name
2. Configure DNS records to point to GitHub Pages

### For AWS:
1. Create a Route 53 hosted zone
2. Configure DNS records
3. Update domain registrar nameservers

## Environment Variables

This project doesn't require environment variables for deployment, but if you add features that do, create a `.env.production` file:

```env
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=your-analytics-id
```

## Performance Optimization

### Image Optimization
- Use modern formats (WebP, AVIF)
- Optimize image sizes
- Consider using a CDN for images

### Caching Strategy
- Set long cache expiration for static assets
- Use cache busting for updated files
- Configure proper cache headers

### Monitoring
- Set up analytics (Google Analytics, Umami)
- Monitor Core Web Vitals
- Track user behavior

## SEO Checklist

Before deploying, ensure:

- [ ] Update `siteConfig` in `/client/src/lib/seo.ts` with your domain
- [ ] Update meta tags in `/client/index.html`
- [ ] Update `sitemap.xml` with your domain
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Configure robots.txt correctly
- [ ] Test with Google Mobile-Friendly Test
- [ ] Set up Google Analytics
- [ ] Configure Google Search Console

## Post-Deployment

### Monitor Performance
- Check Core Web Vitals
- Monitor page load times
- Track user engagement

### Update Content
- Keep portfolio projects updated
- Update experience and skills regularly
- Refresh blog posts or articles

### Security
- Enable HTTPS (all platforms do this automatically)
- Keep dependencies updated
- Monitor for security vulnerabilities

## Troubleshooting

### Build Fails
- Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
- Check Node.js version compatibility
- Review build logs for specific errors

### Site Not Loading
- Verify build output directory is correct
- Check DNS configuration
- Clear browser cache
- Test with incognito mode

### Performance Issues
- Optimize images
- Enable gzip compression
- Use CDN for static assets
- Check for large dependencies

## Support

For deployment-specific issues, refer to your hosting provider's documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [AWS Documentation](https://docs.aws.amazon.com)

