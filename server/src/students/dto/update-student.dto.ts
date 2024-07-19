import { IsString, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateCourseDto {
    @IsNumber()
    course_id: number;

    @IsString()
    @IsOptional()
    grade?: string;
}

export class UpdateStudentDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly student_number: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateCourseDto)
    readonly courses: UpdateCourseDto[];
}
