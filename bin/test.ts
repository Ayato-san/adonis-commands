import { assert } from '@japa/assert'
import { expectTypeOf } from '@japa/expect-type'
import { fileSystem } from '@japa/file-system'
import { processCLIArgs, configure, run } from '@japa/runner'

processCLIArgs(process.argv.splice(2))

configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [assert(), expectTypeOf(), fileSystem()],
})

run()
