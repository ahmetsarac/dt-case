import { Controller, Get, Post, Body, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const userCount = await this.usersService.countUsers();
        console.log("userCount geldi: ", userCount)

        if (userCount === 0) {
            return this.usersService.create(createUserDto);
        } else {
            return this.createAdminProtected(createUserDto);
        }
    }

    @Post('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createAdminProtected(@Body() createUserDto: CreateUserDto) {
        const request = createUserDto as any;
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }


        const dbUser = await this.usersService.findOne(user.id);

        if (dbUser && dbUser.role !== 'admin') {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return this.usersService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
