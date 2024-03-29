# Changelog

## [0.7.2](https://github.com/foscia-dev/foscia/compare/v0.7.1...v0.7.2) (2024-02-20)


### Bug Fixes

* **http:** `configureRequest` will now correctly merge options ([63e7300](https://github.com/foscia-dev/foscia/commit/63e730014ba8b4b8be1947a1ba09ab8675436477)), closes [#20](https://github.com/foscia-dev/foscia/issues/20)
* **http:** correctly run context transformers on http adapter ([8e0a335](https://github.com/foscia-dev/foscia/commit/8e0a33529800286b576818a862110b0b841abe0b))


### Features

* **http:** add support for other http request init in http adapter ([8df48d2](https://github.com/foscia-dev/foscia/commit/8df48d2c8e4119c93bc9d3f0dab3be8b76aabb6b)), closes [#20](https://github.com/foscia-dev/foscia/issues/20)

## [0.7.1](https://github.com/foscia-dev/foscia/compare/v0.7.0...v0.7.1) (2024-02-15)


### Bug Fixes

* **serialization:** deserializer with aliased keys ([f88d9d6](https://github.com/foscia-dev/foscia/commit/f88d9d6a765221ba5fb7ec14b6305a79141b1c59))


### Features

* **cli:** make init path optional as an argument ([47eccdd](https://github.com/foscia-dev/foscia/commit/47eccdda6a6b704bc5038cde36e574175f4fecf9))
* **serialization:** add new options to `makeSerializerWith` ([18fb6fb](https://github.com/foscia-dev/foscia/commit/18fb6fbf7261631235e93ca80bfc485d387cbcbd))

## [0.7.0](https://github.com/foscia-dev/foscia/compare/v0.6.3...v0.7.0) (2024-02-06)

[**Migration from 0.6.x to 0.7.x**](https://foscia.dev/docs/upgrade/migration#07x-from-06x)

### Features

* **core:** add model and instance composables usage check functions ([66a60fe](https://github.com/foscia-dev/foscia/commit/66a60fe365d84b40b16964442ea5974768be4a21))
* **core:** add model setup method and correct class inheritance ([4ffd4b9](https://github.com/foscia-dev/foscia/commit/4ffd4b97997ced397f0eb232c9eb3b78137e8f04))
* **core:** add tools to extract typings for composable ([f1e1153](https://github.com/foscia-dev/foscia/commit/f1e1153974b258c615faef2772fd2f7650ff6be8))
* **core:** add models setup and improve composables ([82cde5a](https://github.com/foscia-dev/foscia/commit/82cde5a540ac9627b122bb0317364f748b174c67)), closes [#2](https://github.com/foscia-dev/foscia/issues/2)
* **serialization:** serializer `serializeRelation` use given value ([4db9b80](https://github.com/foscia-dev/foscia/commit/4db9b80179ace18b14ac07931e4fba37ee755507)), closes [#17](https://github.com/foscia-dev/foscia/issues/17)


### BREAKING CHANGES

* **core:** Model `configure` method first argument is now required.
* **serialization:** `SerializerI.serializeRelation` signature has changed:
  if you are implementing your own serializer, you should add and use this
  value parameter as the value to serialize instead of retrieving it from the instance.
* **core:** composable are now dedicated objects and
  should not be object-spread in your definition anymore. Instead of
  doing `{ ...publishable }` you must use `{ publishable }`.

## [0.7.0-beta.2](https://github.com/foscia-dev/foscia/compare/v0.7.0-beta.1...v0.7.0-beta.2) (2024-02-05)


### Features

* **core:** add model and instance composables usage check functions ([66a60fe](https://github.com/foscia-dev/foscia/commit/66a60fe365d84b40b16964442ea5974768be4a21))
* **core:** add model setup method and correct class inheritance ([4ffd4b9](https://github.com/foscia-dev/foscia/commit/4ffd4b97997ced397f0eb232c9eb3b78137e8f04))
* **core:** add tools to extract typings for composable ([f1e1153](https://github.com/foscia-dev/foscia/commit/f1e1153974b258c615faef2772fd2f7650ff6be8))


### BREAKING CHANGES

* **core:** Model `configure` method first argument is now required.

## [0.7.0-beta.1](https://github.com/foscia-dev/foscia/compare/v0.7.0-beta.0...v0.7.0-beta.1) (2024-02-05)


### Features

* **core:** add models setup and improve composables ([82cde5a](https://github.com/foscia-dev/foscia/commit/82cde5a540ac9627b122bb0317364f748b174c67)), closes [#2](https://github.com/foscia-dev/foscia/issues/2)
* **serialization:** serializer `serializeRelation` use given value ([4db9b80](https://github.com/foscia-dev/foscia/commit/4db9b80179ace18b14ac07931e4fba37ee755507)), closes [#17](https://github.com/foscia-dev/foscia/issues/17)


### BREAKING CHANGES

* **serialization:** `SerializerI.serializeRelation` signature has changed:
if you are implementing your own serializer, you should add and use this
value parameter as the value to serialize instead of retrieving it from the instance.
* **core:** composable are now dedicated objects and
should not be object-spread in your definition anymore. Instead of
doing `{ ...publishable }` you must use `{ publishable }`.

## [0.7.0-beta.0](https://github.com/foscia-dev/foscia/compare/v0.6.3...v0.7.0-beta.0) (2024-02-05)

## [0.6.3](https://github.com/foscia-dev/foscia/compare/v0.6.2...v0.6.3) (2024-01-31)


### Bug Fixes

* **core:** relation loading won't trigger readonly error anymore ([ce7bb7e](https://github.com/foscia-dev/foscia/commit/ce7bb7e25bd667e7628834091f262f01ea303eb6))
* **jsonapi:** handle recursive records when not inside included ([a7cf22e](https://github.com/foscia-dev/foscia/commit/a7cf22e7ff7226a70fa9191a52ca9f472582fd5e))


### Features

* **core:** add `makeQueryRelationLoader` ([2cade74](https://github.com/foscia-dev/foscia/commit/2cade7459654329707c8e8b65cf2715d20d8c72e))
* **core:** add `query` generic context enhancer ([eb18ab4](https://github.com/foscia-dev/foscia/commit/eb18ab4ee417e97fb9a13d188b80707a20758d64))

### DEPRECATED

* **core:** `makeForRelationLoader`, use `makeQueryRelationLoader` instead ([2cade74](https://github.com/foscia-dev/foscia/commit/2cade7459654329707c8e8b65cf2715d20d8c72e))
* **core:** `forModel`, `forInstance`, `forId`, `forRelation` and `find`, use `query` instead ([eb18ab4](https://github.com/foscia-dev/foscia/commit/eb18ab4ee417e97fb9a13d188b80707a20758d64))


## [0.6.2](https://github.com/foscia-dev/foscia/compare/v0.6.1...v0.6.2) (2024-01-30)

### Bug Fixes
* **serialization**: correctly mark deserialized relations as loaded (6348115)

### Features
* **cli**: sort properties inside rendered definition (b05a183)

## [0.6.1](https://github.com/foscia-dev/foscia/compare/v0.6.0...v0.6.1) (2024-01-30)

### Bug Fixes
* **core:** async withoutHooks error rejection ([16e57a9](https://github.com/foscia-dev/foscia/commit/16e57a9e569e24fb62267b4b93415c07f73b4fcb))
* **core:** ignore undefined values inside snapshots ([9059f43](https://github.com/foscia-dev/foscia/commit/9059f432762c23163341ff84d6d600eb9132dd6b))
* **core:** run execute instead of adapter read when no action provided ([79148c3](https://github.com/foscia-dev/foscia/commit/79148c38b2f2f908ca3b24f1f3bf43d057da9ee4))
* **core:** withoutHooks will correctly restore hooks ([780aeeb](https://github.com/foscia-dev/foscia/commit/780aeebbb7503840f716f7ce2225d26b1a3e1458))
* **serialization:** context relation not correctly infered ([06200a6](https://github.com/foscia-dev/foscia/commit/06200a6e10dc632e85d8ebb4350f1b50612dcfdd))
* write model values using setter instead of $values object ([3b80ed4](https://github.com/foscia-dev/foscia/commit/3b80ed487b394e0af36ff7fb2a58fd93318ebbf3))

### Features
* **core:** add ability to disable readonly protection on models ([63dd154](https://github.com/foscia-dev/foscia/commit/63dd1546c30c5f32475e8c5e940b1a2f930f8c58))
* **core:** add forceFill function to write all properties on model ([82ffde0](https://github.com/foscia-dev/foscia/commit/82ffde08313c7b347adeb8b8d512b5a4b5abec0a))
* **core:** add properties hooks ([e8738c3](https://github.com/foscia-dev/foscia/commit/e8738c36816a6147f128f63c89cbc7ac62777680))
* **core:** add relationData enhancer to serialize relation's value ([9721856](https://github.com/foscia-dev/foscia/commit/9721856310c92bb18fea194640c211277fe6b278))
* **core:** add runHooks, deprecate runHook ([56b50ff](https://github.com/foscia-dev/foscia/commit/56b50ff68340536f10396a37d78680c001f14eb1))
* **core:** add sync callback support for withoutHooks ([22df8d6](https://github.com/foscia-dev/foscia/commit/22df8d627ea9d42ae07e53bc35e8bc834a2be025))

### DEPRECATED

* **core:** `runHook`, use `runHooks` instead ([56b50ff](https://github.com/foscia-dev/foscia/commit/56b50ff68340536f10396a37d78680c001f14eb1))
* **core:** `ModelHookCallback`, use `ModelInstanceHookCallback` instead ([e8738c3](https://github.com/foscia-dev/foscia/commit/e8738c36816a6147f128f63c89cbc7ac62777680))

## [0.6.0](https://github.com/foscia-dev/foscia/compare/v0.5.3...v0.6.0) (2024-01-28)

Foscia v0.6.0 is out! This is a big step to stability, with totally reworked action dependencies (adapters, etc.).
Migration should be straight forward if you are not using complex configuration options or extending dependencies.

### Features

* revised typing for models and actions preventing wrong errors and allowing generic usage.
* rewritten serialization in a brand new `@foscia/serialization` package which now handle a generic (not
  object/dictionary specific) serialization.
* rewritten dependencies as factory functions only instead of classes. This make the internal API more private but still
  customizable using public configuration objects. Each dependency will be more maintainable and still provide
  customization for end users.

### BREAKING CHANGES

* If you are using default blueprints functions without any advanced configuration, this major version's changes should
  not impact your implementations.
* If you are configuring serialization dependencies, you should check out code for the new configuration capabilities of
  new serialization tools. Feature level of serialization is the same but configuration is not backward compatible.
* If you are extending a dependency (adapter, etc.), you should change your extended class to an existing factory
  function and use configuration to customize the behavior.
* If you are using generics typings on actions (inside enhancers/runners) or consumers typings, you should
  check those usages to ensure they match latest typings.

## [0.6.0-beta.7](https://github.com/foscia-dev/foscia/compare/v0.6.0-beta.2...v0.6.0-beta.7) (2024-01-28)


### Features

* **core:** rewrite cache ([21b4a03](https://github.com/foscia-dev/foscia/commit/21b4a0367ecb66ab4b012334ff510680935cacac))
* **core:** rewrite registry ([128be2e](https://github.com/foscia-dev/foscia/commit/128be2e0a2b2683f8faca840a8581ae40c3f0303))
* rewrite cache, registry and adapters ([c7034d9](https://github.com/foscia-dev/foscia/commit/c7034d9400aa9c4313a74022da3c95d9c6117012))
* rewrite serialization ([aadf023](https://github.com/foscia-dev/foscia/commit/aadf0234842bd1e4669e8a17d7644eb4df434cfe))

## [0.6.0-beta.2](https://github.com/foscia-dev/foscia/compare/v0.6.0-beta.1...v0.6.0-beta.2) (2024-01-25)


### Bug Fixes

* **core:** improve model and instance inference ([6fa2c17](https://github.com/foscia-dev/foscia/commit/6fa2c17e9ca98af08909fb3f2770b9b9a7b08e21))
* **core:** use static type on action hooks property ([d448569](https://github.com/foscia-dev/foscia/commit/d448569bb67320c95499629c8710215ce9684ab5))


### Features

* **core:** expose additional typing to public api ([6b3b78c](https://github.com/foscia-dev/foscia/commit/6b3b78c26550c7cd4b2647e9225903ba7ec0d65e))

## [0.6.0-beta.1](https://github.com/foscia-dev/foscia/compare/v0.6.0-beta.0...v0.6.0-beta.1) (2024-01-25)


### Features

* **core:** extract configure/extend method into a dedicated type ([3c4c9d3](https://github.com/foscia-dev/foscia/commit/3c4c9d3b5d09b9dfe71334b2534836753f777ef8))


### BREAKING CHANGES

* **core:** `Model` static methods `extend` and `configure` have been moved inside a new extended type.
If you wish to use this method on typed variable/parameter, use `ExtendableModel` instead.

## [0.6.0-beta.0](https://github.com/foscia-dev/foscia/compare/v0.5.3...v0.6.0-beta.0) (2024-01-21)


### Bug Fixes

* **core:** model `extends` use parsed definition instead of raw ([62bf3ff](https://github.com/foscia-dev/foscia/commit/62bf3ff6977c9263f9fb4b8eba28e3fb95e37774))


### Features

* add `http` prefix to HTTP package errors names ([48bda77](https://github.com/foscia-dev/foscia/commit/48bda77fb210e39d44ad0a164ba9982e823b7249))
* add error flags to replace `isNotFound` adapter method ([fda8026](https://github.com/foscia-dev/foscia/commit/fda802630abcf2ae5eea25d91c1b0ce7688b077e))
* **cli:** add `toDateTime` transformer to available transformers ([2aed1db](https://github.com/foscia-dev/foscia/commit/2aed1db842535775dada9969b29c4cac175dab4d))
* **core:** change `extends` methods to `extend` ([2945940](https://github.com/foscia-dev/foscia/commit/2945940309925671eb1e6bbf055895e3c894a98d))
* **core:** change `toDate` name, add real `toDate` transformer ([b6e4875](https://github.com/foscia-dev/foscia/commit/b6e4875f06c227a3f915229c4cdc573880d91fc2))
* **core:** make `extends`/`configure` models return a derivative ([38076d6](https://github.com/foscia-dev/foscia/commit/38076d643fe255ca7520119de5720fa9f27357a4)), closes [#12](https://github.com/foscia-dev/foscia/issues/12)
* rework adapter response and deserializer input data ([1852934](https://github.com/foscia-dev/foscia/commit/18529340c7c9c2965aced71553f9520ba0df4948))
* rework dependencies configuration ([a3c478f](https://github.com/foscia-dev/foscia/commit/a3c478f6fad37ee2fb0a36782b33585b4e332cbc))


### BREAKING CHANGES

* You should now rely on `isNotFoundError` core exported function to check if an error match a "Not Found" error.
  If you have overwritten the `isNotFound` adapter method to catch specific errors, you should implement `NotFoundErrorI` core interface instead on catched errors.
* **http**: You should replace import and use of HTTP errors using this new prefix
  (e.g. change `NotFoundError` to `HttpNotFoundError`).
* Adapter should now return a wrapper object implementing `AdapterResponseI`.
  `RestDeserializer` and `JsonApiDeserializer` have been updated to take
  an `AdapterResponseI` read data instead of an HTTP response object.
* **core**: `toDate` transformer is renamed to `toDateTime`.
  `toDate` is now a new transformer converting to ISO date string (without time).
* **core**: Use of models and actions `extends` calls should be rewritten to the new `extend` name.


## [0.5.3](https://github.com/foscia-dev/foscia/compare/v0.5.2...v0.5.3) (2023-11-22)


### Bug Fixes

* **http:** query parameters serialization and http hooks ([7bfcb61](https://github.com/foscia-dev/foscia/commit/7bfcb619690222a2b4af3a4cebb434308cdfda4f))

## [0.5.2](https://github.com/foscia-dev/foscia/compare/v0.5.1...v0.5.2) (2023-11-22)


### Bug Fixes

* **core:** support any serialized type for transformers on id and attr ([6153ef9](https://github.com/foscia-dev/foscia/commit/6153ef9c2274d10dc929bb60e129f535db492a03))

## [0.5.1](https://github.com/foscia-dev/foscia/compare/v0.5.0...v0.5.1) (2023-11-22)


### Bug Fixes

* **core:** reduce typing strictness for hasOne and hasMany ([49e2fce](https://github.com/foscia-dev/foscia/commit/49e2fce15db6e96286fe226080919520be85215d))

## [0.5.0](https://github.com/foscia-dev/foscia/compare/v0.4.0...v0.5.0) (2023-11-10)


### Bug Fixes

* **core:** `type` cannot be used as a model definition key anymore ([945ad0e](https://github.com/foscia-dev/foscia/commit/945ad0eadaaa7ae3a14e7a25cee666472695d3b1))
* **core:** check for IDs keys in definition even for non prop descriptor ([51fa358](https://github.com/foscia-dev/foscia/commit/51fa3582b933e9994cc9218b82536fdda93b953e))


### Features

* **cli:** add modifiers in make:model and make:composable ([af127d2](https://github.com/foscia-dev/foscia/commit/af127d2c64c73f5d03347ca4d5a5c85a314b6f6c)), closes [#5](https://github.com/foscia-dev/foscia/issues/5)
* **core:** context dependencies are resolvable using functions ([24c4bb0](https://github.com/foscia-dev/foscia/commit/24c4bb05728e1664ed4b1013fc19e1756ec55247)), closes [#8](https://github.com/foscia-dev/foscia/issues/8)
* **core:** totally supports polymorphic relations ([dec11a7](https://github.com/foscia-dev/foscia/commit/dec11a7115ca759bd19ea91b7eafc5dae01c7700)), closes [#9](https://github.com/foscia-dev/foscia/issues/9)


### BREAKING CHANGES

* **core:** Signature for `guessContextModel` has changed to support guessing model with a type preference (for polymorphism).
`hasMany` generic type now represent correctly the model's property type (this means that when passing generics, you must pass an array of the type instead of just the type: `hasMany<Comment[]>()` instead of `hasMany<Comment>()`).
Pending relation method `path` has been removed because it is implementation specific. You must now path a config object to `config` method with a `path` property to define a relation's path.
* **core:** `consumeAdapter`, `consumeCache`, `consumeDeserializer`, `consumeRegistry` and `consumeSerializer` now return an `Awaitable` dependency instead of a sync value.

## [0.4.0](https://github.com/foscia-dev/foscia/compare/v0.3.0...v0.4.0) (2023-11-07)


### Bug Fixes

* **core:** define a dedicated param for models on `makeRegistry` ([26adcfd](https://github.com/foscia-dev/foscia/commit/26adcfdb8b4685bc4d511f75fe9ff7750cbc59e4))
* **core:** remove unused model/relation path consumer types ([8dcccab](https://github.com/foscia-dev/foscia/commit/8dcccab1ead0465e0b72a189ab4ac9b6abd1212e))
* **test:** add `[@internal](https://github.com/internal)` to internal classes ([72306b0](https://github.com/foscia-dev/foscia/commit/72306b09de84167133a6e005d97e0213dd5114af))


### Features

* **cli:** use new action factory definitions ([174aabc](https://github.com/foscia-dev/foscia/commit/174aabc46aa1d0918e9f2789c98a8b987218ac2b))
* **core:** add `makeActionFactory` function ([c9e9665](https://github.com/foscia-dev/foscia/commit/c9e9665d4fb84a4886c9cd625149f88b5a4a068b))
* **core:** add `makeCache` and `makeRegistry` ([86dea7a](https://github.com/foscia-dev/foscia/commit/86dea7ae858de9482666ba4dc67f775ef2fd45aa))
* **core:** do not provide refs cache manager by default ([d365726](https://github.com/foscia-dev/foscia/commit/d3657267b358ff4afe55e484588a711ad6f77613))
* **http:** do not provide params serializer by default to http adapter ([bd2b681](https://github.com/foscia-dev/foscia/commit/bd2b6813226bb61c7b83680c3a9cbee7545dc21d))
* **http:** remove `makeHttpClient`, add `makeHttpAdapter` ([97a042d](https://github.com/foscia-dev/foscia/commit/97a042d3e7f22c865a3c9d36f84e0a95a058eec7))
* **jsonapi:** remove `makeJsonApi`, add JSON:API factories functions ([6cdc551](https://github.com/foscia-dev/foscia/commit/6cdc55149003aef6ace60be723ae97526b032866))
* **rest:** add mandatory data reader to rest deserializer ([b88833a](https://github.com/foscia-dev/foscia/commit/b88833a42a03702e01738aa2008242b27f01df2e))
* **rest:** remove `makeJsonRest`, add JSON REST factories functions ([87d76fa](https://github.com/foscia-dev/foscia/commit/87d76fa7849f9611dcb56b5bb4198991dc4ec61b))
* **test:** add new exported members ([cabdf1a](https://github.com/foscia-dev/foscia/commit/cabdf1a0fc236240e95e4c2be10c2532ecd7d7d9))


### BREAKING CHANGES

* **rest:** `dataReader` is now required to create a `RestDeserializer` instance. You must provide it inside `RestDeserializer` config object, or use the `makeJsonRestDeserializer` factory function (which will use `response.json()` to read adapter response data).
* **http:** `paramsSerializer` is not provided anymore by default to `HttpAdapter`. This means you must provide a `serializeParams` function yourself to the `HttpAdapter` constructor config or use `makeHttpAdapter` blueprint factory function.
* **core:** `weakRefManager` is not provided anymore by default to `RefsCache`. This means you must provide a ref `manager` yourself to the `RefsCache` constructor config or use `makeCache` blueprint factory function.
* **rest:** `makeJsonRest` is not exported anymore from `@foscia/rest`. You should use  `makeCache`, `makeRegistry`, `makeJsonRestAdapter`, `makeJsonRestDeserializer` and `makeJsonRestSerializer` combined with `makeActionFactory` instead.
* **jsonapi:** `makeJsonApi` is not exported anymore from `@foscia/jsonapi`. You should use  `makeCache`, `makeRegistry`, `makeJsonApiAdapter`, `makeJsonApiDeserializer` and `makeJsonApiSerializer` combined with `makeActionFactory` instead.
* **http:** `makeHttpClient` is not exported anymore from `@foscia/http`. You should use  `makeHttpAdapter` combined with `makeActionFactory` instead.
* **core:** `ConsumeModelPath` and `ConsumeRelationPath` are not exported anymore from `@foscia/core`.

## [0.3.0](https://github.com/foscia-dev/foscia/compare/v0.2.0...v0.3.0) (2023-11-04)


### Bug Fixes

* unify release number on all packages ([7d86e39](https://github.com/foscia-dev/foscia/commit/7d86e39d547ece2f4b78c9860c901cde499f118d))

## [0.2.0](https://github.com/foscia-dev/foscia/compare/v0.1.1...v0.2.0) (2023-11-04)


### Bug Fixes

* **core:** remove debug log when map registry cannot resolve model ([743fdb4](https://github.com/foscia-dev/foscia/commit/743fdb4b76ce5c4b96857f9cf44c78b2704742e8))


### Features

* **core:** add a path modifier to pending relation definition ([edb8fed](https://github.com/foscia-dev/foscia/commit/edb8fedd60477b1b8b35523aba46c46afd5bdd26))
* **object:** improve model resolving in object deserializer ([79b959b](https://github.com/foscia-dev/foscia/commit/79b959b6930fb1df0540b4c272663633dd44854d))
* **rest:** use a dedicated extended adapter for rest implementation ([95cef4e](https://github.com/foscia-dev/foscia/commit/95cef4e3ba852f37f657feee0f01ffa646eb44ba))

## 0.1.1 (2023-11-03)

Initial release.
