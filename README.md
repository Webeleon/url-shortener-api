# Url shortener api

## Installation

prerequisite:
- node lts (16.x or 18.x) with nvm it will be setted automatically
- MongoDb

Install dependencies:
```bash
npm ci
```

Configure the .env file
- copy `.env.template` to `.env`
- update the value of `MONGO_URI` 

Start in developpement with auto-restart
```bash
npm run start:dev
```

Start in production mode
```bash
npm run start:production
```

## Testing

Unit and integration tests will run at the same time.
All database accesses use an in memory mongodb.
```bash
npm test
```

## Architecture Decision Records

### Styling
- The code base is style using prettier. 
- A pre-commit hook will apply the styling on every commit.

### Commits
- Commit messages must follow the conventional commits standard. 
- Verified using a commit-msg hook
- Automatic change logs can be generated `npm run release`

### Data validation
- Validation uses class-validator and can be verified using the `validationGuard` found in the `src/core/validation` folder.

### Dependencies injection
- Dependencies should be injected, the main configuration is done in `src/app.ts`. 
- In the future, injection should implement a correct DI container. 
- I'd recommend using `reflect-metadata` to build that logic.
- Or using a framework like NestJs, it's just a wrapper around express offering a very performant DI system and a lot of other utilities

### Database
- Mongodb is used to allow easy extension on the models and at the moment no strict relations between entities must be guaranteed. 
- If this constraints comes around I'd recommend typeorm. 
- Typeorm would allow a setup with mongodb and then switch to a relational database.

### Configurations
- Configuration use dotenv in development
- Configuration use en variable for production
- If a vault is needed, it can be setted up inside the configuration classes

### Folder architecture
- Tests are not stored in the `src` folder to reduce the production artifact
- `src/config` should hold configuration logic
- `src/core` should contain only purely technical functions/classes used in the business logic modules/folder
- `src/:module-name` should follow a Domain Driven architecture to enhance logic readability
- `main.ts` is used to start the express server and inject configuration
- `app.ts` is used to configure the express app, controller and services injection are done here (for the moment)

### Tests
- unit tests are used for TDD mainly
- coverage in gained using integration tests
- both test are ran using an in memory mongodb
- `npm test` should run both tests suites

### Logging
- uses `console` for the basic version
- A proper logger need to be added. 
- It should at least offer a configuration to excludes log by level of criticity by environnement and the possibility to send logs to a external logging services that allow structured logs. 

### Swagger
- not implemented at the moment
- Should be setted up
