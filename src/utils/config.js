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
