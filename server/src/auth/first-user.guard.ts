import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class FirstUserGuard implements CanActivate {
    constructor(private usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const userCount = await this.usersService.countUsers();
        return userCount === 0; // Eğer kullanıcı yoksa true döner, yani koruma olmaz
    }
}
