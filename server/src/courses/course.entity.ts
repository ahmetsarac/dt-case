import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    course_code: string;

    @Column()
    course_name: string;

    @OneToMany(() => Enrollment, (enrollment) => enrollment.course, { cascade: true, onDelete: 'CASCADE' })
    enrollments: Enrollment[];
}
