import { Injectable,ConflictException,NotFoundException } from '@nestjs/common';
import { ClassRepository } from './class.repository';

@Injectable()
export class ClassService {
    constructor(private readonly classRepository:ClassRepository){}
    async createClass(name:string){
        const isExist= await this.classRepository.findClass(name)
        if(isExist){
            throw new ConflictException("already exist");
        }

        const classdata=await this.classRepository.createClass(name);
        return {message:"class created successfully",classdata}
    }

    async updateClass(id:string, newName:string){
        const classToUpdate=await this.classRepository.findClassById(id);
        if(!classToUpdate){
            throw new NotFoundException("class not found")
        }

        const existingName=await this.classRepository.findClass(newName);
        if(existingName && existingName.id !== id){
            throw new ConflictException("already exist");
        }

        const updatedClass=await this.classRepository.updateClass(id, newName);
        return {message:"class updated successfully",classdata:updatedClass}
    }
    async getClasse(){
        return await this.classRepository.getClasses();
    }

}
