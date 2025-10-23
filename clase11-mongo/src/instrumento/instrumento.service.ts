import { HttpException, HttpStatus, Injectable, NotImplementedException } from '@nestjs/common';
import { CreateInstrumentoDto } from './dto/create-instrumento.dto';
import { UpdateInstrumentoDto } from './dto/update-instrumento.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Instrumento } from './entities/instrumento.entity';
import { Model } from 'mongoose';

// exec() es para que devuelva una promesa

@Injectable()
export class InstrumentoService {

  constructor(@InjectModel(Instrumento.name) private instrumentoModel: Model<Instrumento>) {}

  async create(createInstrumentoDto: CreateInstrumentoDto): Promise<Instrumento> {
    const nuevoInstrumento = new this.instrumentoModel(createInstrumentoDto);
    return nuevoInstrumento.save();
  }

  async findAll(): Promise<Instrumento[]> {
    return this.instrumentoModel.find().exec();
  }

  async findOne(id: string): Promise<Instrumento | null> {
    try {
      const instrumento = await this.instrumentoModel.findById(id).exec();
      return instrumento;
    }
    catch {
      // este catch esta capturando todos los errores, no solo el de no encontrado
      throw new HttpException('Instrumento no encontrado', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, updateInstrumentoDto: UpdateInstrumentoDto) {
    const resultado = await this.instrumentoModel.updateOne(
      { _id: id },
      { $set: updateInstrumentoDto},
    );
    return resultado;
  }

  async remove(id: string) {
    const resultado = await this.instrumentoModel.deleteOne({ _id: id });
    return resultado;
  }

  async traerPorFrecuencia(frecuencia: number) {
    throw new NotImplementedException();
    console.log(typeof frecuencia, frecuencia);
    const resultado = await this.instrumentoModel.find({
      "sonidos.frecuencia": { $lte: frecuencia }
    });
    return resultado;
  }
}
