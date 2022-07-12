"use strict";

const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

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

    const validPassword = bcrypt.compareSync( password, useDB.password );

    if (!validPassword) {
        
        return res.status(400).json({

            ok:false,
            msg:'contraseña No válida'

        })

    }

    //Generar el token

    const token = await generarJWT( useDB._id );

    res.json({
     ok: true,
     token
    });
  } catch (error) {
    console.log(object);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
