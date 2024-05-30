import { PrismaClient } from '@prisma/client'
var bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('cor9ewo9f', 10)

  const user = await prisma.users.create({
    data: {
      name: 'user',
      email: 'user@polaris.com',
      password: hashedPassword
    }
  })
}

async function main() {
  await seedUsers()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
