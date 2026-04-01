import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'abc123456', // make sure this matches your jwtService config
    });
    console.log('>>> JwtStrategy initialized with secret:', 'abc123456');

  }

  async validate(payload: any) {
    // This will be available as request.user
    console.log('Jwt payload:', payload);
    return { userId: payload.sub, email: payload.email, phoneNumber: payload.phoneNumber, role: payload.role };
  }
}