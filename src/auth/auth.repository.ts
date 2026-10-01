import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) { }
    async findUser(email: string) {
        return await this.prisma.user.findUnique(
            {
                where: {
                    email: email.toLowerCase()
                },
                include:{
                    role:true
                }
            })
    }
}