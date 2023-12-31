# Changelog

## [0.5.3](https://github.com/foscia-dev/foscia/compare/v0.5.2...v0.5.3) (2023-11-22)


### Bug Fixes

* **http:** query parameters serialization and http hooks ([7bfcb61](https://github.com/foscia-dev/foscia/commit/7bfcb619690222a2b4af3a4cebb434308cdfda4f))

## [0.5.2](https://github.com/foscia-dev/foscia/compare/v0.5.1...v0.5.2) (2023-11-22)


### Bug Fixes

* **core:** support any serialized type for transformers on id and attr ([6153ef9](https://github.com/foscia-dev/foscia/commit/6153ef9c2274d10dc929bb60e129f535db492a03))

## [0.5.1](https://github.com/foscia-dev/foscia/compare/v0.5.0...v0.5.1) (2023-11-22)


### Bug Fixes

* **core:** reduce typing strictness for hasOne and hasMany ([49e2fce](https://github.com/foscia-dev/foscia/commit/49e2fce15db6e96286fe226080919520be85215d))

# [0.5.0](https://github.com/foscia-dev/foscia/compare/v0.4.0...v0.5.0) (2023-11-10)


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

# [0.4.0](https://github.com/foscia-dev/foscia/compare/v0.3.0...v0.4.0) (2023-11-07)


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

# [0.3.0](https://github.com/foscia-dev/foscia/compare/v0.2.0...v0.3.0) (2023-11-04)


### Bug Fixes

* unify release number on all packages ([7d86e39](https://github.com/foscia-dev/foscia/commit/7d86e39d547ece2f4b78c9860c901cde499f118d))

# [0.2.0](https://github.com/foscia-dev/foscia/compare/v0.1.1...v0.2.0) (2023-11-04)


### Bug Fixes

* **core:** remove debug log when map registry cannot resolve model ([743fdb4](https://github.com/foscia-dev/foscia/commit/743fdb4b76ce5c4b96857f9cf44c78b2704742e8))


### Features

* **core:** add a path modifier to pending relation definition ([edb8fed](https://github.com/foscia-dev/foscia/commit/edb8fedd60477b1b8b35523aba46c46afd5bdd26))
* **object:** improve model resolving in object deserializer ([79b959b](https://github.com/foscia-dev/foscia/commit/79b959b6930fb1df0540b4c272663633dd44854d))
* **rest:** use a dedicated extended adapter for rest implementation ([95cef4e](https://github.com/foscia-dev/foscia/commit/95cef4e3ba852f37f657feee0f01ffa646eb44ba))

## 0.1.1 (2023-11-03)

Initial release.