# Buddies

Finding reliable group members to work on a project you’re passionate about isn’t always easy. This doesn’t only apply to people in online university, other project building enthusiasts who didn’t have the funds to go university have even less connections to people in their field, so finding reliable people with similar interests becomes even harder. 

The aim of this project is to provide an app that serves as a funneling station for people to come and look for group partners.

### Features
- Customizable user profiles
  - Skills/interests/experience
  - Buddy score (reliability metric)
- Create and post projects
- Browse and join existing projects
- Manage projects
  - Accept/Kick members
  - Set goals/tasks
- Recommendation system to recommend buddies
- Leaderboard showing the names and buddy scores of the leading users

## Development

### Environment Dependencies

- Visual Studio 2022
  - ASP.NET & Web Development Workload
- Node.js 14+
  - Yarn: `npm install -g yarn`
- PostgreSQL 14
  - You can choose to host it on your OS or through Docker.

### IDE

We recommend using **Visual Studio 2022** for the backend and **VS Code** for the frontend but any IDE that supports C#, TypeScript, and ESLint should work just fine.

### Getting Started

1. Open `Buddies.sln` using Visual Studio.
2. Use Debug > Start Debugging or Debug > Start Without Debugging to start the backend.
3. Open the `Buddies.Web` folder using VS Code.
4. Run `yarn dev` in the integrated terminal to start the frontend.

### Git Flow

1. Determine the issue ticket you are working on, if applicable.
2. Create a branch from `develop` with a name related to its purpose, e.g. `feat/user-profile`.
3. Implement the necessary functionality in the newly created branch.
4. Test the changes (using automated tests, manually, etc).
5. Create a PR from the newly created branch to `develop` and work towards getting it merged.
   - A PR can be merged when CI passes and is approved by the mentor and a group member.
6. At the end of a phase, a group member will merge `develop` into `main`, signifying a "release".

## Deployment

DEPLOYMENT INSTRUCTIONS HERE

