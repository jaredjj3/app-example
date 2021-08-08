# app-example

The purpose of this repository is to test the understanding of the MikroORM library. This is also intended
to be a template for making example repositories for MikroORM bug issues.

## Prerequisites

In order to run the tests in this project, you must have:

- [docker](https://docs.docker.com/get-docker/)
- [docker-compose](https://docs.docker.com/compose/install/)
- [yarn](https://classic.yarnpkg.com/en/docs/install/)

## Running Tests

Jest will run any tests in `src/**/*.test.ts` in a Docker container. To run the tests, simply run:

```
yarn start
```

Jest will detect any file change events in the src directory, and rerun the tests if idle.

To quit out of the tests, you can press `q` (as the Jest prompt suggests) or by pressing `Ctrl+C`.

## Debugging

If you just want to run `bash` inside of the test container, just run:

```
yarn debug
```

Inside the container, you will have access to the MikrORM CLI via `yarn mikro-orm`.

## Schema

[Main migration file](src/migrations/Migration20210808014510.ts)

This example uses a classic relational example that encompasses all types of relationships. There are 4 entities:

- `User`
- `Post`
- `PostTag`
- `Tag`

The relationships between the entities are:

- A `user` has many `posts`
- A `post` belongs to an `author` (`User`)
- A `post` has many `postTags`
- A `post` has many `tags` through `postTags`
- A `postTag` belongs to a `post`
- A `postTag` belongs to a `tag`
- A `tag` has many `postTags`
- A `tag` has many `posts` through `postTags`

It is encouraged to leverage these already-existing relationships instead of trying to replicate your schema directly.
