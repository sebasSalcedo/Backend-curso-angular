"use strict";

/*  
    path: '/api/todo/:busqueda'
*/

const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const expressFileUpload = require('express-fileupload');

const { getBusquedaData, getDataGlobal, fileUpload, viewFileImg} = require('../controllers/globales');

const router = Router();

router.use( expressFileUpload() );

router.get("/:busqueda", [ validarJWT ], getBusquedaData);
router.get("/:tabla/:busqueda", [ validarJWT ], getDataGlobal);

router.put("/upload/:tabla/:id", [ validarJWT ], fileUpload);

router.put("/view/:tipo/:id", [ validarJWT ], viewFileImg);






module.exports = router;

  
