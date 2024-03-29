function isCacheExpired() {
  const cacheDate = localStorage.getItem('gbifCacheDate')
  if (cacheDate && (new Date().getTime() - new Date(cacheDate).getTime()) < 86400000) return false
  localStorage.setItem('gbifCacheDate', new Date().toString())
  return true
}

async function checkCacheAge() {
  if (isCacheExpired()) {
    await caches.delete('gbif-cache')
  }
}

export function filtersToParms(filters) {
  let parms = ''
  if (filters) {
    Object.keys(filters).forEach(f => {
      if (Array.isArray(filters[f])) {
        filters[f].forEach(el => { if (el) parms += '&' + f + '=' + el})
      } else {
        if (filters[f] !== undefined) parms += '&' + f + '=' + filters[f]
      }
    })
  }
  return parms
}

export async function getGbifOccurrences(offset, filters, locale) {

  let response = await fetch('https://api.gbif.org/v1/occurrence/search?country=VE&offset=' + offset + filtersToParms(filters) + '&locale=' + locale,
    {headers: {'Accept-Language': locale}})

  response = await response.json()
  return response
}

export async function getGbifDataset(key, locale) {

  let response = await fetch('https://api.gbif.org/v1/dataset/' + key,
    {headers: {'Accept-Language': locale}})

  response = await response.json()
  console.log(response)
  return response
}

export async function getGbifGraphQLData(query, key, locale) {

  let response = await fetch('https://graphql.gbif.org/graphql/?query=' + query + '&variables={"key":"' + key + '"}',
    {headers: {'Accept-Language': locale}})

  response = await response.json()

  return response.data
}

export async function getSpeciesSuggestions(pre) {
  let response = await fetch('https://api.gbif.org/v1/species/suggest?q=' + pre)
  response = await response.json()
  return response
}

export async function getAllGbifDatasets(locale) {
  await checkCacheAge()

  const cache = await caches.open('gbif-cache')

  const limit = 1000
  let offset = 0
  let finalResult = {count: 0, results: []}
  let endOfRecords = false

  do {
    let request = new Request (`https://api.gbif.org/v1/dataset/search?q=venezuela&limit=${limit}&offset=${offset}&locale=${locale}`,
      {headers: {'Accept-Language': locale}})

    let response = await cache.match(request)

    if (!response) {
      await cache.add(request)
      response = await cache.match(request)
    }

    response = await response.json()

    finalResult.count = response.count
    finalResult.results.push(...response.results)

    offset += response.results.length
    endOfRecords = response.endOfRecords
  } while (!endOfRecords)

  return finalResult
}

export async function getGbifDatasetDetail(key) {
  const cache = await caches.open('gbif-cache')

  let url = 'https://api.gbif.org/v1/dataset/' + key

  let dataset = await cache.match(url)

  if (!dataset) {
    await cache.add(url)
    dataset = await cache.match(url)
  }

  dataset = await dataset.json()
  return dataset
}

export async function getGbifDatasetSpecies(key) {

  let species =  await fetch('https://api.gbif.org/v1/species/search/?datasetKey=' + key + '&rank=GENUS&limit=1000')

  species = await species.json()
  return species

}

export async function getTaxonName(taxonKey) {
  let response = await fetch('https://api.gbif.org/v1/species/' + taxonKey)

  response = await response.json()

  return response
}

export async function getGbifOccurrenceTaxonomies(rank, taxonKey) {

  let response = await fetch('https://api.gbif.org/v1/occurrence/search?country=VE&facetLimit=100&limit=0&facet=' + rank + 'Key' + ((taxonKey !== undefined) ? '&taxonKey=' + taxonKey : ''))

  response = await response.json()

  let result = []
  let taxonNamePromises = []

  async function taxonNamePromise(c) {
    let taxonName = await getTaxonName(c.name)
    return {taxon: taxonName.canonicalName ? taxonName.canonicalName : taxonName.scientificName, count: c.count, taxonKey: taxonName.key}
  }

  response.facets[0].counts.forEach(c => {
    taxonNamePromises.push(taxonNamePromise(c))
  })

  result = await Promise.all(taxonNamePromises)

  result = result.sort((a, b) => {
    const aTaxon = a.taxon.toUpperCase()
    const bTaxon = b.taxon.toUpperCase()
    if (aTaxon < bTaxon) return -1
    if (aTaxon > bTaxon) return 1
    return 0
  })

  return(result)

}

export function getSavedTaxonomicGroups() {
  const savedDate = localStorage.getItem('taxonomicGroupsSavedDate')
  if (savedDate && (new Date().getTime() - new Date(savedDate).getTime()) < 86400000) {
    let taxonomicGroups = localStorage.getItem('taxonomicGroups')
    if (taxonomicGroups) return JSON.parse(taxonomicGroups)
  }
  localStorage.removeItem('taxonomicGroups')
  return null
}

export function saveTaxonomicGroups(taxonomicGroups) {
  localStorage.setItem('taxonomicGroups', JSON.stringify(taxonomicGroups))
  localStorage.setItem('taxonomicGroupsSavedDate', new Date().toString())
}
