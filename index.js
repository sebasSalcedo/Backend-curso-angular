require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");


// Crear el servidor de express

const app = express();

// Configurar CORS

app.use(cors()); 

//carpeta public

app.use( express.static('public') );

// Lectura y parseo del body

app.use( express.json() );

// Base de datos

dbConnection();

// Rutas

app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/hospital', require('./routes/hospitales') );
app.use( '/api/medico', require('./routes/medicos') );
app.use( '/api/global', require('./routes/globales') );







app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto", +process.env.PORT);
});
