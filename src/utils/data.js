import axios from 'axios'

export async function getGbifOccurrences(offset, name, tags) {
  let sN = (name) ? '&scientificName=' + name : ''
  let sT = ''
  if (tags.length) {
    tags.forEach(t => sT += '&iucnRedListCategory=' + t)
  }
  let response = await axios.get('https://api.gbif.org/v1/occurrence/search/?country=VE&offset=' + offset + sN +sT,
    {headers: {'Accept-Language': 'es; 0.9, en; 0.8'}})
  return response
}

export async function getSpeciesSuggestions(pre) {
  let response = await axios.get('https://api.gbif.org/v1/species/suggest?q=' + pre)
  return response
}

export async function getGbifDatasets(offset) {
  //let response = await axios.get('https://api.gbif.org/v1/dataset/?country=VE&limit=20,facet=license&facet=publishingOrg&offset=' + offset,
  let response = await axios.get('https://api.gbif.org/v1/dataset/search?q=venezuela&limit=20&facet=license&facet=publishingOrg&offset=' + offset,
    {headers: {'Accept-Language': 'es; 0.9, en; 0.8'}})
  return response
}

export async function getAllGbifDatasets() {
  //let response = await axios.get('https://api.gbif.org/v1/dataset/?country=VE&limit=20,facet=license&facet=publishingOrg&offset=' + offset,
  let response = await axios.get('https://api.gbif.org/v1/dataset/search?q=venezuela&limit=1000&facet=license&facet=publishingOrg',
    {headers: {'Accept-Language': 'es; 0.9, en; 0.8'}})
  return response
}

export async function getGbifDatasetDetail(key) {
  let dataset =  await axios.get('https://api.gbif.org/v1/dataset/' + key)
  //console.log(dataset.data)
  //if (dataset.data.geographicCoverages.length > 0)
  //  console.log(dataset.data.geographicCoverages[0].description)
  return dataset
}
