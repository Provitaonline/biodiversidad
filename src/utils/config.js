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
      institution {
        name
        key
      }
      datasetTitle
      publisherTitle,
      dataset {
        citation {
          text
        }
      }
      institutionCode
      gadm
      gbifClassification {
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
    }
  }`,
  dataset: `query dataset($key: ID!){
    dataset(key: $key) {
      key
      title
      created
      pubDate
      description
      temporalCoverages
      logoUrl
      publishingOrganizationKey
      publishingOrganizationTitle
      volatileContributors {
        firstName
        lastName
        position
        organization
        address
        userId
        email
        type
        _highlighted
        roles
      }
      geographicCoverages {
        description
        boundingBox {
          minLatitude
          maxLatitude
          minLongitude
          maxLongitude
          globalCoverage
        }
      }
      taxonomicCoverages {
        description
        coverages {
          scientificName
          rank {
            interpreted
          }
        }
      }
      bibliographicCitations {
        identifier
        text
      }
      samplingDescription {
        studyExtent
        sampling
        qualityControl
        methodSteps
      }
      citation {
        text
      }
      license
    }
  }`
}

export const licenseTypes = {
  'http://creativecommons.org/licenses/by-nc/4.0/legalcode': 'CC BY-NC 4.0',
  'http://creativecommons.org/publicdomain/zero/1.0/legalcode': 'CC0 1.0',
  'http://creativecommons.org/licenses/by/4.0/legalcode': 'CC BY 4.0',
}

export const riskColors = {
  'Extinto': '#060000',
  'Extinto a Nivel Regional': '#970f11',
  'En Peligro Crítico': '#E91C1F',
  'En Peligro': '#FFA500',
  'Vulnerable': '#FFFF00'
}
