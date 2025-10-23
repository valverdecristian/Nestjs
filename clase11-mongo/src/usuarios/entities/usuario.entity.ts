import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// esto se usa en nuestros servicios, cuando se inyecta el modelo
// y en los controladores, cuando se inyecta el modelo
export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema()
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  edad: number;
}
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
