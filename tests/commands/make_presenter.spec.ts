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

import MakePresenterCommand from '../../commands/make/presenter.js'

test.group('Make presenter', (group) => {
  group.each.teardown(async () => {
    delete process.env.ADONIS_ACE_CWD
  })

  test('make an presenter', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakePresenterCommand, ['orderShipped'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/presenters/order_shippeds_presenter.ts')
    await assert.fileContains(
      'app/presenters/order_shippeds_presenter.ts',
      'export default class OrderShippedsPresenter {'
    )
  })

  test('make an presenter singular', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakePresenterCommand, ['orderShipped', '-s'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/presenters/order_shipped_presenter.ts')
    await assert.fileContains(
      'app/presenters/order_shipped_presenter.ts',
      'export default class OrderShippedPresenter {'
    )
  })
})
