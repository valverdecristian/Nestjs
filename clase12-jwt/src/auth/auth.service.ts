/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  JsonWebTokenError,
  sign,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';
import { CredencialesDto } from './dto/credencialesDto';

const CONTRASENA_SECRETA_DEL_SERVER =
  'ESTO DEBERÍA ESTAR EN UN ENV Y SER MUY LARGA Y MUY SEGURA';

@Injectable()
export class AuthService {
  login(user: CredencialesDto) {
    // Lee de la base de datos y confirma usuario válido y comprara contraseñas encriptadas.
    return this.createToken(user.usuario);
  }

  register(user: CredencialesDto) {
    // Valida usuario no existe y guarda
    return this.createToken(user.usuario);
  }

  // Ejemplo devuelve en body, trae desde header

  createToken(username: string) {
    const payload: { user: string; admin: boolean } = {
      user: username,
      admin: false,
    };

    // Necesito crear un token, sign es el método
    const token: string = sign(payload, CONTRASENA_SECRETA_DEL_SERVER, {
      expiresIn: '15m',
    });

    return { token: token };
  }

  verificar(authHeader: string) {
    console.log(authHeader); // Bearer token
    if (!authHeader) throw new BadRequestException();

    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer') throw new BadRequestException();

    this._validateToken(token);
  }

  loginCookie(user: CredencialesDto) {
    return this.guardarEnCookie(user.usuario);
  }

  // Guarda en cookie, lee de cookie
  guardarEnCookie(username: string) {
    const payload: { user: string; admin: boolean } = {
      user: username,
      admin: false,
    };

    // Necesito crear un token, sign es el método
    const token: string = sign(payload, CONTRASENA_SECRETA_DEL_SERVER, {
      expiresIn: '15m',
    });

    return token;
  }

  verificarDesdeCookie(token: string) {
    this._validateToken(token);
  }

  private _validateToken(token: string) {
    try {
        // La verificación lanzará el error si el token es inválido/expirado
        const tokenValidado = verify(token, CONTRASENA_SECRETA_DEL_SERVER);
        return tokenValidado;
    } catch (error) {
        // El servicio no lanza las HTTP, pero puede transformar el error de JWT
        if (error instanceof TokenExpiredError) {
            throw new Error("TOKEN_EXPIRADO"); // 👈 Usamos un código de error
        }
        if (error instanceof JsonWebTokenError) {
            throw new Error("TOKEN_INVALIDO"); // 👈 Usamos un código de error
        }
        throw new InternalServerErrorException();
    }
}
}