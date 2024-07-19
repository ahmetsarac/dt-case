import { IsString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CourseEnrollmentDto {
    @IsNumber()
    course_id: number;

    @IsString()
    @IsOptional()
    grade?: string;
}

export class CreateStudentDto {
    @IsString()
    name: string;

    @IsNumber()
    enrollment_year: number;

    @IsString()
    student_number: string;

    @IsString()
    password: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CourseEnrollmentDto)
    courses: CourseEnrollmentDto[];
}
