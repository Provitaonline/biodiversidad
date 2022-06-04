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
  let response = await fetch('https://api.gbif.org/v1/dataset/search?q=venezuela&limit=1000&facet=license&facet=publishingOrg',
    {headers: {'Accept-Language': 'es; 0.9, en; 0.8'}})

  response = await response.json()
  if (!response.endOfRecords) console.log('Fix this: there are more than 1000 datasets')
  return response
}

export async function getGbifDatasetDetail(key) {
  let dataset =  await fetch('https://api.gbif.org/v1/dataset/' + key)

  dataset = await dataset.json()
  return dataset
}

export async function getGbifDatasetSpecies(key) {
  let species =  await fetch('https://api.gbif.org/v1/species/search/?datasetKey=' + key + '&rank=GENUS&limit=1000')

  species = await species.json()
  return species
}

export async function getGbifOccurrenceTaxonomies(rank, taxonKey) {
  //let result =  await axios.get('https://www.gbif.org/api/occurrence/breakdown?country=VE&limit=100&dimension=' + rank + 'Key' + ((taxonKey) ? '&taxon_key=' + taxonKey : ''))

  console.log(rank)
  let response =  await fetch('/.netlify/functions/gbiftaxonomy?country=VE&limit=100&dimension=' + rank + 'Key' + ((taxonKey !== undefined) ? '&taxon_key=' + taxonKey : ''))
  response = await response.json()

  let result = response.results.map(r => {
    //return {taxon: r._resolved.canonicalName, count: r.count, taxonKey: r.filter[rank + '_key']}
    return {taxon: r._resolved.canonicalName ? r._resolved.canonicalName : r.displayName, count: r.count, taxonKey: r.filter[rank + '_key']}

  })

  return result
}
