# How to Contribute
## Workflow
Thank you for your interest in this project!
- You must take responsibility for your changes. See [AI_POLICY](AI_POLICY.md).
- Limit pull requests to one change at a time.
- %%Insert explanation of branches. Something explaining the use of main, app-build-branch, PWA-do-not-delete-do-not-merge branches.%%
- Use feature branches for changes. We recommend working on an issue by creating a branch for that issue and linking them in GitHub. Do not make changes on the main branch.
- All pull requests (PRs) require review by at least one contributor with write access. The review process will involve some back and forth discussion of the changes.
- Accepted PRs are usually closed by squashing and merging changes, then deleting the branch. Branches will need to be rebased or merged with main before a PR can be accepted. 
- External contributors: to contribute to this project, create a fork, make your changes, and open a pull request to our  repository.
### Testing
- Always test code locally in a device emulator.
- Make sure all code is consistent with existing formatting standards. Use linting and auditing tools.
#### Local Development Environment
- See [README-EXTENDED](README-EXTENDED.md)
#### Linting and Security
- Run the following command to test code formatting. `npm run lint` 
- Run the following command to test code for known vulnerabilities. `npm audit --audit-level=critical`
### Documentation
- Document changes with useful commit messages.
- Document PRs with a what, why, and how. That means a complete description of the change, the reason for the change, and how the change was implemented. We appreciated if your PR comments are written in markdown format.
- See [AI_POLICY](AI_POLICY.md) for details about how to disclose AI use in your documentation.
## Governance
- The Pace Environmental Observatory (Pace Observatory App repo) is maintained by the Blue Colab team under the umbrella of the Gale Epstein Center for Technology, Policy, and the Environment at Pace University's Seidenberg School of Computer Science and Information Systems. 
- Contributions are welcome from anyone! Pull Requests will be reviewed by a member of the team. Not all pull requests will be accepted.
- Abide by the contributors Code of Conduct %%to be added%%
- The Blue Colab team has final say over design decisions.