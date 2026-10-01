// import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';


// import { PrismaPg } from '@prisma/adapter-pg';
// @Injectable()
// export class PrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy
// {
//   constructor() {
//     const adapter = new PrismaPg({
//       url: process.env.DATABASE_URL,
//     });
//     super({ adapter });
//   }

//   async onModuleInit() {
//     await this.$connect();
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }
// }


import dotenv from 'dotenv';
dotenv.config();
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL as string,
        });
        super({ adapter });
    }
    async onModuleInit() {
        await this.$connect()
    }
}
