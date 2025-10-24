/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { JwtCookieGuard } from 'src/guards/jwt-cookie.guard';
import { decode } from 'jsonwebtoken';
import { CredencialesDto } from './dto/credencialesDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: CredencialesDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: CredencialesDto) {
    return this.authService.register(body);
  }

  @Get('data')
  traer(@Headers('Authorization') authHeader: string) {
    return this.authService.verificar(authHeader);
  }

  @Post('login/cookie')
  loginCookie(@Body() body: CredencialesDto, @Res() response: Response) {
    const token: string = this.authService.loginCookie(body);
    response.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true, // HTTPS -> Cambiar en el env
      expires: new Date(Date.now() + 60 * 1000 * 15),
    });
    response.json({ message: 'Logueado' });
  }

  @Get('data/cookie')
  traerCookie(@Req() request: Request) {
    const token: string = request.cookies['token'] as string;
    return this.authService.verificarDesdeCookie(token);
  }

  @UseGuards(JwtGuard)
  @Get('data/jwt')
  traerConGuard(@Req() request: any) {
    console.log(request.user);
    return { message: 'Logró pasar al verbo' };
  }

  @UseGuards(JwtGuard)
  @Delete('/data/delete')
  delete(@Req() request: any) {
    // return this.authService.delete(request.user.id);
    return {};
  }

  @UseGuards(JwtCookieGuard)
  @Get('data/jwt/cookie')
  traerConGuardYCookie(@Req() request: Request) {
    const token = request.cookies['token'] as string;
    // 💡 PELIGRO: Usamos 'decode', que no verifica la firma ni la expiración.
    const datos = decode(token);
    return datos;
  }
}