import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AppConfigService } from '../../../config/app/config.service';
import { UsersService } from '../../users/users.service';
import { RegisterType } from '../../users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: appConfigService.googleClientId || '',
      clientSecret: appConfigService.googleClientSecret || '',
      callbackURL: appConfigService.googleCallbackUrl || '',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user = await this.usersService.findUserBySocialId(
      profile._json.sub,
      RegisterType.GOOGLE,
    );

    if (!user) {
      const newUser = await this.usersService.createUser({
        email: profile._json.email,
        name: profile._json.name,
        socialId: profile._json.sub,
        registerType: RegisterType.GOOGLE,
      });
      done(null, newUser);
    } else {
      done(null, user);
    }
  }
}
