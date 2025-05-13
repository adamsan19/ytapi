# CineTube - Cinematic Video Streaming App

A modern, responsive video streaming application with a cinematic UI theme featuring a black background with elegant deep red accents. Built with Next.js, TypeScript, and Tailwind CSS.

![CineTube Screenshot](https://i.imgur.com/example.png)

## Features

- 🎬 Cinematic UI with elegant dark theme
- 📱 Fully responsive design for all devices
- 🔍 Search functionality for finding videos
- 🎞️ Video player with related videos
- 🌙 Dark mode support
- 🎭 Material Design components
- 🚀 Fast loading with optimized assets

## Prerequisites

Before deploying this application, ensure you have:

- Node.js 18.x or later
- npm or yarn package manager
- A GitHub account (for GitHub Pages) or Vercel account (for Vercel deployment)
- Basic knowledge of Git and command line operations

## Deployment Options

### Option 1: Deploy to GitHub Pages

1. **Create a GitHub repository**

   Create a new repository on GitHub to host your project.

2. **Prepare your project for GitHub Pages**

   Add the following to your `next.config.js` file:

   \`\`\`js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     basePath: '/your-repo-name', // Replace with your repository name
     assetPrefix: '/your-repo-name/', // Replace with your repository name
   };
   
   module.exports = nextConfig;
   \`\`\`

3. **Create a deployment script**

   Add a deployment script to your `package.json`:

   \`\`\`json
   "scripts": {
     "deploy": "next build && next export && touch out/.nojekyll && gh-pages -d out"
   }
   \`\`\`

4. **Install gh-pages package**

   \`\`\`bash
   npm install --save-dev gh-pages
   \`\`\`

5. **Build and deploy**

   \`\`\`bash
   npm run deploy
   \`\`\`

6. **Configure GitHub Pages**

   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Select the `gh-pages` branch as the source
   - Save the changes

7. **Access your deployed site**

   Your site will be available at `https://yourusername.github.io/your-repo-name/`

### Option 2: Deploy to Vercel (Recommended)

1. **Create a Vercel account**

   Sign up at [vercel.com](https://vercel.com) if you don't have an account.

2. **Install Vercel CLI (Optional)**

   \`\`\`bash
   npm install -g vercel
   \`\`\`

3. **Deploy directly from the dashboard**

   - Push your code to GitHub, GitLab, or Bitbucket
   - Import your repository in the Vercel dashboard
   - Configure your project settings
   - Deploy

   OR

4. **Deploy using Vercel CLI**

   \`\`\`bash
   # Login to Vercel
   vercel login

   # Deploy from your project directory
   cd youtubeapp
   vercel
   \`\`\`

5. **Configure environment variables (if needed)**

   - Go to your project in the Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add any required environment variables

6. **Access your deployed site**

   Vercel will provide you with a URL for your deployed application.

### Option 3: Deploy to Netlify

1. **Create a Netlify account**

   Sign up at [netlify.com](https://netlify.com) if you don't have an account.

2. **Prepare your project for Netlify**

   Create a `netlify.toml` file in your project root:

   ```toml
   [build]
     command = "npm run build"
     publish = "out"
   \`\`\`

3. **Deploy from the Netlify dashboard**

   - Push your code to GitHub, GitLab, or Bitbucket
   - Import your repository in the Netlify dashboard
   - Configure your build settings
   - Deploy

4. **Access your deployed site**

   Netlify will provide you with a URL for your deployed application.

## Required Environment Variables

For the application to function properly, you may need to set up the following environment variables:

\`\`\`
NEXT_PUBLIC_API_URL=https://your-api-url.com
\`\`\`

## API Configuration

The application uses the following API endpoints:

- `/api/list` - Get a list of videos
- `/api/search` - Search for videos
- `/api/info` - Get video details
- `/api/related` - Get related videos

Ensure these endpoints are properly configured in your deployment environment.

## Customization

### Changing the Theme Colors

To modify the theme colors, edit the CSS variables in `app/globals.css`:

\`\`\`css
:root {
  --md-primary: 0, 80%, 40%; /* Deep red */
  --md-secondary: 0, 70%, 35%; /* Darker red */
  /* Other variables */
}
\`\`\`

### Adding New Features

The application is built with a modular structure, making it easy to add new features:

1. Create new components in the `components` directory
2. Add new pages in the `app` directory
3. Extend API functionality in the `app/api` directory

## Troubleshooting

### Common Deployment Issues

1. **Images not loading**

   Ensure you've configured `next.config.js` correctly for your deployment platform.

2. **API endpoints not working**

   Check that your API routes are properly configured and accessible from your deployed site.

3. **CSS not applying correctly**

   Verify that your Tailwind configuration is correct and that the build process is generating the CSS properly.

4. **404 errors on page refresh**

   For GitHub Pages and some other static hosts, you may need to add a custom 404.html file or configure redirects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- Vercel for the hosting platform

---

Made with ❤️ by [Your Name]
