# Rugby Team Website

This repository contains the source code for our rugby team's website. The site is hosted on AWS S3 and deployed automatically using GitHub Actions.

## 📋 Project Overview

- **Static Website**: HTML, CSS, and JavaScript
- **Hosting**: AWS S3 Static Website Hosting
- **CI/CD**: GitHub Actions for automated deployment
- **Collaboration**: Pull Request workflow for team contributions

## 🚀 Getting Started

### Prerequisites

- [Git](https://git-scm.com/downloads)
- AWS Account (for S3 hosting)
- GitHub Account (for repository access)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rugby-team-website.git
   cd rugby-team-website
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
├── team.html           # Team members page
├── fixtures.html       # Upcoming matches
├── results.html        # Past match results
├── gallery.html        # Photo gallery
├── contact.html        # Contact form
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
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the website files.

3. Commit your changes:
   ```bash
   git add .
   git commit -m "Add description of your changes"
   ```

4. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request on GitHub.

6. After review and approval, merge your changes to the main branch.

### Deployment

- The website is automatically deployed when changes are pushed to the main branch.
- Pull Requests generate preview environments where you can check your changes before merging.

## 🔧 AWS Infrastructure

The website is hosted using the following AWS services:

- **S3 Bucket**: Primary storage for website files
- **S3 Static Website Hosting**: Serves the website
- **CloudFront (optional)**: CDN for global distribution
- **Route 53 (optional)**: DNS management for custom domain

## 📝 Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or access requests, please contact the website administrator at [your-email@example.com].