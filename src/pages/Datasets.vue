<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        Datos GBIF de Venezuela<br>Juegos de datos
      </h1>
    </template>
    <br>
    <b-table style="cursor: pointer;"
      :data='gbifDatasetsData'
      :loading='loading'
      hoverable
      paginated
      :pagination-simple='true'
      backend-pagination
      :total='totalGbifDatasets'
      @page-change='gbifDatasetsOnPageChange'
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
      <b-table-column class="has-text-centered" field="geo">
        <template v-slot:header="{ column }">
          <div>Fuera de <br>rango geográfico</div>
        </template>
        <template v-slot="props">
          <span v-if="props.row.outOfRange === undefined"><font-awesome class="fa-spin" :icon="['fas', 'spinner']"/></span>
          <span v-if="props.row.outOfRange"><font-awesome style="color: #ff8c00;" :icon="['fas', 'exclamation-triangle']"/></span>
        </template>
      </b-table-column>
    </b-table>

  </Layout>
</template>


<style>

</style>

<script>
import {getGbifOccurrences, getSpeciesSuggestions, getGbifDatasets, getGbifDatasetDetail} from '~/utils/data'

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
    loadGbifDatasets(page) {
      this.loading = true
      getGbifDatasets((page-1)*20).then((result) => {
        this.gbifDatasetsData = result.data.results
        this.totalGbifDatasets = result.data.count
        this.loading = false
        this.gbifDatasetsData.forEach((ds, idx) => {
          getGbifDatasetDetail(ds.key).then((dataset) => {
            let gDS = this.gbifDatasetsData[idx]
            gDS.outOfRange = this.isGeoOutOfRange(dataset.data.geographicCoverages)
            this.$set(this.gbifDatasetsData, idx, gDS)
          })
        })
      })
    },
    gbifDatasetsOnPageChange(page) {
      this.gbifDatasetsPage = page
      this.loadGbifDatasets(page)
    },
    isGeoOutOfRange(geo) {
      for (let i=0; i<geo.length; i++) {
        return (geo[i].boundingBox.minLongitude > -59.57 || geo[i].boundingBox.maxLongitude < -73.036 || geo[i].boundingBox.maxLatitude < 0.72 || geo[i].boundingBox.minLatitude > 12.17)
      }
      return false
    }
  }
}
</script>
