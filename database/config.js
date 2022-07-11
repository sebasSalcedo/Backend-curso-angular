const mongoose = require('mongoose');
require('dotenv').config();


const dbConnection = async() => {

    try {
        
        await mongoose.connect(process.env.DB_CNN);

        console.log("DB online");
    } catch (error) {
        
        console.log("error en la conexión db: ",error);
        throw new Error( "Error a la hora de iniciar la DB ver logs")

    }
    

}
module.exports = {

    dbConnection

}


