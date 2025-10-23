import { Injectable } from '@nestjs/common';
import { CredencialesDto } from './dto/credencialesDto';

@Injectable()
export class AuthService {
    login(usuario: CredencialesDto) {
        // Lógica de autenticación
    }

    register(usuario: CredencialesDto) {
        // Lógica de registro
    }
}
