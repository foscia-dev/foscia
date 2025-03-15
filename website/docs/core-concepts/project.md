---
sidebar_position: 10
description: Project structure for Foscia files.
---

# Project structure

:::tip What you'll learn

- How Foscia files are organized inside your projects

:::

Foscia files are organized in an opinionated manner. This keeps your project
directory structure clean and allow Foscia to provide better features when
using the CLI, such as:

- Suggesting composables or transformers to use when making models or
  composables using
  [`foscia make model`](/docs/digging-deeper/usages/cli#make-model-name) or
  [`foscia make composable`](/docs/digging-deeper/usages/cli#make-composable-name).
- Importing available files (`models.ts`, `action.ts`, `makeModel.ts`, etc.)
  when generating other files (such as models, some frameworks integration files).

## Example project structure

Your Foscia files are stored in one directory you choose when initiating
your project using [`foscia init`](/docs/digging-deeper/usages/cli#init-path).

Here is an example of a Nuxt v4 project using Foscia and storing Foscia's
related files into `app/data` directory.

```text
root-path/
└── app/
    └── data/
        ├── composables/
        │   ├── commentable.ts
        │   └── publishable.ts
        ├── models/
        │   ├── comment.ts
        │   ├── gallery.ts
        │   └── post.ts
        ├── enhancers/
        │   └── withCount.ts
        ├── runners/
        │   └── firstOrFail.ts
        ├── transformers/
        │   └── toMomentDatetime.ts
        ├── utils/
        │   ├── reducer.ts
        │   └── reviver.ts
        ├── action.ts
        ├── models.ts
        └── makeModel.ts
```

## Structure description

| Path            | Description                                                                                                                                                             |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `composables/`  | [Composables](/docs/digging-deeper/models/models-composition#composition).                                                                                              |
| `models/`       | [Models](/docs/getting-started#defining-a-model).                                                                                                                       |
| `enhancers/`    | [Action enhancers](/docs/digging-deeper/actions/custom-action-enhancers).                                                                                               |
| `runners/`      | [Action runners](/docs/digging-deeper/actions/custom-action-runners).                                                                                                   |
| `transformers/` | [Transformers](/docs/digging-deeper/models/models-transformers).                                                                                                        |
| `utils/`        | Other utilities files, such as [model reducer](/docs/digging-deeper/models/models-reduce-revive) and [model reviver](/docs/digging-deeper/models/models-reduce-revive). |
| `action.ts`     | Export an [action factory](/docs/getting-started#first-actions).                                                                                                       |
| `models.ts`     | Export an array of available models, to be used by registry or other files.                                                                                             |
| `makeModel.ts`  | Export a [model factory](/docs/digging-deeper/models/models-composition#factory).                                                                                       |
