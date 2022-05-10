const HTMLParser = require('node-html-parser')
const webReader = require('../utils/web_reader')
const { survivorPerk, killerPerk } = require('../db/models/perk')

class perkJobs {
  static #addURL = 'https://deadbydaylight.fandom.com'
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
          let characterLink = ''
          let characterImage = ''

          if (character) { // Check if character exists, otherwise assume perk belongs to all
            characterName = character.attributes.title
            characterLink = this.#addURL + character.attributes.href
            characterImage = tableRow.querySelectorAll('th')[2].querySelectorAll('a')[1].attributes.href
          }

          const perkData = { URIName, name: perkName, iconURL: perkIcon, characterName, characterURL: characterLink, characterImageURL: characterImage, content }

          Perks.push(perkData)
        })

        if (Perks.length) { resolve(Perks) } else { reject(new Error('No perks found.')) }
      })
    })
  }

  static retrieveSurvivorPerks () {
    this.#retrievePerks(this.#survivorPerksSelector).then((perkData) => {
      perkData.forEach(perk => {
        survivorPerk.findOneAndUpdate({ name: perk.name }, perk, { new: true, upsert: true }, () => {})
      })

      console.log('Successfully fetched Survivor perks.')
    }).catch(() => {
      console.log('Fetching Survivor perks failed!')
    })
  }

  static retrieveKillerPerks () {
    this.#retrievePerks(this.#killerPerksSelector).then((perkData) => {
      perkData.forEach(perk => {
        killerPerk.findOneAndUpdate({ name: perk.name }, perk, { new: true, upsert: true }, () => {})
      })

      console.log('Successfully fetched Killer perks.')
    }).catch(() => {
      console.log('Fetching Killer perks failed!')
    })
  }

  static updateKillerAndSurvivorPerks () {
    console.log('Updating perk database...')
    this.retrieveSurvivorPerks()
    this.retrieveKillerPerks()
  }
}

module.exports = perkJobs
