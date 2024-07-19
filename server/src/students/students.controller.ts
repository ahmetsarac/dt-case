import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query, Req } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard'; // import RolesGuard
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body() createStudentDto: CreateStudentDto) {
        return this.studentsService.create(createStudentDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    findAll() {
        return this.studentsService.findAll();
    }

    @Get('search')
    @UseGuards(JwtAuthGuard, RolesGuard)
    search(@Query('query') query: string) {
        return this.studentsService.search(query);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    findOne(@Param('id') id: string) {
        return this.studentsService.findOne(+id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
        return this.studentsService.update(+id, updateStudentDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param('id') id: string) {
        return this.studentsService.remove(+id);
    }


    @Get('me/courses')
    @UseGuards(JwtAuthGuard)
    async getStudentCourses(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        return this.studentsService.findCoursesByUserId(userId);
    }
}
