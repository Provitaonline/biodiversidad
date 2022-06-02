import axios from 'axios'

export async function getGbifOccurrences(offset, name, tags) {
  let sN = (name) ? '&scientificName=' + name : ''
  let sT = ''
  if (tags.length) {
    tags.forEach(t => sT += '&iucnRedListCategory=' + t)
  }
  let response = await axios.get('https://api.gbif.org/v1/occurrence/search?country=VE&facet=type&offset=' + offset + sN +sT,
    {headers: {'Accept-Language': 'es; 0.9, en; 0.8'}})

  return response
}

export async function getSpeciesSuggestions(pre) {
  let response = await axios.get('https://api.gbif.org/v1/species/suggest?q=' + pre)
  return response
}

export async function getGbifDatasets(offset) {
  let response = await axios.get('https://api.gbif.org/v1/dataset/search?q=venezuela&limit=20&facet=license&facet=publishingOrg&offset=' + offset,
    {headers: {'Accept-Language': 'es; 0.9, en; 0.8'}})
  return response
}

export async function getAllGbifDatasets() {
  let response = await axios.get('https://api.gbif.org/v1/dataset/search?q=venezuela&limit=1000&facet=license&facet=publishingOrg',
    {headers: {'Accept-Language': 'es; 0.9, en; 0.8'}})

  if (!response.data.endOfRecords) console.log('Fix this: there are more than 1000 datasets')
  return response
}

export async function getGbifDatasetDetail(key) {
  let dataset =  await axios.get('https://api.gbif.org/v1/dataset/' + key)
  return dataset
}

export async function getGbifDatasetSpecies(key) {
  let species =  await axios.get('https://api.gbif.org/v1/species/search/?datasetKey=' + key + '&rank=GENUS&limit=1000')
  return species
}

export async function getGbifOccurrenceTaxonomies(rank, taxonKey) {
  //let result =  await axios.get('https://www.gbif.org/api/occurrence/breakdown?country=VE&limit=100&dimension=' + rank + 'Key' + ((taxonKey) ? '&taxon_key=' + taxonKey : ''))

  let response =  await axios.get('/.netlify/functions/gbiftaxonomy?country=VE&limit=100&dimension=' + rank + 'Key' + ((taxonKey !== undefined) ? '&taxon_key=' + taxonKey : ''))

  //console.log(response)

  let result = response.data.results.map(r => {
    return {taxon: r.displayName, count: r.count, taxonKey: r.filter[rank + '_key']}
  })


  return result
}
