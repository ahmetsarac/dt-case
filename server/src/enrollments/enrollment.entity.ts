import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from '../students/student.entity';
import { Course } from '../courses/course.entity';

@Entity()
export class Enrollment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    grade: string;

    @ManyToOne(() => Student, (student) => student.enrollments, { onDelete: 'CASCADE' })
    student: Student;

    @ManyToOne(() => Course, (course) => course.enrollments, { onDelete: 'CASCADE' })
    course: Course;
}
