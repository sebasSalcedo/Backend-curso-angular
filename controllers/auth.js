"use strict";

const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const useDB = await Usuario.findOne({ email });

    // Verificar Email

    if (!useDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    //Verificar contraseña

    const validPassword = bcrypt.compareSync(password, useDB.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "contraseña No válida",
      });
    }

    //Generar el token

    const token = await generarJWT(useDB._id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(object);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const loginGoogle = async (req, res = response) => {
  console.log(req.body.token);

  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    const usuarioDB = await Usuario.findOne({ email });

    let usuario;

    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      usuario = usuarioDB;
      usuario.google = true;
    }

    // Guardar usuario
    await usuario.save();

    // Generar el Token -jwt

    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error en el token de google",
    });
  }
};

const renewToken = async (req, res = response) => {
  const _id = req._id;
  const token = await generarJWT(_id);
  const { id, nombre, email, rol, google, img } = await Usuario.findById({
    _id,
  });

  res.json({
    ok: true,
    id,
    nombre,
    email,
    rol,
    google,
    img,
    token,
  });
};

module.exports = {
  login,
  loginGoogle,
  renewToken,
};
