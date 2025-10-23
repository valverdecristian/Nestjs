import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InstrumentoModule } from './instrumento/instrumento.module';
@Module({
  // en esta parte agregamos mongoose en imports
  imports: [
    UsuariosModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    InstrumentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
