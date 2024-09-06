import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {

    //We obtain the details of the request
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('There isn`t bearer token in the request');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: process.env.JWT_SEED,
        }
      );

      //console.log(payload);

      const user = await this.authService.findUserById( payload.id );
      if (!user) throw new UnauthorizedException('User does not exist');
      if (!user.isActive) throw new UnauthorizedException('User is not active');

      request['user'] = user; //We put the user in the request

    } catch (error) {
      throw new UnauthorizedException();
    }
    

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
