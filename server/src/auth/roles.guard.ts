import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service'; // doğru yolu kullanın

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(UsersService) private usersService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('You do not have permission to access this resource user yok');
        }

        // Kullanıcıyı veritabanında bulun ve rolünü doğrulayın
        const dbUser = await this.usersService.findOne(user.id);

        if (dbUser && dbUser.role === 'admin') {
            return true;
        } else {
            throw new ForbiddenException('You do not have permission to access this resource');
        }
    }
}
