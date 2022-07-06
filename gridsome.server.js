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

  // Load markdown so the client doesn't have to do it
  api.loadSource(({ addSchemaResolvers }) => {
    addSchemaResolvers({
      AboutContent: {
        summaryText(obj) {
          obj.summaryText.en = marked(obj.summaryText.en)
          obj.summaryText.es = marked(obj.summaryText.es)
          return obj.summaryText
        }
      }
    })
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
