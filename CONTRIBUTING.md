# Contributing

Contributions are **welcome** and will be fully **credited**.

We accept contributions via Pull Requests on
[GitHub](https://github.com/foscia-dev/foscia).

Informal discussion regarding bugs, new features, and implementation of existing
features takes place in the
[GitHub issue page](https://github.com/foscia-dev/foscia/issues).

## Pull Requests

- **Lint your code.** Make sure your code follows our coding standards by
  running `make lint` on the CLI.

- **Add tests!** Your patch won't be accepted if it does not have tests.
  Run tests using `make test`.

- **Document any change in behaviour.** Make sure the `README.md` and any other
  relevant documentation are kept up-to-date
  (see the `website` directory).

- **Create feature branches.** Don't ask us to pull from your master branch.

- **One pull request per feature.** If you want to do more than one thing, send
  multiple pull requests.

- **Send coherent history.** Make sure each individual commit in your pull
  request is meaningful. We try to follow the
  [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

**Happy coding**!

## Package development

### Useful commands

> Notice that we use [Docker](https://docker.com/) to work on the package.

After cloning the repository, you can use the `Makefile` to quickly get started.

```shell
# List all available rules.
make help
# Start working on the project.
make docker-build
```

Once the docker containers are fully running, you can use all Makefile rules
(such as `make build`, `make test`, `make test-watch`).

You can also visit docs website to preview changes at
[foscia.localhost](http://foscia.localhost).

### Adding a new package

This repository contains multiple individual package release under
the `@foscia/` namespace.

To add a new package, you must add a new corresponding repository
inside the `packages` folder.

You must also define multiple files
(like inside [`packages/core`](packages/core)):

- `src/index.ts`: contains all exported modules
- `buildOptions.json` contains the build options to use when building the
  package for release.
- `LICENSE`
- `package.json`
- `README.md`
- `typedoc.json`

You must also add an entry to the `tsconfig.json` and
`website/docs/tsconfig.json` `paths` compiler option.
