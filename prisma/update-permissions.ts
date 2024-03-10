import { permissions } from '@/actions/permissions'
import { db } from '@/lib/db'
import { PermissionCode, PermissionGroup } from '@prisma/client'

async function main() {
  const data = permissions.map(({ value }) => {
    const [group, code] = value.split('.') as [PermissionGroup, PermissionCode]
    return { group, code }
  })

  await db.permission.createMany({ data, skipDuplicates: true })
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await db.$disconnect()
    process.exit(1)
  })
