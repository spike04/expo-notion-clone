import { PrismaClient } from '@prisma/client/react-native'
import { reactiveHooksExtension } from '@prisma/react-native'

export const baseClient = new PrismaClient({
  log: [
    // { emit: 'stdout', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
})

export const extendedClient = baseClient.$extends(reactiveHooksExtension())

export async function initializeDb() {
  try {
    await baseClient.$applyPendingMigrations()
    console.log('db initialized!')
  } catch (error) {
    console.log(`failed to apply migrations: ${error}`)
    throw new Error(
      'Applying migrations failed, your app is now in an inconsistent state. We cannot guarantee that the data will be correct. please fix the issue and restart the app.',
    )
  }
}
