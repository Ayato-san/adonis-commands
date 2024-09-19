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

import MakePageCommand from '../../commands/make/page.js'

test.group('Make page', (group) => {
  group.each.teardown(async () => {
    delete process.env.ADONIS_ACE_CWD
  })

  test('make an page without props', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakePageCommand, ['orderShipped'])
    await command.exec()

    command.assertLog('green(DONE:)    create inertia/pages/order_shipped.tsx')
    await assert.fileContains(
      'inertia/pages/order_shipped.tsx',
      'export default function OrderShipped() {'
    )
  })

  test('make an page with controller props', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakePageCommand, ['orderShipped', '--config', 'controller'])
    await command.exec()

    command.assertLog('green(DONE:)    create inertia/pages/order_shipped.tsx')
    await assert.fileContains(
      'inertia/pages/order_shipped.tsx',
      "import type { InferPageProps } from '@adonisjs/inertia/types'"
    )
    await assert.fileContains(
      'inertia/pages/order_shipped.tsx',
      "export default function OrderShipped(props: InferPageProps<OrderShippedController, 'handle'>) {"
    )
  })

  test('make an page with page props', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakePageCommand, ['orderShipped', '--config', 'page'])
    await command.exec()

    command.assertLog('green(DONE:)    create inertia/pages/order_shipped.tsx')
    await assert.fileContains(
      'inertia/pages/order_shipped.tsx',
      "import type { SharedProps } from '@adonisjs/inertia/types'"
    )
    await assert.fileContains(
      'inertia/pages/order_shipped.tsx',
      'export default function OrderShipped() {\n  const {} = usePage<SharedProps>().props'
    )
  })
})
