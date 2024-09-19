import { isPackageExists } from 'local-pkg'

/** Check if SQLite packages are installed */
function hasSQLite() {
  return (
    isPackageExists('@types/luxon') && // Check for TypeScript types for Luxon
    isPackageExists('better-sqlite3') && // Check for better-sqlite3 package
    isPackageExists('luxon') // Check for Luxon package
  )
}

/** Check if LibSQL packages are installed */
function hasLibSQL() {
  return (
    isPackageExists('@types/luxon') && // Check for TypeScript types for Luxon
    isPackageExists('@libsql/sqlite3') && // Check for LibSQL SQLite3 package
    isPackageExists('sqlite3') && // Check for sqlite3 package
    isPackageExists('luxon') // Check for Luxon package
  )
}

/** Check if MySQL packages are installed */
function hasMySQL() {
  return (
    isPackageExists('@types/luxon') && // Check for TypeScript types for Luxon
    isPackageExists('mysql2') && // Check for mysql2 package
    isPackageExists('luxon') // Check for Luxon package
  )
}

/** Check if PostgreSQL packages are installed */
function hasPostgreSQL() {
  return (
    isPackageExists('@types/luxon') && // Check for TypeScript types for Luxon
    isPackageExists('pg') && // Check for pg package
    isPackageExists('luxon') // Check for Luxon package
  )
}

/** Check if MSSQL packages are installed */
function hasMSSQL() {
  return (
    isPackageExists('@types/luxon') && // Check for TypeScript types for Luxon
    isPackageExists('tedious') && // Check for tedious package
    isPackageExists('luxon') // Check for Luxon package
  )
}

/** Check if Lucid package is installed */
function hasLucid() {
  return isPackageExists('@adonisjs/lucid') // Check for AdonisJS Lucid package
}

/** Check if Inertia package is installed */
function hasInertia() {
  return isPackageExists('@adonisjs/inertia') // Check for AdonisJS Inertia package
}

/** Check if React package is installed */
function hasReact() {
  return (
    isPackageExists('@inertiajs/react') && // Check for Inertia React adapter package
    isPackageExists('react') // Check for React package
  )
}

export { hasInertia, hasLibSQL, hasLucid, hasMSSQL, hasMySQL, hasPostgreSQL, hasReact, hasSQLite }
