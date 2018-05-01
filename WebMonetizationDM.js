const WebMonetization = require('koa-web-monetization')
const plugin = require('ilp-plugin')()
const SPSP = require('ilp-protocol-spsp')

class WebMonetizationDM extends WebMonetization {
  constructor() {
    super()

    this.pointers = new Map()
  }

  checkHeaders() {
    return async (ctx, next) => {
      if (!ctx.headers.host.includes('localhost')) {
        return ctx.throw(400, 'Only requests from localhost are allowed.')
      }
      return next()
    }
  }

  addPointer() {
    return async (ctx, next) => {
      console.log('adding spsp pointer')
      console.log('ip=', ctx.params.id, ' pointer=', ctx.params.pointer)

      try {
        await SPSP.pay(plugin, {
          receiver: `${ctx.params.pointer}`,
          sourceAmount: '0'
        })

        console.log('paid!')
        this.pointers.set(ctx.params.id, ctx.params.pointer)
      } catch (e) {
        console.log(e.message)
        return ctx.throw(400, e.message)
      }

      return next()

    }
  }

  spawnPlayer({price}) {
    return async (ctx, next) => {
      console.log('spawnplayer called')
      const id = ctx.params.id
      console.log('id: ', id)
      if (!id) {
        return ctx.throw(400, 'ctx.params.id must be defined')
      }

      const _price = (typeof price === 'function')
        ? Number(price(ctx))
        : Number(price)
    

      const hasBucket = this.buckets.get(id) || -1
      if (hasBucket === -1) {
        console.log('Player is not on server')
        ctx.throw(400, 'Player is not on server')
      }

      const hasPointer = this.pointers.get(id) || -1
      if (hasPointer === -1) {
        console.log('Player does not have pointer')
        ctx.throw(400, 'Player does not have pointer')
      }

      try {
        this.spend(id, _price)
        return next()
      } catch (e) {
        console.log('spawnPlayer ERROR: ', e.message)
        return ctx.throw(402, e.message)
      }
      return next()
    }
  }

  payPlayer (price) {
    return async (ctx, next) => {
      console.log('it worked')
      const id = ctx.params.id
      const balance = this.buckets.get(id) || -1
      if (balance === -1) {
        console.log('Player is not on server')
        ctx.throw(400, 'Player is not on server')
      }

      const pointer = this.pointers.get(id) || -1
      if (pointer === -1) {
        console.log('Player has no pointer')
        ctx.throw(400, 'Player has no pointer')
      }

      console.log(`${pointer}`)

      try {
        await SPSP.pay(plugin, {
          receiver: `${pointer}`,
          sourceAmount: '100'
        })

        console.log('paid ', id, ' 10 drops at ', pointer)
      } catch (e) {
        console.log('payPlayer ERROR: ', e.message)
        return ctx.throw(402, e.message)
      }

      return next()
    }
  }

  disconnectPlayer () {
    return async (ctx, next) => {
      console.log('disconnecting player')
      const id = ctx.params.id
      const balance = this.buckets.get(id) || 0
    }
  }
}

const wm = new WebMonetizationDM

wm.payPlayer()

module.exports = WebMonetizationDM