import mongoose from 'mongoose'
import config from 'dotenv'
const env = process.env.NODE_ENV || 'development'

// DEV
if (env === 'development') {
  config.config()
}

const IP = process.env.MONGODB_IP
const dbName = process.env.MONGODB_DB
const user = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD

class DB {
  constructor () {
    console.log('Connecting to database')
    let url = (IP === 'localhost' || IP === '127.0.0.1') ? 'mongodb://' : 'mongodb+srv://'
    url += user ? (user + ':' + password + '@') : ''
    url += IP
    url += '/' + dbName

    mongoose.connect(url, { useNewUrlParser: true })
      .then(() => { console.log('Successfully connected to database') })
      .catch((error) => { console.log(error) })
  }

  getConnection () {
    return mongoose.connection
  }
}

class DBI {
  static DBInterface
  static getInterface () {
    if (!this.DBInterface || !this.DBInterface?.readyState) { this.DBInterface = new DB() }

    return this.DBInterface
  }

  static getConnection () {
    return this.getInterface().getConnection()
  }

  static initConnection () {
    this.getInterface()
  }
}

export default DBI
