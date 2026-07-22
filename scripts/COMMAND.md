# COMMANDS.md

## Purpose

This file defines custom commands for AI assistants working on the **3D-COFFEE** project.

Whenever one of these commands is mentioned in a prompt, follow the corresponding instructions before writing code.

---

# Project Rules

Always:

* Read `AI_CONTEXT.md` before making changes.
* Preserve existing functionality.
* Write clean, production-ready code.
* Explain major architectural decisions.
* Prefer reusable components.
* Keep performance in mind.
* Never delete code unless requested.

Never:

* Rename folders without asking.
* Break the current UI.
* Add unnecessary dependencies.
* Hardcode secrets or API keys.

---

# Commands

## @status

Show:

* Current project progress
* Completed features
* Features in progress
* Next recommended task
* Any blockers

---

## @next

Continue development from the last completed feature.

If multiple tasks exist, choose the highest priority.

---

## @plan

Before writing any code:

* Explain the feature.
* Break it into small implementation steps.
* Mention affected files.
* Mention possible risks.

Only after the plan is approved, generate the code.

---

## @build

Generate complete production-ready code.

Requirements:

* Clean architecture
* Responsive design
* Error handling
* Comments only where necessary

---

## @review

Review the current codebase.

Check for:

* Bugs
* Bad practices
* Duplicate code
* Security issues
* Performance problems
* Accessibility issues

Finish with a score out of 10.

---

## @refactor

Improve the existing code without changing functionality.

Focus on:

* Readability
* Reusability
* Maintainability
* Folder structure

---

## @optimize

Improve:

* Loading speed
* Bundle size
* Rendering performance
* Image optimization
* Lazy loading
* Animation smoothness

Do not change the UI.

---

## @fix

Find and fix:

* Build errors
* Runtime errors
* Console warnings
* TypeScript errors
* Broken imports

Explain the root cause.

---

## @design

Improve the UI.

Goals:

* Premium appearance
* Modern animations
* Better spacing
* Better typography
* Consistent colors
* Mobile responsiveness

Do not change functionality.

---

## @coffee

Review whether the website matches the premium coffee brand identity.

Evaluate:

* Luxury feel
* Warm color palette
* Typography
* Product presentation
* Storytelling
* Visual hierarchy

Suggest improvements.

---

## @docs

Generate or update documentation.

Include:

* Folder structure
* Installation
* Features
* Environment variables
* Deployment
* Troubleshooting

---

## @ship

Prepare the project for production.

Checklist:

* Build passes
* Remove debug code
* Optimize assets
* Check SEO
* Verify responsiveness
* Verify accessibility
* Create deployment checklist

---

## @git

Suggest a Git workflow.

Include:

* Commit message
* Branch name
* Pull request title
* Pull request description

---

## @brainstorm

Suggest three ideas to improve the project.

Ideas should be:

* Useful
* Realistic
* Low maintenance
* High user impact

---

# Response Style

Unless requested otherwise:

1. Explain the approach.
2. Mention affected files.
3. Generate the code.
4. Explain how to test it.
5. Suggest the next logical improvement.

---

# Priority Order

Security > Correctness > Performance > User Experience > Visual Design > New Features
