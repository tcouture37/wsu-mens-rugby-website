# Rugby Team Website

This repository contains the source code for the Winona State Men's Rugby team website. The site is hosted on AWS S3/Cloudfront and deployed automatically using GitHub Actions.

## 📋 Project Overview

- **Static Website**: HTML, CSS, and JavaScript
- **Hosting**: AWS S3 Static Website Hosting w/ Cloudfront CDN
- **CI/CD**: GitHub Actions for automated deployment
- **Collaboration**: Pull Request workflow for team contributions

## 🚀 Getting Started

### Prerequisites

- [Git](https://git-scm.com/downloads)
- GitHub Account (for repository access)
- AWS Account (Optional, for AWS debugging and I don't wanna give you access and rack up a bill)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/tcouture37/wsu-mens-rugby-website.git
   cd wsu-mens-rugby-website
   ```

2. Open the project in your favorite code editor.

3. For local testing, you can use any static file server:
   ```bash
   # If you have Python installed:
   python -m http.server 8000
   
   # If you have Node.js installed:
   npx serve
   ```

4. Visit `http://localhost:8000` in your browser.

## 📂 Project Structure

```
rugby-team-website/
├── index.html          # Homepage
├── team.html           # Team members page (not implemented)
├── fixtures.html       # Upcoming matches (not implemented)
├── results.html        # Past match results (not implemented)
├── gallery.html        # Photo gallery (not implemented)
├── contact.html        # Contact form (not implemented)
├── donate.html         # Donation page (not implemented)
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── main.js         # JavaScript functionality
└── images/             # Website images
```

## 🔄 Workflow

### Making Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b your-fun-feature-branch-name
   ```

2. Make your changes to the website files.

3. Test your changes locally.

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Add description of your changes"
   ```

4. Push your branch to GitHub:
   ```bash
   git push origin your-fun-feature-branch-name
   ```

5. Create a Pull Request on GitHub.

6. After review and approval, merge your changes to the main branch.

### Deployment

- The website is automatically deployed when changes are pushed to the main branch.

## 🔧 AWS Infrastructure

The website is hosted using the following services:

- **AWS S3**: Primary storage for website files and hosting
- **AWS CloudFront**: CDN for cheaper/faster distribution
- **AWS Route 53 (not implemented)**: DNS management for domain
- **NameCheap (not implemented)**: Registrar for domain

## 📞 Contact

For questions or access requests, please contact the website administrator at [tcouture37@gmail.com].