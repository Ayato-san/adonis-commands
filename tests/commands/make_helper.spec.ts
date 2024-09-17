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

import MakeHelperCommand from '../../commands/make/helper.js'

test.group('Make helper', (group) => {
  group.each.teardown(async () => {
    delete process.env.ADONIS_ACE_CWD
  })

  test('make an helper', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeHelperCommand, ['orderShipped'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/helpers/order_shippeds_helper.ts')
    await assert.fileContains(
      'app/helpers/order_shippeds_helper.ts',
      'export default class OrderShippedsHelper {'
    )
  })

  test('make an helper singular', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeHelperCommand, ['orderShipped', '-s'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/helpers/order_shipped_helper.ts')
    await assert.fileContains(
      'app/helpers/order_shipped_helper.ts',
      'export default class OrderShippedHelper {'
    )
  })
})
