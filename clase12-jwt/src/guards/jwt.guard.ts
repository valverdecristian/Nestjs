import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

const CONTRASENA_SECRETA_DEL_SERVER =
  'ESTO DEBERÍA ESTAR EN UN ENV Y SER MUY LARGA Y MUY SEGURA';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers.authorization;

    if (!authHeader) throw new BadRequestException();

    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer') throw new BadRequestException();

    // Verificarlo

    try {
      const tokenValidado = verify(token, CONTRASENA_SECRETA_DEL_SERVER);
      (request as any).user = tokenValidado;

      return true;

    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Token expirado', 401);
      }

      if (error instanceof JsonWebTokenError) {
        throw new HttpException('Firma falló o tóken modificado', 401);
      }

      throw new InternalServerErrorException();
    }
  }
}