"use strict";

/*  
    path: '/api/login/'
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { login, loginGoogle, renewToken } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/renew", validarJWT, renewToken);

router.post(
  "/google",
  [
    check("token", "El token de google es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  loginGoogle
);

router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;
