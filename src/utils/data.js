
async function checkCacheAge() {

  // Bust the cache if older than 24 hours
  const cacheDate = localStorage.getItem('gbifCacheDate')

  if (cacheDate && (new Date().getTime() - new Date(cacheDate).getTime()) < 86400000) return

  localStorage.setItem('gbifCacheDate', new Date().toString())
  await caches.delete('gbif-cache')
}

export async function getGbifOccurrences(offset, name, tags) {
  let sN = (name) ? '&scientificName=' + name : ''
  let sT = ''
  if (tags.length) {
    tags.forEach(t => sT += '&iucnRedListCategory=' + t)
  }
  let response = await fetch('https://api.gbif.org/v1/occurrence/search?country=VE&offset=' + offset + sN +sT,
    {headers: {'Accept-Language': 'es; 0.9, en; 0.8'}})

  response = await response.json()
  return response
}

export async function getSpeciesSuggestions(pre) {
  let response = await fetch('https://api.gbif.org/v1/species/suggest?q=' + pre)
  response = await response.json()
  return response
}

export async function getAllGbifDatasets() {
  checkCacheAge()

  const cache = await caches.open('gbif-cache')

  let request = new Request ('https://api.gbif.org/v1/dataset/search?q=venezuela&limit=1000&facet=license&facet=publishingOrg',
    {headers: {'Accept-Language': 'es; 0.9, en; 0.8'}})

  let response = await cache.match(request)

  if (!response) {
    await cache.add(request)
    response = await cache.match(request)
  }

  response = await response.json()
  if (!response.endOfRecords) console.log('Fix this: there are more than 1000 datasets')
  return response
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
  const cache = await caches.open('gbif-cache')

  let url = 'https://api.gbif.org/v1/species/search/?datasetKey=' + key + '&rank=GENUS&limit=1000'

  let species = await cache.match(url)

  if (!species) { // Cache miss
    await cache.add(url)
    species = await cache.match(url)
  }

  species = await species.json()

  return species

}

export async function getGbifOccurrenceTaxonomies(rank, taxonKey) {

  let response =  await fetch('/.netlify/functions/gbiftaxonomy?country=VE&limit=100&dimension=' + rank + 'Key' + ((taxonKey !== undefined) ? '&taxon_key=' + taxonKey : ''))
  response = await response.json()

  let result = response.results.map(r => {
    return {taxon: r._resolved.canonicalName ? r._resolved.canonicalName : r.displayName, count: r.count, taxonKey: r.filter[rank + '_key']}

  })

  return result
}
