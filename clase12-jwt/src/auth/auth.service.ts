import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CredencialesDto } from './dto/credencialesDto';
import { JsonWebTokenError, sign, TokenExpiredError, verify } from 'jsonwebtoken';

const JWT_SECRET="Esta en un env"

@Injectable()
export class AuthService {
    login(usuario: CredencialesDto) {
        return this.createToken(usuario.usuario);
    }

    register(usuario: CredencialesDto) {
        return this.createToken(usuario.usuario);
    }

    createToken(username: string){
        const token:string = sign(
            {
                usuario: username,
                admin: false,
            },
            JWT_SECRET,
            { expiresIn: '15m' },
        );
        return {token: token};
    }

    // la informacion del usuario va a salir del verify
    verificar(authHeader: string){
        console.log(authHeader);
        if(!authHeader) throw new BadRequestException();
        
        const [tipo, token] = authHeader.split(' ');

        if(tipo !== 'Bearer') throw new BadRequestException();

        return this._validarToken(token);
    }

    // Guarda en cookies el token, lee de cookies el token
    guardarTokenEnCookies(username: string) {
        return this.createToken(username).token;
    }

    loginCookie(usuario: CredencialesDto) {
        return this.guardarTokenEnCookies(usuario.usuario);
    }

    verificarDesdeCookie(token: string){
        if (!token) throw new BadRequestException('Token de cookie no provisto.');
        return this._validarToken(token);
    }

    private _validarToken(token: string){
        try {
            const tokenValidado = verify(token, JWT_SECRET);
            return tokenValidado;
        }
        catch (error) {
            if (error instanceof TokenExpiredError) {
                return "Token expirado";
            }
            if (error instanceof JsonWebTokenError) {
                return "Token erroneo";
            }
            throw new InternalServerErrorException();
        }
    }
}
