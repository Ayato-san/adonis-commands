<p align="center">
  <img src="https://github.com/Ayato-san/adonis-commands/assets/71392060/cd36b965-5a4f-481a-bf64-8f357c6e5689">
</p>

## Features

- Designed to work with AdonisJS, his packages lucid and bouncer out of the box
- add / modify Adonis commands

### Install

```bash
npm i -D @ayato-san/adonis-commands
node ace configure @ayato-san/adonis-commands
```

### Commands

- `make:action` create an action class
- `make:enum` create an enum file
- `make:helper` create an helper file (empty)
- `make:presenter` create a presenter class
- `make:repository` create a repository class
- `make:migration` (⚠️ only if lucid configured) create a migration based on default adonis migration but using postgres `uuid` generation

### Configure

change folders generation :

```ts
import { defineConfig } from '@ayato-san/adonis-commands'

const commandConfig = defineConfig({
  folders: {
    app: 'src',
    start: 'boot',
  },
})

export default commandConfig
```
