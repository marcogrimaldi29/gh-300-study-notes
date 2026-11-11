# Security Policy

GH-300 Study Notes is a static site of plain HTML, CSS and JavaScript, published to GitHub Pages. It has no accounts, no sign-in and nothing you can submit, and the site itself stores nothing in your browser: no cookies and no saved settings. Search runs entirely in your browser, building its index from the site's own pages the first time you open it. Analytics are cookieless, through [Umami](https://umami.is/). The attack surface is small, but security reports are still welcome, and I'd rather hear about a problem privately before it's public.

---

## 🛡️ Supported Versions

There are no releases. Only what's live is maintained.

| Version | Supported |
| --- | --- |
| The live site at [marcogrimaldi29.com/gh-300-study-notes](https://marcogrimaldi29.com/gh-300-study-notes/) and the `main` branch | ✅ |
| Older commits, forks and copies hosted elsewhere | ❌ |

## 📮 Reporting a Vulnerability

**Please don't open a public issue or comment.** Report it privately through GitHub instead: open the repo's **Security** tab and choose **Report a vulnerability**, or go straight to the [private report form](https://github.com/marcogrimaldi29/gh-300-study-notes/security/advisories/new). Only you and I can see the report, and we can discuss and fix the problem there before anything is made public.

It helps to include:

- The affected URL, or the file in this repo
- What the problem is and what someone could do with it
- The steps to reproduce it, or a short proof of concept

Please leave real secrets, credentials and other people's personal data out of the report, and don't test against anything that isn't yours.

If you can't use GitHub, send me a private message on [LinkedIn](https://www.linkedin.com/in/marco-grimaldi29/) instead, starting it with **"Security: GH-300 Study Notes"** so it's easy to spot.

## 🎯 Scope

**In scope:**

- The published site, including its pages, scripts and assets
- This repository's source code and its GitHub Actions workflow
- A known-vulnerable version of something the site or the workflow depends on, such as one of the actions the deploy workflow runs

**Out of scope:**

- **GitHub Copilot, GitHub.com or any other GitHub product.** Report these through the [GitHub Security Bug Bounty](https://bounty.github.com/). Problems with Microsoft Learn or another Microsoft service go to the [Microsoft Security Response Center](https://msrc.microsoft.com/create-report).
- **A vulnerability in Umami or in one of the GitHub Actions itself.** Report it to that project. If this repo uses an affected version, let me know as well.
- **HTTP response headers set by GitHub Pages.** The repo can't change them.
- **Automated scanner output** with no demonstrated impact on this site.
- **An insecure pattern in the notes**, such as a content exclusion example that leaves a secrets file readable by Copilot. That's a content issue, so it's welcome as a public issue. See the [contributing guide](CONTRIBUTING.md).

## ⏱️ What to Expect

I maintain this repo on my own, so responses are best effort. I'll confirm I've received your report, keep you posted in the private report while I look into it, and let you know when it's fixed. If you'd like credit, say so and I'll credit you in the security advisory or the fix.

Dependabot is turned on for this repo, so known vulnerabilities in the GitHub Actions that the deploy workflow uses are usually picked up without a report.
