import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    username: string;

    @Column({ unique: true, nullable: true })
    student_number: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['admin', 'student'] })
    role: 'admin' | 'student';

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => Student, (student) => student.user)
    student: Student;
}
