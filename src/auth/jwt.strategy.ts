import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from 'passport-jwt';

interface CustomJwtPayload extends JwtPayload {
  sub: string;
  username: string;
}

type ExtractJwtType = {
  fromAuthHeaderAsBearerToken: () => (request: any) => string | null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy<typeof Strategy>(Strategy) {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: (
        ExtractJwt as ExtractJwtType
      ).fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  validate(payload: CustomJwtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
