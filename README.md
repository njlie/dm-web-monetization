# dm-web-monetization
> Middleware to monetize your deathmatch games

## Overview
`dm-web-monetization` is an extension of [koa-web-monetization](https://github.com/interledgerjs/koa-web-monetization), specialized for gaming use cases. It uses [Interledger](https://interledger.org) for payments.

`dm-web-monetization` provides middleware to monetize the interactions between two players where one may overcome the other in some way. It differs from `koa-web-monetization` in that an interface will be required to interact with a particular game. An example implementation can be found at [ILDeathmatch](https://github.com/njlie/ILDeathmatch) and [ILDeathmatch-Server](https://github.com/njlie/ILDeathmatch-Server).

## API Docs

`dm-web-monetization` inherits the same middleware as `koa-web-monetization`, which can be found [here](https://github.com/interledgerjs/koa-web-monetization#api-docs). It further extends it with a few new middlewares.

### addPointer
```ts
instance.addPointer(): Function
```
Returns a koa middleware that associates an [SPSP Receiver](https://github.com/interledgerjs/ilp-protocol-spsp) in the path as `:pointer` with an `:id` that is also in the path.

### spawnPlayer
```ts
instance.spawnPlayer(opts: Object): Function
```
- `opts.price` - Function that takes koa `ctx` and returns price, or a number. Specifices how many units to charge the user. Required.
Returns a koa middleware that charges the user whose `:id` is in the path. It is meant to be chained with other middlewares. This middleware is the same as [paid](https://github.com/interledgerjs/koa-web-monetization#paid), except that it errors out if the `:id` specified is not already on the server, and does not allow `awaitBalance`, so it can be used to enforce that a player has sufficient funds to play. This middleware should be called as a "buy-in" each time a player connects or reenters play in some way, such as respawning in a shooter game.

### payPlayer
```ts
instance.payPlayer(price: Number): Function
```
- `price` - Number representing the amount to pay a player upon overcoming another player. Required.
Returns a koa middleware that pays the passed in `price` to the user whose `:id` is in the path. It requires that the `:id` have a pointer already associated with it via `addPointer()`. It should be called whenever a player overcomes another in some way, such as killing another player in a shooter.

### disconnectPlayer
```ts
instance.disconnectPlayer(): Function
```
Returns a koa middleware that can be used to zero out a player's balance upon disconnect. Use at your own discretion.
