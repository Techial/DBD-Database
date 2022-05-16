import { stripHtml } from 'string-strip-html'
import HTMLParser from 'node-html-parser'
import webReader from '../utils/web_reader.js'
import { survivorPerk, killerPerk } from '../db/models/perk.js'

class perkJobs {
  static #addURL = 'https://deadbydaylight.fandom.com'

  // Perks
  static #perksURL = 'https://deadbydaylight.fandom.com/wiki/Perks'
  static #survivorPerksSelector = "h2:has(span[id^='Survivor_Perks_'])+table>tbody"
  static #killerPerksSelector = "h2:has(span[id^='Killer_Perks_'])+table>tbody"

  static #retrievePerks (selector) {
    if (!selector) { return false }

    return new Promise((resolve, reject) => {
      webReader.readWebsite(this.#perksURL).then((data) => {
        const Perks = []
        const parsedHTML = HTMLParser.parse(data)

        // CSS selector for ** perks table:
        // h2:has(span[id^='**_Perks_'])+table
        const PerkTable = parsedHTML.querySelector(selector)

        if (!PerkTable) {
          reject(new Error('HTML table with perks not found.'))
          return
        }

        PerkTable.childNodes.forEach(tableRow => {
          if (!tableRow.childNodes[1]) { return }

          const iconA = tableRow.querySelectorAll('th')[0].querySelector('a')
          const nameA = tableRow.querySelectorAll('th')[1].querySelector('a')

          // Check if actual perk
          if (!iconA || !nameA) { return }

          const contentA = tableRow.querySelectorAll('td')[0].querySelector('.formattedPerkDesc')

          const character = tableRow.querySelectorAll('th')[2].querySelectorAll('a')[0]

          // Actual usable variables
          const perkIcon = iconA.attributes.href
          const perkName = nameA.text
          const URIName = nameA.attributes.href.split('/').pop() // Should only be 3% slower than arr[arr.length - 1]

          contentA.querySelectorAll('a').forEach(link => {
            link.setAttribute('href', this.#addURL + link.attributes.href)
          })

          const content = contentA.innerHTML
          let characterName = ''

          if (character) { // Check if character exists, otherwise assume perk belongs to all
            characterName = character.attributes.title
          }

          const perkData = { URIName, name: perkName, iconURL: perkIcon, characterName, content, contentText: stripHtml(content).result }

          Perks.push(perkData)
        })

        if (Perks.length) { resolve(Perks) } else { reject(new Error('No perks found.')) }
      })
    })
  }

  static async retrieveSurvivorPerks () {
    try {
      const perks = await this.#retrievePerks(this.#survivorPerksSelector)
      const bulkOps = perks.map(perk => {
        return {
          updateOne: {
            filter: {
              name: perk.name
            },
            update: perk,
            upsert: true
          }
        }
      })

      await survivorPerk.bulkWrite(bulkOps)

      // Now add all character references
      await survivorPerk.aggregate([
        // Get character from perk.characterName
        // $project it to only select _id from character
        {
          $lookup: {
            from: 'survivors',
            localField: 'characterName',
            foreignField: 'name',
            as: 'character'
          }
        },
        // Unpack array into an object
        {
          $unwind: { path: '$character' }
        },
        // Overwrite character field to only be _id from object unpacked above
        {
          $set: { character: { $getField: { field: '_id', input: '$character' } } }
        },
        {
          $out: 'survivorperks'
        }
      ])

      console.log('Successfully fetched Survivor perks.')
    } catch (error) {
      throw new Error('Failed fetching Survivor perks ' + error)
    }
  }

  static async retrieveKillerPerks () {
    try {
      const perks = await this.#retrievePerks(this.#killerPerksSelector)
      const bulkOps = perks.map(perk => {
        return {
          updateOne: {
            filter: {
              name: perk.name
            },
            update: perk,
            upsert: true
          }
        }
      })

      await killerPerk.bulkWrite(bulkOps)

      // Now add all character references
      await killerPerk.aggregate([
        // Get character from perk.characterName
        // $project it to only select _id from character
        {
          $lookup: {
            from: 'killers',
            localField: 'characterName',
            foreignField: 'killerName',
            as: 'character'
          }
        },
        // Unpack array into an object
        {
          $unwind: { path: '$character' }
        },
        // Overwrite character field to only be _id from object unpacked above
        {
          $set: {
            character: {
              $getField: { field: '_id', input: '$character' }
            }
          }
        },
        {
          $out: 'killerperks'
        }
      ])

      console.log('Successfully fetched Killer perks.')
    } catch (error) {
      throw new Error('Failed fetching Killer perks ' + error)
    }
  }

  static updateKillerAndSurvivorPerks () {
    console.log('Updating perk database...')
    return new Promise((resolve, reject) => {
      try {
        Promise.all([this.retrieveSurvivorPerks(), this.retrieveKillerPerks()]).then(() => {
          resolve('Successfully updated perk database')
        })
      } catch (error) {
        reject(new Error('Perk database update failed'))
      }
    })
  }
}

export default perkJobs
