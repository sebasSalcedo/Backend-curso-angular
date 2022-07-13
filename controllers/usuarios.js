const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {

  const desde = Number(req.query.desde) || 0;
  

  const [ usuarios, total ] = await Promise.all([

   Usuario
     .find({}, "nombre email rol google img")
    .skip( desde )
    .limit( 5 ),
    
    Usuario.countDocuments()           

  ])

  res.json({
    ok: true,
    usuarios,
    total
  });
  
};

const crearUsuarios = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    const usuario = new Usuario(req.body);

    //Encriptar contraseña

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar Usuario
    await usuario.save();

    const token = await generarJWT( usuario._id );

    res.json({
      ok: true,
      usuario: usuario,
      token
    });
  } catch (error) {
    console.log("ERROR al crear el usuario: ", error);

    res.status(500).json({
      ok: false,
      msg: "Error inesperado.... revisar logs",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  // TODO: Validar token y comprobrar si es el usuario correcto

  try {
    const _id = req.params.id;
    const usuarioDB = await Usuario.findById({ _id });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro un registro con ese id",
      });
    }
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });

      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }

    campos.email = email;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(_id, campos);

    return res.status(200).json({
      ok: true,
      msg: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};



const eliminarUsuario = async ( req, res  = response ) => {


  const _id = req.params.id;
  try {

    const usuarioDB = await Usuario.findById( _id );

    console.log(usuarioDB);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro un registro con ese id",
      });
    }

    const deleteUsuario = await usuario.findByIdAndDelete( _id );
    

    return res.status(200).json({
      ok: true,
      msg: "Usuario Eliminado",
      user: deleteUsuario
    });
    
  } catch (error) {
    console.log("Error en el eliminar el usuario", error);

    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }


}

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  eliminarUsuario
  };
