import { BadRequestException, ConsoleLogger, Injectable } from '@nestjs/common';
import { CredencialesDto } from './dto/credencialesDto';
import { sign, verify } from 'jsonwebtoken';
import { log } from 'console';

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

    verificar(authHeader: string){
        console.log(authHeader);
        if(!authHeader) throw new BadRequestException();
        
        const [tipo, token] = authHeader.split(' ');

        if(tipo !== 'Bearer') throw new BadRequestException();

        const tokenValidado = verify(token, JWT_SECRET);
        
        return tokenValidado;
    }
}
