import HTMLParser from 'node-html-parser'
import webReader from '../utils/web_reader.js'
import { Survivor, Killer } from '../db/models/character.js'

class charJobs {
  static #addURL = 'https://deadbydaylight.fandom.com'

  // Characters
  static #charactersURL = 'https://deadbydaylight.fandom.com/wiki/Characters'
  static #survivorsSelector = "h2:has(span[id^='Survivors'])+dl+div"
  static #killersSelector = "h2:has(span[id^='Killers'])+dl+div"

  static #retrieveCharacters (selector) {
    if (!selector) { return false }

    return new Promise((resolve, reject) => {
      webReader.readWebsite(this.#charactersURL).then((data) => {
        const Characters = []
        const parsedHTML = HTMLParser.parse(data)

        const CharTable = parsedHTML.querySelector(selector)

        const isKiller = selector === this.#killersSelector;

        if (!CharTable) {
          reject(new Error('HTML table with characters not found.'))
          return
        }

        CharTable.childNodes.forEach(charDiv => {
          if (!charDiv.childNodes?.length >= 2) { return }

          // Character Info
          const charA = charDiv.querySelectorAll('a')[0]

          const characterName = charA.innerText
          var killerName;

            if(isKiller) {
                killerName = charDiv.innerText.split(' - ').pop();
            }

          const URIName = charA.attributes.href.split('/').pop() // Should only be 3% slower than arr[arr.length - 1]
          const characterLink = this.#addURL + charA.attributes.href

          // Character Image
          const imgA = charDiv.querySelectorAll('img')[0]

          const characterImage = imgA.attributes['data-src']

          const characterData = { name: characterName, killerName, URIName, iconURL: characterImage, link: characterLink }

          Characters.push(characterData)
        })

        if (Characters.length) { resolve(Characters) } else { reject(new Error('No characters found.')) }
      })
    })
  }

  static async retrieveSurvivors () {
    try {
      const survivors = await this.#retrieveCharacters(this.#survivorsSelector)
      const bulkOps = survivors.map(survivor => {
        return {
          updateOne: {
            filter: {
              name: survivor.name
            },
            update: survivor,
            upsert: true
          }
        }
      })

      await Survivor.bulkWrite(bulkOps)

      console.log('Successfully fetched Survivors.')
    } catch (error) {
      throw new Error('Failed fetching Survivors')
    }
  }

  static async retrieveKillers () {
    try {
      const killers = await this.#retrieveCharacters(this.#killersSelector)
      const bulkOps = killers.map(killer => {
        return {
          updateOne: {
            filter: {
              name: killer.name
            },
            update: killer,
            upsert: true
          }
        }
      })

      await Killer.bulkWrite(bulkOps)

      console.log('Successfully fetched Killers.')
    } catch (error) {
      throw new Error('Failed fetching Killers')
    }
  }

  static updateKillersAndSurvivors () {
    console.log('Updating character database...')
    return new Promise((resolve, reject) => {
      try {
        Promise.all([this.retrieveSurvivors(), this.retrieveKillers()]).then(() => {
          resolve('Successfully updated character database')
        })
      } catch (error) {
        reject(new Error('Character database update failed'))
      }
    })
  }
}

export default charJobs
