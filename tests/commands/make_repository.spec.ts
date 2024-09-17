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

import MakeRepositoryCommand from '../../commands/make/repository.js'

test.group('Make repository', (group) => {
  group.each.teardown(async () => {
    delete process.env.ADONIS_ACE_CWD
  })

  test('make an repository', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeRepositoryCommand, ['orderShipped'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/repositories/order_shippeds_repository.ts')
    await assert.fileContains(
      'app/repositories/order_shippeds_repository.ts',
      'export default class OrderShippedsRepository {'
    )
  })

  test('make an repository singular', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeRepositoryCommand, ['orderShipped', '-s'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/repositories/order_shipped_repository.ts')
    await assert.fileContains(
      'app/repositories/order_shipped_repository.ts',
      'export default class OrderShippedRepository {'
    )
  })
})
