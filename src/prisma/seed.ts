import "dotenv/config"; 
import { PrismaClient } from '../generated/prisma/client.js'; 
import { PrismaPg } from "@prisma/adapter-pg"; 
import { Roles } from '../generated/prisma/enums.js';
import bcrypt from "bcrypt"; 

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL, 
}); 

const prisma = new PrismaClient({ adapter }); 

async function main() {
  for (const name of Object.values(Roles)) {
    const existingRole = await prisma.role.findFirst({ where: { name } });
    if (!existingRole) {
      await prisma.role.create({ data: { name } });
    }
  }

  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 10); 
  const adminRole = await prisma.role.findFirst({
    where: { name: Roles.ADMIN },
  });
  if (!adminRole) {
    throw new Error('Admin role was not created');
  }
  await prisma.user.upsert({ 
    where: { email: "admin@example.com" }, 
    update: {}, 
    create: { 
      email: "admin@example.com", 
      passwordHash: hashedPassword, 
      role: { connect: { id: adminRole.id } }, 
    }, 
  }); 

  console.log("admin account created"); 
} 

main() 
  .catch((error) => { 
    console.error(error); 
    process.exit(1); 
  }) 
  .finally(async () => { 
    await prisma.$disconnect(); 
  });