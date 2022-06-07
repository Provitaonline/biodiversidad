const axios = require('axios')

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

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
