import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredencialesDto } from './dto/credencialesDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: CredencialesDto){

  }

  @Post('login')
  register(@Body() body: CredencialesDto){

  }
}
