import http from 'http'
import https from 'https'

class webReader {
  // https://stackoverflow.com/a/48729712
  // sidanmor, 11th of February, 2018
  static readWebsite (url) {
    return new Promise((resolve, reject) => {
      let client = http

      if (url.toString().indexOf('https') === 0) {
        client = https
      }

      client.get(url, (resp) => {
        let data = ''

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk
        })

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(data)
        })
      }).on('error', (err) => {
        reject(err)
      })
    })
  }
}

export default webReader
