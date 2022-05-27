<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        Datos GBIF de Venezuela<br>Juegos de datos
      </h1>
    </template>
    <br>
    <b-table style="cursor: pointer;"
      :data='filteredGbifDatasetsData'
      :loading='loading'
      hoverable
      paginated
      :perPage='perPage'
      :pagination-simple='true'
    >
      <b-table-column width="50%" field="title" label="Título" v-slot="props">
        <a :href="'https://gbif.org/es/dataset/' + props.row.key">{{ props.row.title }}</a>
      </b-table-column>
      <b-table-column field="type" label="Tipo" v-slot="props">
        {{ datasetTypes[props.row.type] }}
      </b-table-column>
      <b-table-column field="publishingOrganizationTitle" label="Organización" v-slot="props">
        {{ props.row.publishingOrganizationTitle }}
      </b-table-column>
    </b-table>

  </Layout>
</template>


<style>

</style>

<script>
import {getGbifOccurrences, getSpeciesSuggestions, getAllGbifDatasets, getGbifDatasetDetail, getGbifDatasetSpecies} from '~/utils/data'

import InteractiveMap from '~/components/InteractiveMap.vue'

export default {
  metaInfo() {
    return {
      title: this.$t('label.datasets'),
      titleTemplate: '%s - ' + this.$t('label.site')
    }
  },
  data() {
    return {
      gbifDatasetsData: [],
      totalGbifDatasets: 0,
      loading: false,
      gbifDatasetsPage: 1,
      taxonomicGroups: {
        order: {},
        family: {},
        genus: {}
      },
      perPage: 20,
      tags: [],
      datasetTypes: {
        OCCURRENCE: 'Registro',
        CHECKLIST: 'Lista de especies',
        SAMPLING_EVENT: 'Evento de muestreo',
        METADATA: 'Metadatos',
        undefined: 'Desconocido'
      },
      selectedOptions: []
    }
  },
  components: {
  },
  mounted() {
    this.loadGbifDatasets()
  },
  methods: {
    async loadGbifDatasets() {
      this.loading = true
      let result = await getAllGbifDatasets()
      this.gbifDatasetsData = result.data.results
      this.totalGbifDatasets = result.data.count
      this.loading = false
      let count = this.gbifDatasetsData.length
      this.gbifDatasetsData.forEach(async (ds, idx) => {
        let dataset = await getGbifDatasetDetail(ds.key)
        let gDS = this.gbifDatasetsData[idx]
        //if (dataset.data.taxonomicCoverages.length) {
          /*dataset.data.taxonomicCoverages.forEach(tc => {
            tc.coverages.forEach(t => {
              if (t.scientificName) {
                if (!this.taxons[t.scientificName]) {
                  this.taxons[t.scientificName] = [ds.key]
                } else {
                  this.taxons[t.scientificName].push(ds.key)
                }
              }
            })
          }) */
          if (ds.type === 'CHECKLIST') {
            getGbifDatasetSpecies(ds.key).then((s) => {
              s.data.results.forEach(r => {

                Object.keys(this.taxonomicGroups).forEach(rank => {
                  if (r[rank]) {
                    if (!this.taxonomicGroups[rank][r[rank]]) {
                      this.taxonomicGroups[rank][r[rank]] = {}
                    }
                    this.taxonomicGroups[rank][r[rank]][ds.key] = true
                  }
                })
              })
            })
          }
        //}
        gDS.outOfRange = this.isGeoOutOfRange(dataset.data.geographicCoverages)
        this.$set(this.gbifDatasetsData, idx, gDS)
        count--
        if (count === 0) console.log(this.taxonomicGroups)
      })
    },
    isGeoOutOfRange(geo) {
      for (let i=0; i<geo.length; i++) {
        return (geo[i].boundingBox.minLongitude > -59.57 || geo[i].boundingBox.maxLongitude < -73.036 || geo[i].boundingBox.maxLatitude < 0.72 || geo[i].boundingBox.minLatitude > 12.17)
      }
      return false
    }
  },
  computed: {
    filteredGbifDatasetsData() {
      return this.gbifDatasetsData.filter(d => !d.outOfRange)
    }
  }
}
</script>
