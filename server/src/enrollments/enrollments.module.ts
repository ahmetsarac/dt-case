import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { Enrollment } from './enrollment.entity';
import { Student } from '../students/student.entity';
import { Course } from '../courses/course.entity';
import { StudentsModule } from '../students/students.module';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Enrollment, Student, Course]),
        forwardRef(() => StudentsModule),
        CoursesModule,
        UsersModule
    ],
    providers: [EnrollmentsService],
    controllers: [EnrollmentsController],
    exports: [EnrollmentsService],
})
export class EnrollmentsModule { }
