/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { AceFactory } from '@adonisjs/core/factories'
import { test } from '@japa/runner'

import MakeActionCommand from '../../commands/make/action.js'

test.group('Make action', (group) => {
  group.each.teardown(async () => {
    delete process.env.ADONIS_ACE_CWD
  })

  test('make an action', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeActionCommand, ['orderShipped'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/actions/order_shippeds_action.ts')
    await assert.fileContains(
      'app/actions/order_shippeds_action.ts',
      'export default class OrderShippedsAction {'
    )
  })

  test('make an action singular', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeActionCommand, ['orderShipped', '-s'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/actions/order_shipped_action.ts')
    await assert.fileContains(
      'app/actions/order_shipped_action.ts',
      'export default class OrderShippedAction {'
    )
  })
})
