import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.username = createUserDto.username;
        user.student_number = createUserDto.student_number;
        user.password = await bcrypt.hash(createUserDto.password, 10);
        user.role = createUserDto.role;
        return this.usersRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findOneByUsername(username: string): Promise<User> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findOneByStudentNumber(student_number: string): Promise<User> {
        return this.usersRepository.findOne({ where: { student_number } });
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }

    async countUsers(): Promise<number> {
        console.log("userCount geldi")
        return this.usersRepository.count();
    }
}
