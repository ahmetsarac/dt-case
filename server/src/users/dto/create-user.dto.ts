export class CreateUserDto {
    username: string;
    student_number: string;
    password: string;
    role: 'admin' | 'student';
}
