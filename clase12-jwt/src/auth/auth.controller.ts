import { Body, Controller, Post, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredencialesDto } from './dto/credencialesDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: CredencialesDto){
    return this.authService.login(body);

  }

  @Post('register')
  register(@Body() body: CredencialesDto){
    return this.authService.register(body);
  }

  @Get('data')
  traer(@Headers('authorization') authHeader:string){
    return this.authService.verificar(authHeader);
  }
}
