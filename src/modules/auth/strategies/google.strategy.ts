import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { UsersService } from '../../users/users.service';
import { RegisterType } from '../../users/entities/user.entity';
import { SocialConfigService } from '../../../config/social/config.service';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly socialConfigService: SocialConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: socialConfigService.googleClientId!,
      clientSecret: socialConfigService.googleClientSecret!,
      callbackURL: socialConfigService.googleCallbackUrl!,
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
