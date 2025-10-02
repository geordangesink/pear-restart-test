/** @typedef {import('pear-interface')} */ /* global Pear */
import updates from 'pear-updates'
import restart from 'pear-restart'

let updated = 0
updates( async (update) => {
  console.log('update available:', update)
  document.getElementById('update').style.display = 'revert'
  const action = document.getElementById('action')
  action.style.display = 'revert'
  action.innerText = 'Restart ' + (update.app ? 'App' : 'Pear') + ' [' + update.version.fork + '.' + update.version.length + ']'
  restart({ platform: !update.app })
})

document.getElementById('channel').innerText = Pear.config.channel || 'none [ dev ]'
document.getElementById('release').innerText = Pear.config.release || (Pear.config.dev ? 'none [ dev ]' : '0')
const { app, platform } = await Pear.versions()
document.getElementById('platformKey').innerText = platform.key
document.getElementById('platformFork').innerText = platform.fork
document.getElementById('platformLength').innerText = platform.length
document.getElementById('appKey').innerText = app.key
document.getElementById('appFork').innerText = app.fork
document.getElementById('appLength').innerText = app.length
