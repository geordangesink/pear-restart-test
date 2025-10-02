/** @typedef {import('pear-interface')} */ /* global Pear */
import path from 'bare-path'
import fs from 'bare-fs'
import { spawn } from 'bare-subprocess'
import os from 'bare-os'

import { isWindows } from 'which-runtime'

const { teardown, config } = Pear
const dir = os.cwd()
const stageLink = 'pear://jj7a9yzkertt5k4o548gkz7abjrt6zopmoksnz1ck6er3pzu6r8o'

const isPearDev = config.pearDir.endsWith(path.join('pear', 'pear'))
const bin = isPearDev
  ? path.join(config.pearDir, '..', `pear${isWindows ? '.cmd' : '.dev'}`)
  : path.join(config.pearDir, 'bin', `pear${isWindows ? '.cmd' : ''}`)


appUpdate()
async function appUpdate () {
  
  const stageChild = spawn(bin, ['stage', '--json', 'dev', path.join(dir, 'restart-app')], { shell: !!isWindows })
  teardown(async () => stageChild.kill())
  await spawnUntil({ sc: stageChild, tag: 'addendum' })

  console.log('test')
  const runChild = spawn(bin, ['run', '--trusted', stageLink], { cwd: dir, shell: !!isWindows })
  teardown(async () => runChild.kill())

  for ( var i = 0; i < 100; i++ ){
    console.log('waiting for update', i)
    await new Promise(resolve => setTimeout(resolve, 2000))
    await fs.promises.writeFile(
      path.join(dir, 'restart-app', 'updater.js'),
      `
      // ${i}
      `
    )
    const stageChild = spawn(bin, ['stage', '--json', 'dev', path.join(dir, 'restart-app')], { shell: !!isWindows })
    teardown(async () => stageChild.kill())
    await spawnUntil({ sc: stageChild, tag: 'addendum' })
  }
}

async function spawnUntil({ sc, tag }) {
  return new Promise((resolve, reject) => {
    sc.stdout.on('data', (data) => {
      try {
        const lines = data
          .toString()
          .split('\n')
          .map((line) => line.trim())
          .map((line) => line.replace(/^,/, ''))
          .filter((line) => line)
          .map((line) => JSON.parse(line))
        const found = lines.find((line) => line.tag === tag)
        if (found) resolve(found.data)
      } catch (e) {
        console.log(data.toString())
        console.log(e)
        reject(e)
      }
    })
  })
}
