export const awsConfig = {
  bucket: 'geoportalp-files',
  region: 'us-east-2'
}

export const mapConfig = {
  styles: [
    {
      title: 'topo',
      uri:'/mapstyles/topo.json'
    },
    {
      title: 'gbif-natural',
      uri:'/mapstyles/gbif-natural.json'
    },
    {
      title: 'osm',
      uri:'/mapstyles/osm.json'
    },
    {
      title: 'simple',
      uri:'/mapstyles/simple.json'
    },
    {
      title: 'ng',
        uri:'/mapstyles/ng.json'
    },
    {
      title: 'satellite',
      uri:'/mapstyles/satellite.json'
    }
  ],
  mapCenter: [-66.58, 8.42],
  mapZoom: 5,
  maxBounds: [[-82, -3], [-54, 20]],
  maxZoom: 14,
  mapBearing: 0,
  mapPitch: 0,
  vectorTilesBaseUrl: 'https://' + awsConfig.bucket + '.s3-' + awsConfig.region + '.amazonaws.com/vtiles/',
  rasterTilesBaseUrl: 'https://' + awsConfig.bucket + '.s3-' + awsConfig.region + '.amazonaws.com/rtiles/'
}

export const gbifGraphQlQuery = {
  occurrence: `query occurrence($key: ID!){
    occurrence(key: $key) {
      key
      coordinates
      coordinateUncertaintyInMeters
      countryCode
      country
      eventDate
      typeStatus
      issues
      datasetKey
      basisOfRecord
      locality
      institution {
        name
        key
      }
      collection {
        name
        key
      }
      volatile {
        globe(sphere: false, land: false, graticule: false) {
          svg
          lat
          lon
        }
        features {
          isSpecimen
          isTreament
          isSequenced
          isClustered
          isSamplingEvent
        }
      }
      datasetKey,
      datasetTitle
      publishingOrgKey,
      publisherTitle,
      dataset {
        citation {
          text
        }
      }
      institutionCode
      recordedByIDs {
        value
        person(expand: true) {
          name
          birthDate
          deathDate
          image
        }
      }
      identifiedByIDs {
        value
        person(expand: true) {
          name
          birthDate
          deathDate
          image
        }
      }
      gadm
      stillImageCount
      movingImageCount
      soundCount
      stillImages {
        type
        format
        identifier
        created
        creator
        license
        publisher
        references
        rightsHolder
        description
      }
      gbifClassification {
        kingdom
        kingdomKey
        phylum
        phylumKey
        class
        classKey
        order
        orderKey
        family
        familyKey
        genus
        genusKey
        species
        speciesKey
        synonym
        classification {
          key
          rank
          name
        }
        usage {
          rank
          formattedName
          key
        }
        acceptedUsage {
          formattedName
          key
        }
      }
      primaryImage {
        identifier
      }
      terms {
        simpleName
        verbatim
        value
        htmlValue
        remarks
        issues
      }
    }
  }`
}
