<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<style lang="scss" scoped>

  #map {
    width: 100%;
    height: 70vh;
  }

</style>

<script>
  import Vue from 'vue'
  import Maplibre from 'maplibre-gl'
  import { ResetViewControl } from '~/utils/map'
  import { stripePattern } from '~/utils/misc'
  import { mapConfig } from '~/utils/config'
  import { filtersToParms } from '~/utils/data'

  export default {
    name: 'InteractiveMap',
    props: {
      filters: { type: Object, required: true },
      applyFilters: { type: Boolean, required: true }
    },
    data() {
      return {
      }
    },
    components: {
    },
    mounted() {
      if (process.isClient) {
        this.map = new Maplibre.Map({
          container: 'map',
          style: mapConfig.styles[0].uri,
          center: mapConfig.mapCenter,
          zoom: mapConfig.mapZoom,
          bearing: mapConfig.mapBearing,
          pitch: mapConfig.mapPitch,
          maxBounds: mapConfig.maxBounds,
          maxZoom: mapConfig.maxZoom
        })
        this.map.on('load',( () => {
          this.map.addControl(new Maplibre.NavigationControl(), 'top-right')
          const resetView = new ResetViewControl({
            center: mapConfig.mapCenter,
            zoom: mapConfig.mapZoom,
            bearing: mapConfig.mapBearing,
            pitch: mapConfig.mapPitch
          })
          this.map.addControl(resetView, 'top-right')
          this.map.addControl(new Maplibre.ScaleControl())
          this.addBaseLayers()
          this.addGbifLayer(this.applyFilters ? this.filters : null)
        }))
        this.map.on('click', 'gbif', this.mapClickHandler)
        this.map.on('mousemove', this.mapMouseMoveHandler)
        this.$eventBus.$on('filterchange', (applyFilters) => {
          this.removeGbifLayer()
          this.addGbifLayer(applyFilters ? this.filters : null)
        })
      }
    },
    methods: {
      addBaseLayers() {
        if (!this.map.getLayer('venezuela')) {
          this.map.addSource('venezuela', {
            type: 'vector',
            maxzoom: 10,
            tiles: [mapConfig.vectorTilesBaseUrl + 'venezuela' + '/{z}/{x}/{y}.pbf'],
            attribution: 'IGVSB'
          })
          this.map.addLayer({
            id: 'venezuela',
            type: 'line',
            source: 'venezuela',
            'source-layer': 'venezuela',
            paint: {
              'line-color': '#504f54',
              'line-dasharray': [2, 3],
              'line-width': 2
            }
          })
          stripePattern('black').then((image) => {
            if (!this.map.hasImage('pattern')) this.map.addImage('pattern', image)
            this.map.addLayer({
              id: 'esequibo-layer',
              type: 'fill',
              source: 'venezuela',
              'source-layer': 'venezuela',
              layout: {},
              filter: ['==', 'NAME', 'Territorio Esequibo'],
              paint: {
                'fill-pattern': 'pattern',
                'fill-opacity': 0.3
              }
            })
          })
        }
      },
      addGbifLayer(filters) {
        this.map.addSource('gbif', {
          type: 'vector',
          tiles: ['https://api.gbif.org/v2/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG:3857&country=VE' + filtersToParms(filters)],
          attribution: 'GBIF'
        })
        this.map.addLayer({
          id: 'gbif',
          type: 'circle',
          source: 'gbif',
          'source-layer': 'occurrence',
          paint: {
            'circle-stroke-color': '#000',
            'circle-stroke-width': 0.5,
            'circle-opacity': 0.8,
            'circle-color': {
              property: 'total',
              stops: [
                [0, '#ffa500'],
                [1000, '#ff8c00'],
                [5000, '#ff7f50'],
                [10000, '#ff4500']
              ]
            },
            'circle-radius': {
              property: 'total',
              stops: [
                [0, 4],
                [1000, 10],
                [5000, 15],
                [10000, 20],
                [30000, 25]
              ]
            }
          }
        })
      },
      removeGbifLayer() {
        if (this.map.getLayer('gbif')) this.map.removeLayer('gbif')
        if (this.map.getSource('gbif')) this.map.removeSource('gbif')
      },
      mapClickHandler(e) {
        let features = e.features
        if (features.length) {
          let coordinates = e.features[0].geometry.coordinates.slice();
          let totalTotal = features.map(o => o.properties.total).reduce((p, c) => p + c, 0)
          let description = totalTotal + ' ' + this.$t('label.record') + ((totalTotal === 1) ? '': 's');
          new Maplibre.Popup().setLngLat(coordinates).setHTML(description).addTo(this.map);
          //console.log(coordinates, features.map(o => o.properties.total).reduce((p, c) => p + c, 0), Math.max(...features.map(o => o.properties.total)))
        }
      },
      mapMouseMoveHandler(e) {
        let features = this.map.queryRenderedFeatures(e.point)
        if (features.length) {
          this.map.getCanvas().style.cursor = 'pointer'
        } else {
          this.map.getCanvas().style.cursor = ''
        }
      },
    },
    computed: {

    },
    beforeDestroy () {
      // Save map view before leaving

    }
  }

</script>
