import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Enrollment } from '../enrollments/enrollment.entity';

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    enrollment_year: number;

    @OneToOne(() => User, (user) => user.student, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @OneToMany(() => Enrollment, (enrollment) => enrollment.student, { cascade: ['insert', 'update'], onDelete: 'CASCADE' })
    enrollments: Enrollment[];
}
