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

import MakeEnumCommand from '../../commands/make/enum.js'

test.group('Make enum', (group) => {
  group.each.teardown(async () => {
    delete process.env.ADONIS_ACE_CWD
  })

  test('make an enum', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeEnumCommand, ['orderShipped'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/enums/order_shippeds.ts')
    await assert.fileContains('app/enums/order_shippeds.ts', 'export const OrderShippeds = {')
  })

  test('make an enum singular', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeEnumCommand, ['orderShipped', '-s'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/enums/order_shipped.ts')
    await assert.fileContains('app/enums/order_shipped.ts', 'export const OrderShipped = {')
  })
})
