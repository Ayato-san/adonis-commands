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
import { stubsRoot } from '../../stubs/main.js'

test.group('Make helper', () => {
  test('create helper class', async ({ assert, fs }) => {
    const ace = await new AceFactory().make(fs.baseUrl)
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeHelperCommand, ['orderShipped'])
    await command.exec()

    const stubs = await ace.app.stubs.create()
    const stub = await stubs.build('make/helper/main.stub', {
      source: stubsRoot,
    })

    const entity = ace.app.generators.createEntity('orderShipped')
    const { contents } = await stub.prepare({
      entity,
      helper: { filePath: command.helpersPath(entity.name), name: command.helperName(entity.name) },
    })

    await assert.fileEquals('app/helpers/order_shipped.ts', contents)

    assert.deepEqual(ace.ui.logger.getLogs(), [
      {
        message: 'green(DONE:)    create app/helpers/order_shipped.ts',
        stream: 'stdout',
      },
    ])
  })
})
