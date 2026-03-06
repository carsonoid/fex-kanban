# fex-kanban backend

## Running

```bash
docker-compose up -d
pnpm run start
```

## Disclaimer

I did not use any bootstrap tools or scripts to create this project. Every file in here was made manually so I could learn what each one did. If anything in the project seems out of the norm or doesn't conform to express.js, ts, or other standards it's simply because I'm not aware of the standards.

## Database

### Create a new migration

> I'm counting this as making the migration "by hand" since it just creates boilerplate

```sh
pnpm run migrate create MIGRATE_NAME
```

### Run Migrations

```sh
DATABASE_URL=postgres://postgres:postgres@localhost:54645/postgres pnpm run migrate up
```

### Drop And Run

You can completely recreate and bootstrap an empty database with the one-liner below

```sh
docker-compose down -v; docker-compose up -d; sleep 3; DATABASE_URL=postgres://postgres:postgres@localhost:54645/postgres pnpm run migrate up
```

## Automated Testing

The backend has comprehensive `jest`-based integration tests. Make sure a database is set up as describe above and run:

```sh
pnpm run test
```

## Manual Testing

The `notebooks` subdirectory contains `.http` files that work with `httpyak` and/or the [httoBook](https://marketplace.visualstudio.com/items?itemName=anweber.httpbook) plugin in vscode
