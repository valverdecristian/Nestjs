import { Body, Controller, Post, Get, Headers, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredencialesDto } from './dto/credencialesDto';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: CredencialesDto){
    return this.authService.login(body);
  }

  @Post('login/cookie')
  loginCookie(@Body() body: CredencialesDto, @Res() response: Response){
    const token = this.authService.loginCookie(body);
    // le agregamos mas seguridad a la cookie: hhttpOnly, secure, sameSite
    // secure es mejor dejarlo en false en desarrollo local porque no usamos https
    response.cookie('token', token, {httpOnly: true, secure: false, sameSite: 'strict', expires: new Date(Date.now() + 15 * 60 * 1000)});
    response.json({message: 'Token guardado en cookie'});
  }

  @Post('register')
  register(@Body() body: CredencialesDto){
    return this.authService.register(body);
  }

  @Get('data')
  traer(@Headers('authorization') authHeader:string){
    return this.authService.verificar(authHeader);
  }

  @Get('data/cookie')
  traerCookie(@Req() request: Request){
    const token = request.cookies['token'] as string;
    return this.authService.verificarDesdeCookie(token);
  }
}
