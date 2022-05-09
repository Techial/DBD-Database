const mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';

// DEV
if(env=="development")
    require('dotenv').config();

const IP        = process.env.MONGODB_IP;
const dbName    = process.env.MONGODB_DB;
const user      = process.env.MONGODB_USER;
const password  = process.env.MONGODB_PASSWORD;

class DB { 
    constructor() {
        console.log("Connecting to database");
        var url = (IP=="localhost" || IP =="127.0.0.1") ? "mongodb://" : "mongodb+srv://"; 
        url += user ? (user +":"+password+"@") : "";
        url += IP;
        url += "/"+dbName;

        mongoose.connect(url, {useNewUrlParser: true})
        .then(() => {console.log("Successfully connected to database");})
        .catch((error) => {console.log(error);});
    }

    getConnection() {
        return mongoose.connection;
    }
}

class DBI {
    static DBInterface;
    static getInterface() {
        if(!this.DBInterface || !this.getConnection()?.readyState)
            this.DBInterface = new DB();

        return this.DBInterface;
    }

    static getConnection() {
        return this.getInterface().getConnection();
    }

    static initConnection() {
        this.getInterface();
    }
}

module.exports = DBI;