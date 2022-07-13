
<h1 align="center">Dead by Daylight - Database</h1>

<div align="center">
  <strong>Automatically updated</strong>
</div>
<div align="center">
  Fetches new information from the <a href="https://deadbydaylight.fandom.com/wiki/Dead_by_Daylight_Wiki">Dead by Daylight - Wiki</a> every hour
</div>

<br />

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-g.svg?style=flat-square"
      alt="API stability" />
  </a>
  <!-- Queries Handled -->
  <a href="https://dbdperks.herokuapp.com/stats_badge">
    <img src="https://img.shields.io/endpoint?url=https://dbdperks.herokuapp.com/stats_badge"
      alt="Queries handled" />
  </a>
  <!-- Standard -->
  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"
      alt="Standard" />
  </a>
</div>

<div align="center">
  <sub>Built with ❤︎ by
  <a href="https://github.com/Techial">Techial</a> and
  <a href="https://github.com/Techial/DBD-Database/graphs/contributors">
    contributors
  </a>
</div>

## Table of Contents
- [Features](#features)
- [API](#api)
- [Data Structure](#data-structure)
- [Support](#support)

## Features
- __organized:__ output doesn't look like it was taken out of a tumbler, thrown on the ground and stamped on
- __always up-to-date:__ fetches data from the [Dead by Daylight - Wiki](https://deadbydaylight.fandom.com/wiki/Dead_by_Daylight_Wiki) every hour

## API
Retrieve Killer Perks at:
<blockquote><a href="https://dbd.techial.net/API/v1/killer_perks">https://dbd.techial.net/API/v1/killer_perks</a></blockquote>
<br/>

Retrieve Survivor Perks at:
<blockquote><a href="https://dbd.techial.net/API/v1/survivor_perks">https://dbd.techial.net/API/v1/survivor_perks</a></blockquote>
<br/>

Retrieve Killers at:
<blockquote><a href="https://dbd.techial.net/API/v1/killers">https://dbd.techial.net/API/v1/killers</a></blockquote>
<br/>

Retrieve Survivors at:
<blockquote><a href="https://dbd.techial.net/API/v1/survivors">https://dbd.techial.net/API/v1/survivors</a></blockquote>
<br/>

## Data Structure
Perks:
```json
{
  "perks": [{
    "_id": "mongoDB generated unique ObjectID",
    "name": "Perk display name (With space and all characters)",
    "URIName": "URL safe string (name of perk)",
    "iconURL": "Perk icon URL",
    "characterName": "Name of Character perk belongs to - THIS FIELD IS OMITTED IF NO CHARACTER IS ASSOCIATED WITH THE PERK",
    "character": "ObjectID of Character perk belongs to - THIS FIELD IS OMITTED IF NO CHARACTER IS ASSOCIATED WITH THE PERK",
    "content": "Display text (with HTML elements) scraped from https://deadbydaylight.fandom.com/",
    "contentText": "Same as `content` without HTML elements"
  },
  ...
  ]
}
```

Survivors:
```json
{
  "survivors": [{
    "_id": "mongoDB generated unique ObjectID",
    "name": "Character display name (With space and all characters)",
    "URIName": "URL safe string (name of survivor)",
    "iconURL": "Character image URL",
    "link": "Character URL at https://deadbydaylight.fandom.com/"
  },
  ...
  ]
}
```

Killers:
```json
{
  "killers": [{
    "_id": "mongoDB generated unique ObjectID",
    "name": "Full Character name (With space and all characters)",
    "killerName": "Short name used in-game (e.g Trapper, Wraith etc)",
    "URIName": "URL safe string (name of Killer)",
    "iconURL": "Character image URL",
    "link": "Character URL at https://deadbydaylight.fandom.com/"
  },
  ...
  ]
}
```

## Support
Open an issue if you feel like anything needs to be added. I'll gladly review pull requests and merge them if deemed to be useful!
