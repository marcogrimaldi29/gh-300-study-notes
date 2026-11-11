# Contributing to GH-300 Study Notes

Thanks for helping keep these notes accurate. They cover **Exam GH-300: GitHub Copilot**, and Copilot moves quickly: features leave preview, get renamed or change plans, and the study guide is revised to follow. Reports from people studying with the notes are the best way to catch what has drifted.

> [!IMPORTANT]
> **This repo takes issues, not pull requests.** Pull requests are turned off because I write every change myself and check it against the official documentation, which keeps the notes in one voice and consistent from page to page. If you know exactly how a passage should read, put your proposed wording in the issue. That helps just as much.

---

## Contents

- [Ways to Help](#-ways-to-help)
- [Before You Open an Issue](#-before-you-open-an-issue)
- [Opening an Issue](#-opening-an-issue)
- [Out of Scope](#-out-of-scope)
- [What Happens Next](#-what-happens-next)
- [Code of Conduct](#-code-of-conduct)
- [Security](#-security)

## 🙌 Ways to Help

Every report fits one of the six types in the issue template:

| Type | What it covers | For example |
| --- | --- | --- |
| **Content error** | Text, a table, a callout or a command is wrong | A slash command is described with the wrong behavior, or a content exclusion example uses a path pattern that wouldn't match |
| **Outdated content** | Copilot or its plans have changed since the page was written | A plan's monthly AI credits allowance has changed, or a feature has left preview or been renamed |
| **Exam coverage** | The notes don't match the official study guide | The study guide was revised after August 7, 2026, or it lists a skill the notes don't cover |
| **Site bug** | Search, navigation, the floating buttons, a broken link or accessibility | Search doesn't find a term that's on a page, an **On This Page** link jumps to the wrong section, or a control can't be reached with the keyboard |
| **Device issue** | Something looks wrong or doesn't work on a specific device, browser or screen size | The plans comparison table overflows on a phone in portrait, or the sidebar menu won't close on a tablet |
| **Suggestion** | Something could be clearer or easier to study | A topic that would read better as a comparison table, or a caveat worth adding to **Exam Tips & Caveats** |

## 🔎 Before You Open an Issue

- **Search the existing issues**, both [open and closed](https://github.com/marcogrimaldi29/gh-300-study-notes/issues?q=is%3Aissue). If yours is already there, add a 👍 reaction, or a comment with anything new, instead of opening a duplicate.
- **Check the date.** The notes follow the **skills measured as of August 7, 2026**. If the "Skills measured as of" heading in the [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300) shows a later date, say so in the issue, so I know which revision to compare against. The study guide's **Change log** section lists what moved.
- **Check the current docs.** The [GitHub Copilot documentation](https://docs.github.com/en/copilot) usually confirms whether something has changed, and the [GitHub Changelog](https://github.blog/changelog/label/copilot/) shows when. Either one gives you the source link the issue asks for.
- **Keep to one problem per issue.** Separate issues are easier to track, fix and close. Several typos on the same page can share one.
- **For a site bug, hard-refresh first** (Ctrl+F5, or Cmd+Shift+R on a Mac), in case your browser is showing an older copy of the page.

## 📝 Opening an Issue

1. Open a new issue with the [🐞 Report an Issue](https://github.com/marcogrimaldi29/gh-300-study-notes/issues/new?template=ISSUE_TEMPLATE.md) template.
2. Give it a title that names the page and the problem, such as *"Capabilities & Policies: plans table shows an old AI credits allowance"* rather than *"Wrong info"*.
3. Fill in the template's sections and leave out any that don't apply.

> [!TIP]
> To link to a section, click it in **On This Page** on any notes page, then copy the address from your browser.

### What Makes a Report Easy to Fix

- **A link to the exact section**, not just the page
- **The text as the notes have it**, quoted, so I can find it even after the page has changed
- **An official source** for any content change. The GitHub Docs and the study guide are best, and the GitHub Changelog works for recent changes. A report without a source may take longer, because every change is checked against the documentation before it goes in
- **For bugs and device issues:** the steps to reproduce it, what you expected and what happened instead, the device, operating system and browser, and a screenshot if it shows the problem
- **Your proposed wording**, if you have it. With pull requests turned off, it's the closest thing to suggesting an edit

## 🚫 Out of Scope

To keep the notes accurate and the issue tracker useful, please don't open issues for:

- **Live exam content.** Sharing questions, answers or topics you remember from a real exam breaks [Microsoft's exam and assessment security policies](https://learn.microsoft.com/en-us/credentials/support/exam-and-assessment-lab-security-policies) and the confidentiality terms you accept before the exam. Issues or comments that include it will be closed and the content removed.
- **Exam booking, scores, retakes or your certification.** [Microsoft Credentials support](https://learn.microsoft.com/en-us/credentials/support/help) handles those.
- **Help with your own Copilot setup.** For trouble with your IDE extension, the Copilot CLI, your subscription or the policies in your organization or enterprise, ask in the [GitHub Community Copilot discussions](https://github.com/orgs/community/discussions/categories/copilot-conversations) or contact [GitHub Support](https://support.github.com/).
- **Anything private.** Issues are public, so leave out personal access tokens, keys from MCP server configurations, private repository code and customer details, including in screenshots.
- **Unofficial sources.** Practice-question sites, exam dumps and AI chat answers, Copilot Chat's included, aren't accepted as the source for a content change.
- **Promotion.** Links to courses, products or services, affiliate links and paid placements won't be added.
- **Security vulnerabilities.** Please [report these privately](https://github.com/marcogrimaldi29/gh-300-study-notes/security/advisories/new), as the [security policy](SECURITY.md) describes, not in a public issue.

## 🔄 What Happens Next

- I maintain the notes on my own, in my spare time, so replies are best effort and there's no fixed response time.
- I check each report against the official documentation. If I need more detail, I'll ask on the issue, so keep an eye on your GitHub notifications.
- When a fix goes in, I close the issue with a note on what changed or a link to the commit. The live site updates shortly after.
- If nothing changes, I close the issue with the reason, such as out of scope, can't be verified, or working as intended.
- An issue that's waiting on a reply may be closed after a while. Comment with the missing details and I can reopen it.

## 🤝 Code of Conduct

By opening, commenting on or reacting to issues here, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Comments that are abusive, spam or share live exam content may be hidden, edited or locked.

## 🔒 Security

Found a security problem with the site or this repo? Please don't report it in a public issue. Use [Report a vulnerability](https://github.com/marcogrimaldi29/gh-300-study-notes/security/advisories/new) instead, so only you and I can see it. The [security policy](SECURITY.md) has the details.

---

If the notes helped you, the README's [💚 Support](https://github.com/marcogrimaldi29/gh-300-study-notes#-support) section has a couple of ways to show it. Thanks for helping make them better for the next GH-300 candidate.
