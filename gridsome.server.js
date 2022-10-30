const axios = require('axios')

let { marked } = require('marked')

var renderer = new marked.Renderer()
renderer.link = function(href, title, text) {
    var link = marked.Renderer.prototype.link.apply(this, arguments)
    if (link.includes('href="http')) return link.replace("<a","<a target='_blank'")
    return link
};

marked.setOptions({
    renderer: renderer
})

module.exports = function (api) {
  api.loadSource(async actions => {
    const gadm = await axios.get('https://api.gbif.org/v1/geocode/gadm/browse/VEN')

    const collection = actions.addCollection({
      typeName: 'GadmData'
    })

    for (const item of gadm.data) {
      collection.addNode({
        id: item.id,
        name: item.name
      })
    }
  })

  api.loadSource(async actions => {
    const translationsEs = await axios.get('https://www.gbif.org/api/translation.json?lang=es')
    const translationsEn = await axios.get('https://www.gbif.org/api/translation.json?lang=en')

    const collection = actions.addCollection({
      typeName: 'GbifTranslations'
    })

    collection.addNode({
      id: 'basisOfRecord',
      en: JSON.stringify(translationsEn.data.basisOfRecord),
      es: JSON.stringify(translationsEs.data.basisOfRecord)
    })

    collection.addNode({
      id: 'country',
      en: JSON.stringify(translationsEn.data.country),
      es: JSON.stringify(translationsEs.data.country)
    })

    collection.addNode({
      id: 'role',
      en: JSON.stringify(translationsEn.data.role),
      es: JSON.stringify(translationsEs.data.role)
    })
  })

  // Load markdown so the client doesn't have to do it
  api.loadSource(({ addSchemaResolvers }) => {
    console.log('Add schema resolvers')
    addSchemaResolvers({
      AboutContent: {
        provita(obj) {
          obj.provita.en = marked(obj.provita.en)
          obj.provita.es = marked(obj.provita.es)
          return obj.provita
        },
        mission(obj) {
          obj.mission.en = marked(obj.mission.en)
          obj.mission.es = marked(obj.mission.es)
          return obj.mission
        },
        values(obj) {
          obj.values.en = marked(obj.values.en)
          obj.values.es = marked(obj.values.es)
          return obj.values
        },
        terms(obj) {
          obj.terms.en = marked(obj.terms.en)
          obj.terms.es = marked(obj.terms.es)
          return obj.terms
        },
        contact(obj) {
          obj.contact.en = marked(obj.contact.en)
          obj.contact.es = marked(obj.contact.es)
          return obj.contact
        },
        address1(obj) {
          obj.address1.en = marked(obj.address1.en)
          obj.address1.es = marked(obj.address1.es)
          return obj.address1
        },
        address2(obj) {
          obj.address2.en = marked(obj.address2.en)
          obj.address2.es = marked(obj.address2.es)
          return obj.address2
        }
      },
      HomeContent: {
        intro(obj) {
          obj.intro.en = marked(obj.intro.en)
          obj.intro.es = marked(obj.intro.es)
          return obj.intro
        },
        cards(obj) {
          return obj.cards.map(c => {
            c.summary.en = marked(c.summary.en)
            c.summary.es = marked(c.summary.es)
            return c
          })
        }
      },
      EcosystemsContent: {
        summaryText(obj) {
          obj.summaryText.en = marked(obj.summaryText.en)
          obj.summaryText.es = marked(obj.summaryText.es)
          return obj.summaryText
        }
      },
      FaunaRbContent: {
        summaryText(obj) {
          obj.summaryText.en = marked(obj.summaryText.en)
          obj.summaryText.es = marked(obj.summaryText.es)
          return obj.summaryText
        },
        chartHelpText(obj) {
          obj.chartHelpText.en = marked(obj.chartHelpText.en)
          obj.chartHelpText.es = marked(obj.chartHelpText.es)
          return obj.chartHelpText
        }
      }
    })
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
