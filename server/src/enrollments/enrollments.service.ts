import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Student } from '../students/student.entity';
import { Course } from '../courses/course.entity';

@Injectable()
export class EnrollmentsService {
    constructor(
        @InjectRepository(Enrollment)
        private enrollmentsRepository: Repository<Enrollment>,
        @InjectRepository(Student)
        private studentsRepository: Repository<Student>,
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
        const { studentId, courseId, grade } = createEnrollmentDto;

        const student = await this.studentsRepository.findOne({ where: { id: studentId } });
        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found`);
        }

        const course = await this.coursesRepository.findOne({ where: { id: courseId } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        console.log(`Creating enrollment: Student ID - ${studentId}, Course ID - ${courseId}, Grade - ${grade}`);

        const enrollment = this.enrollmentsRepository.create({
            student,
            course,
            grade,
        });

        return this.enrollmentsRepository.save(enrollment);
    }

    async findAll(): Promise<Enrollment[]> {
        return this.enrollmentsRepository.find({ relations: ['student', 'course'] });
    }

    async findOne(id: number): Promise<Enrollment> {
        return this.enrollmentsRepository.findOne({ where: { id }, relations: ['student', 'course'] });
    }

    async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {
        await this.enrollmentsRepository.update(id, updateEnrollmentDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.enrollmentsRepository.delete(id);
    }

    async removeAllByStudentId(studentId: number): Promise<void> {
        await this.enrollmentsRepository.delete({ student: { id: studentId } });
    }
}
