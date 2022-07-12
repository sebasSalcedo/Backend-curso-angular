"use strict";

const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = Response, next) => {
  const token = req.header("x-token");

  // Verificar el token

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay Token en la petición...",
    });
  }

  try {
    
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req._id =_id;
    
    next();

  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }

};

module.exports = {
  validarJWT,
};
