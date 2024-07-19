import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'identifier' }); // 'identifier' hem kullanıcı adı hem de öğrenci numarası için kullanılacak
    }

    async validate(identifier: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(identifier, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
