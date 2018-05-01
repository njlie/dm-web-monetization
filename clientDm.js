var ip = false
var baseUrl = new URL(window.location)

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

function addPaymentPointer () {
  document.getElementById('pointer-message').innerHTML = 'Adding Pointer...'
  const pointer = document.getElementById('payment-pointer').value
  console.log('id: ', ip)
  console.log('pointer: ', pointer)
  fetch(`http://${baseUrl.host}/addpointer/${ip}/${pointer}`).then(res => {
    console.log(res.status)
    if(res.status === 200) {
      document.getElementById('pointer-message').innerHTML = 'Pointer Added!'
      window.location.href = `http://${baseUrl.host}/play?connect%20${baseUrl.hostname}:27960`
    } else {
      document.getElementById('pointer-message').innerHTML = 'Failed to ping pointer.'
    }

  })
}

window.addEventListener('load', function () {
  console.log('ready')
  const quake = document.getElementById('quake-game')
  const socket = new WebSocket(`ws://${baseUrl.host}`)

  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!')
  })

  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
    if (event.data.includes('IP: ')) {
      const ipData = event.data.split('IP:').map(e => e.trim())[1]
      ip = ipData === '::1' ? '127-0-0-1' : ipData.replace(/\./g, '-').replace(/[^0-9\-]/g, '')
      console.log(ip)
      getMonetizationId(`http://${baseUrl.host}/pay/:id`, ip)
      document.getElementById('submit').removeAttribute('disabled')
    }
  })
})
