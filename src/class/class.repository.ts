import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class ClassRepository{
    constructor(private readonly prisma:PrismaService){}
    async findClass(name:string){
        return await this.prisma.class.findFirst(
            {
                where:{
                    name:name
                }
            }
        )
    }
    async findClassById(id:string){
        return await this.prisma.class.findUnique(
            {
                where:{
                    id:id
                }
            }
        )
    }
    async createClass(name:string){
        return await this.prisma.class.create(
            {
                data: {
                    name:name,
                    updatedAt: new Date()
                }
            }
        )
    }

    async updateClass(id:string, newName:string){
        return await this.prisma.class.update(
            {
                where:{
                    id:id
                },
                data:{
                    name:newName,
                    updatedAt: new Date()
                }
            }
        )
    }

    async getClasses(){
        return await this.prisma.class.findMany();
    }
}