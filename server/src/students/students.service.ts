import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private studentsRepository: Repository<Student>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => EnrollmentsService))
        private readonly enrollmentsService: EnrollmentsService,
        private readonly coursesService: CoursesService,
    ) { }

    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        const { name, enrollment_year, student_number, password, courses } = createStudentDto;


        const existingUserByStudentNumber = await this.usersService.findOneByStudentNumber(student_number);
        if (existingUserByStudentNumber) {
            throw new ConflictException('Student number already exists');
        }


        const createUserDto: CreateUserDto = {
            username: name,
            student_number: student_number,
            password: password,
            role: 'student',
        };
        const savedUser = await this.usersService.create(createUserDto);


        const student = new Student();
        student.name = name;
        student.enrollment_year = enrollment_year;
        student.user = savedUser;
        const savedStudent = await this.studentsRepository.save(student);


        if (courses && courses.length > 0) {
            for (const course of courses) {
                const existingCourse = await this.coursesService.findOne(course.course_id);
                if (!existingCourse) {
                    throw new NotFoundException(`Course with ID ${course.course_id} not found`);
                }
                console.log("create save bolumu:", savedStudent)
                await this.enrollmentsService.create({
                    studentId: savedStudent.id,
                    courseId: existingCourse.id,
                    grade: course.grade,
                });
            }
        }

        return this.findOne(savedStudent.id);
    }

    findAll(): Promise<Student[]> {
        return this.studentsRepository.find({ relations: ['user', 'enrollments', 'enrollments.course'] });
    }

    async findOne(id: number): Promise<Student> {
        const student = await this.studentsRepository.findOne({
            where: { id },
            relations: ['user', 'enrollments', 'enrollments.course'],
        });
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
        return student;
    }

    async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
        const { name, student_number, courses } = updateStudentDto;

        const student = await this.findOne(id);
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }

        student.name = name;
        student.user.student_number = student_number;
        await this.studentsRepository.save(student);

        await this.enrollmentsService.removeAllByStudentId(student.id);

        if (courses && courses.length > 0) {
            for (const course of courses) {
                const existingCourse = await this.coursesService.findOne(course.course_id);
                if (!existingCourse) {
                    throw new NotFoundException(`Course with ID ${course.course_id} not found`);
                }
                await this.enrollmentsService.create({
                    studentId: student.id,
                    courseId: existingCourse.id,
                    grade: course.grade,
                });
            }
        }

        return this.findOne(student.id);
    }

    async remove(id: number): Promise<void> {
        const student = await this.findOne(id);
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }


        if (student.user && student.user.id) {
            await this.usersService.remove(student.user.id);
        }

        await this.studentsRepository.remove(student);
    }


    async search(query: string): Promise<Student[]> {
        const lowerQuery = query.toLowerCase();

        const students = await this.studentsRepository.createQueryBuilder('student')
            .leftJoinAndSelect('student.user', 'user')
            .leftJoinAndSelect('student.enrollments', 'enrollment')
            .leftJoinAndSelect('enrollment.course', 'course')
            .where('LOWER(student.name) LIKE :query', { query: `%${lowerQuery}%` })
            .orWhere('LOWER(user.student_number) LIKE :query', { query: `%${lowerQuery}%` })
            .orWhere('LOWER(course.course_name) LIKE :query', { query: `%${lowerQuery}%` })
            .getMany();

        return students;
    }

    async findCoursesByUserId(userId: number): Promise<any[]> {
        const student = await this.studentsRepository.findOne({
            where: { user: { id: userId } },
            relations: ['enrollments', 'enrollments.course'],
        });

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        return student.enrollments.map(enrollment => ({
            course_code: enrollment.course.course_code,
            course_name: enrollment.course.course_name,
            grade: enrollment.grade,
        }));
    }
}
