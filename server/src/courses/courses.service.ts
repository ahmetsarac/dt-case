import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    create(createCourseDto: CreateCourseDto): Promise<Course> {
        const course = this.coursesRepository.create(createCourseDto);
        return this.coursesRepository.save(course);
    }

    findAll(): Promise<Course[]> {
        return this.coursesRepository.find();
    }

    async findOne(id: number): Promise<Course> {
        const course = await this.coursesRepository.findOne({ where: { id } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

    async findOneByCode(courseCode: string): Promise<Course> {
        const course = await this.coursesRepository.findOne({ where: { course_code: courseCode } });
        if (!course) {
            throw new NotFoundException(`Course with code ${courseCode} not found`);
        }
        return course;
    }

    async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
        const course = await this.findOne(id);
        Object.assign(course, updateCourseDto);
        return this.coursesRepository.save(course);
    }

    async remove(id: number): Promise<void> {
        const course = await this.findOne(id);
        await this.coursesRepository.remove(course);
    }
}
