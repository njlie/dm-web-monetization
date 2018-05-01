function getMonetizationId (receiverUrl, clientId) {
  return new Promise((resolve, reject) => {
    var id = clientId
    var receiver = receiverUrl.replace(/:id/, id)

    if (window.monetize) {
      window.monetize({
        receiver
      })
      resolve(id)
    } else {
      console.log('Your extension is disabled or not installed.')
      reject(new Error('web monetization is not enabled'))
    }
  })
}

