const { Router } = require("express");
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')

const { getUsuarios, crearUsuarios, actualizarUsuario,eliminarUsuario } = require("../controllers/usuarios");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/",[ validarJWT ], getUsuarios);

router.post("/",
[
    check('nombre', ' El nombre es obligatorio').not().isEmpty(),
    check('password', ' La contraseña es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,

  ], crearUsuarios);

router.put("/:id",
    [
      validarJWT,
      check('nombre', ' El nombre es obligatorio').not().isEmpty(),
      check('email', 'El email es obligatorio').isEmail(),
      check('rol', 'El Rol es obligatorio').isEmpty(),
    validarCampos,


    ] ,actualizarUsuario);


    router.delete("/:id",[ validarJWT ],eliminarUsuario);


module.exports = router;
