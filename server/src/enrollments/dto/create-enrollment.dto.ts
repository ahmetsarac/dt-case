import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
    @IsNumber()
    studentId: number;

    @IsNumber()
    courseId: number;

    @IsOptional()
    @IsString()
    grade?: string;
}
