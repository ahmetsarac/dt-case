import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './student.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { CoursesModule } from '../courses/courses.module'; // CoursesModule'u ekledik

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, User]),
    UsersModule,
    forwardRef(() => EnrollmentsModule),
    CoursesModule,
  ],
  providers: [StudentsService],
  controllers: [StudentsController],
  exports: [StudentsService],
})
export class StudentsModule { }
