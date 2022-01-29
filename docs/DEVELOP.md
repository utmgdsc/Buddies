## Development

### Environment Dependencies

- Visual Studio 2022
    - ASP.NET & Web Development Workload
- Node.js 14+
    - Yarn: `npm install -g yarn`
- PostgreSQL 14
    - You can choose to host it on your OS or through Docker (a `docker-compose.yml`
    has been provided for convenience).
- JRE 8+
    - For [OpenAPI Generator](https://openapi-generator.tech/).

### IDE

We recommend using **Visual Studio 2022** for the backend and **VS Code** for the frontend but any IDE that supports C#, TypeScript, and ESLint should work just fine.

### Getting Started

1. Run `dotnet tool restore` to install any necessary CLI tools.
2. Open `Buddies.sln` using Visual Studio.
3. Use Debug > Start Debugging or Debug > Start Without Debugging to start the backend.
4. Open the `Buddies.Web` folder using VS Code.
5. Run `yarn dev` in the integrated terminal to start the frontend.


### Migrations

Whenever you have introduced a new entity or modified an existing entity in the backend,
you will need to create a migration according to the [EF Core documentation](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/managing?tabs=dotnet-core-cli).
To keep the number of migrations in the repository manageable, it is recommended to merge
WIP migrations together after completing a feature or bug fix.


### Type Generation

Whenever you have added a new request type or modified an existing request type in the backend
and have documented it correctly (e.g. the type shows up on the OpenAPI page), you should update 
the frontend types by running `yarn gen-types` in `Buddies.Web`.

### Git Flow

1. Determine the issue ticket you are working on, if applicable.
2. Create a branch from `develop` with a name related to its purpose, e.g. `feat/user-profile`.
3. Implement the necessary functionality in the newly created branch.
4. Test the changes (using automated tests, manually, etc).
5. Create a PR from the newly created branch to `develop` and work towards getting it merged.
    - A PR can be merged when CI passes and is approved by the mentor and a group member.
6. At the end of a phase, a group member will merge `develop` into `main`, signifying a "release".
