const mongoose = require('mongoose');

const dbConnection = ()=>{
    // connect to DB 
mongoose.connect(process.env.MONGO_URL).then(con =>{
    console.log(`Database connected to ${con.connection.host}`)
})
}

module.exports = dbConnection