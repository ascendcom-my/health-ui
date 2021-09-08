import Echo from 'laravel-echo'
require('pusher-js')

const echo = new Echo({
  broadcaster: document.getElementById('required-data')?.dataset.broadcaster,
  key: document.getElementById('required-data')?.dataset.broadcastKey,
  cluster: 'ap1',
  forceTLS: true,
  namespace: 'Bigmom.Health.Events'
})

export default echo
