import "dotenv/config"; 
import { PrismaClient } from '../generated/prisma/client.js'; 
import { PrismaPg } from "@prisma/adapter-pg"; 
import bcrypt from "bcrypt"; 

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL, 
}); 

const prisma = new PrismaClient({ adapter }); 

async function main() {
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 10); 

  const adminData = {
    email: "admin@example.com",
    passwordHash: hashedPassword,
    role: "688f1791-c3d8-4672-9ba8-4815acef2905"
  };
  await prisma.user.upsert({ 
    where: { email: adminData.email }, 
    update: {}, 
    create: { 
      email: adminData.email, 
      passwordHash: adminData.passwordHash, 
      role: { connect: { id: adminData.role } }, 
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