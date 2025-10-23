import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type InstrumentoDocument = HydratedDocument<Instrumento>;

const SonidoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    frecuencia: { type: Number, required: true }
}, { _id: false });

@Schema()
export class Instrumento {
    // @Prop({ type: mongoose.Schema.Types.ObjectId })
    _id: ObjectId;

    @Prop({ required: true })
    marca: string;

    @Prop({ required: true })
    tipo: string;

    @Prop({ required: true })
    precio: number;

    // validamos de que es un array de strings
    @Prop({ required: true, type: [{ type: String }] })
    partituras: string[];

    @Prop({ required: true, type: SonidoSchema })
    sonidos: { nombre: string; frecuencia: number };

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const InstrumentoSchema = SchemaFactory.createForClass(Instrumento);