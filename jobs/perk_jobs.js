import { stripHtml } from 'string-strip-html'
import HTMLParser from 'node-html-parser'
import webReader from '../utils/web_reader.js'
import { survivorPerk, killerPerk } from '../db/models/perk.js'

class perkJobs {
  static #addURL = 'https://deadbydaylight.fandom.com'

  // Perks
  static #perksURL = 'https://deadbydaylight.fandom.com/wiki/Perks'
  // Selectors use *= (contains) since IDs now include perk count e.g. "Survivor_Perks_(149)"
  static #survivorPerksSelector = "h3:has(span[id*='Survivor_Perks'])+table>tbody"
  static #killerPerksSelector = "h3:has(span[id*='Killer_Perks'])+table>tbody"

  static #retrievePerks (selector) {
    if (!selector) { return false }

    return new Promise((resolve, reject) => {
      webReader.readWebsite(this.#perksURL).then((data) => {
        const Perks = []
        const parsedHTML = HTMLParser.parse(data)

        const PerkTable = parsedHTML.querySelector(selector)

        if (!PerkTable) {
          reject(new Error('HTML table with perks not found.'))
          return
        }

        // Filter to only element nodes (skip text nodes)
        const tableRows = PerkTable.childNodes.filter(node => node.nodeType === 1)

        tableRows.forEach(tableRow => {
          const thElements = tableRow.querySelectorAll('th')
          const tdElements = tableRow.querySelectorAll('td')

          if (thElements.length < 2) { return }

          const iconA = thElements[0]?.querySelector('a')
          const nameA = thElements[1]?.querySelector('a')

          // Check if actual perk row (skip header row)
          if (!iconA || !nameA) { return }

          // Description is in the <td> element (no more .formattedPerkDesc class)
          const contentTd = tdElements[0]

          // Character is in the 3rd <th> element (index 2)
          const character = thElements[2]?.querySelector('a')

          // Icon URL is now in the href attribute of the <a> tag
          const perkIcon = iconA.attributes.href
          const perkName = nameA.text?.trim()
          const URIName = nameA.attributes.href?.split('/').pop()

          if (!contentTd || !perkName) { return }

          // Update internal links to be full URLs
          contentTd.querySelectorAll('a').forEach(link => {
            if (link.attributes.href && !link.attributes.href.startsWith('http')) {
              link.setAttribute('href', this.#addURL + link.attributes.href)
            }
          })

          const content = contentTd.innerHTML
          const perkData = { URIName, name: perkName, iconURL: perkIcon, content, contentText: stripHtml(content).result }

          if (character) {
            perkData.characterName = character.attributes.title
          }

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
        // Only grab perks with characters assigned
        {
          $match: {
            characterName: { $exists: true }
          }
        },
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
        // Now merge the updated cells into the table, so we also keep the perks without any characters assigned
        {
          $merge: {
            into: "survivorperks",
            whenMatched: "replace",
            whenNotMatched: "insert"
          }
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
        // Only grab perks with characters assigned
        {
          $match: {
            characterName: { $exists: true } 
          }
        },
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
        // Now merge the updated cells into the table, so we also keep the perks without any characters assigned
        {
          $merge: {
            into: "killerperks",
            whenMatched: "replace",
            whenNotMatched: "insert"
          }
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
