import { isPackageExists } from 'local-pkg'

function hasSqlite() {
  return (
    isPackageExists('@types/luxon') && isPackageExists('better-sqlite3') && isPackageExists('luxon')
  )
}

function hasLibsql() {
  return (
    isPackageExists('@types/luxon') &&
    isPackageExists('@libsql/sqlite3') &&
    isPackageExists('sqlite3') &&
    isPackageExists('luxon')
  )
}

function hasMysql() {
  return isPackageExists('@types/luxon') && isPackageExists('mysql2') && isPackageExists('luxon')
}

function hasPostgres() {
  return isPackageExists('@types/luxon') && isPackageExists('pg') && isPackageExists('luxon')
}

function hasMssql() {
  return isPackageExists('@types/luxon') && isPackageExists('tedious') && isPackageExists('luxon')
}

function hasLucid() {
  return isPackageExists('@adonisjs/lucid')
}

export { hasLibsql, hasLucid, hasMssql, hasMysql, hasPostgres, hasSqlite }
