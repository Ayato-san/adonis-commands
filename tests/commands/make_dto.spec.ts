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

import MakeDTOCommand from '../../commands/make/dto.js'

test.group('Make dto', (group) => {
  group.each.teardown(async () => {
    delete process.env.ADONIS_ACE_CWD
  })

  test('make an dto', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeDTOCommand, ['orderShipped'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/dtos/order_shippeds_dto.ts')
    await assert.fileContains(
      'app/dtos/order_shippeds_dto.ts',
      'export default class OrderShippedsDTO {'
    )
  })

  test('make an dto singular', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeDTOCommand, ['orderShipped', '-s'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/dtos/order_shipped_dto.ts')
    await assert.fileContains(
      'app/dtos/order_shipped_dto.ts',
      'export default class OrderShippedDTO {'
    )
  })
})
