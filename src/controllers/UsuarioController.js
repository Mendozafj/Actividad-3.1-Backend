import { UsuariosModelo } from "../models/UsuariosModelo.js";
import bcrypt from "bcrypt";
import { crearToken } from "./service/jwtCrear.js";

export class UsuarioController {
  static async registrar(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        const usuario = req.body;

        if (
          !usuario.usuario ||
          !usuario.contraseña ||
          !usuario.contraseñaConfirmacion ||
          !usuario.nombre ||
          !usuario.apellido ||
          !usuario.telefono ||
          !usuario.rol
        ) {
          return reject("Faltan propiedades en el body, verifica el manual");
        }

        if (usuario.rol != "director" && usuario.rol != "profesor") {
          return reject("Debes ingresar un rol permitido: director o profesor");
        }

        if (usuario.contraseña != usuario.contraseñaConfirmacion) {
          return reject("Las contraseñas deben coincidir");
        }

        //validamos que no exista otro usuario igual
        const existeUsuario = await UsuariosModelo.findOne({
          usuario: usuario.usuario,
        });

        if (existeUsuario) {
          return reject("Ya existe el Usuario registrado");
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(usuario.contraseña)) {
          return reject(
            "La contraseña debe ser de al menos 8 caracteres, incluir una mayúscula y un número."
          );
        }

        const passwordCifrada = await bcrypt.hash(usuario.contraseña, 10);

        const nuevoUsuario = {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          usuario: usuario.usuario,
          telefono: usuario.telefono,
          contraseña: passwordCifrada,
          rol: usuario.rol,
        };

        const usuarioCreado = await UsuariosModelo.create(nuevoUsuario);

        if (!usuarioCreado) {
          return reject("Hubo un error al crear el nuevo Usuario");
        }

        resolve(usuarioCreado);
      } catch (error) {
        reject(error.message);
      }
    });
  }

  static async login(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        const usuario = req.body;

        if (!usuario.usuario || !usuario.contraseña) {
          return reject("Faltan propiedades en el body, verifica el manual");
        }

        const usuarioLogear = await UsuariosModelo.findOne({
          usuario: usuario.usuario,
        });

        if (!usuarioLogear) {
          return reject("El usuario ingresado no existe");
        }

        const passwordValida = await bcrypt.compare(
          usuario.contraseña,
          usuarioLogear.contraseña
        );
        if (!passwordValida) {
          return reject("La contraseña es incorrecta");
        }

        let token = crearToken({
          id: usuarioLogear._id,
          usuario: usuarioLogear.usuario,
          rol: usuarioLogear.rol,
        });
        resolve({
          mensaje: "Has iniciado sesion con éxito",
          usuario: usuarioLogear.usuario,
          token: token,
        });
      } catch (error) {
        reject(error.message);
      }
    });
  }
}
