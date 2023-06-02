import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import TokenPayload from './tokenPayload.interface';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET')?? 'mykey',
    });
  }

  async validate(payload: TokenPayload) {
    const url = `${this.configService.get('HUNTED_API_URL')}/auth/verifyToken`;
    this.logger.log(`url: ${url}`);
    const data = {
      payload: payload,
    };
    const options = {
      headers: {
        Authorization: 'Api-Key ' + this.configService.get('HUNTED_API_KEY'),
      },
    };
    try {
      const result = await firstValueFrom(
        this.httpService.post(url, data, options),
      );

      return result.data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
