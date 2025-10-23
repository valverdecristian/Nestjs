import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './entities/usuario.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsuariosService {
  // una vez inyectado el modelo, podemos usarlo en los metodos del servicio
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,) {}

  // hay muchas formas de hacer esto (en el ejemplo usamos la forma clasica)
  async create(createUsuarioDto: CreateUsuarioDto) {
    const createdUsuario = new this.usuarioModel(createUsuarioDto);
    return await createdUsuario.save();
  }

  async findAll() {
    return await this.usuarioModel.find();
  }

  async findOne(id: string) {
    return await this.usuarioModel.findById(id);
  }

  // esto edita todos los que cumplen la condicion
  // pero no lo elimina, crea un nuevo documento
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.usuarioModel.updateOne(
      {
        _id: id,
      },
      { $set: updateUsuarioDto },
    );
  }

  async remove(id: string) {
    return await this.usuarioModel.deleteOne({ _id: id });
  }
}
