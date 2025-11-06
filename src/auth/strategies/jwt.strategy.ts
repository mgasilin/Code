import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../entities/user.entity';

interface JwtPayload {
  user_id: number;
  identifier: string;
  role: UserRole;
  platoon_id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
   constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      name: 'jwt'
    });
  }

  async validate(payload: any) {
    console.log('🎯 JwtStrategy.validate called!', payload);
    return {
      id: payload.user_id,
      identifier: payload.identifier,
      role: payload.role,
      platoonId: payload.platoon_id,
    };
  }
}