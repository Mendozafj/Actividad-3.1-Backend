import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UsuariosSchema = new Schema({
  id: ObjectId,
  nombre: {
    type: String,
    required: true,
    match: /[a-z]/
  },
  apellido: {
    type: String,
    required: true,
    match: /[a-z]/
  },
  usuario: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
  },
  telefono: {
    type: Number,
    required: true,
  },
  contraseña: {
    type: String,
    required: true,
  }
});

export const UsuariosModelo = mongoose.model('usuarios', UsuariosSchema);