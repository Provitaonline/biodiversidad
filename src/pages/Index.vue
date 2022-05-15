<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        DATOS GBIF DE VENEZUELA
      </h1>
    </template>

    <b-tabs @input="tabChanged" v-model="activeTab">
      <b-tab-item value="occurrences" active label="Registro de presencias">
        <h4 class="title is-4 has-text-centered">Registros de presencia de especies en Venezuela</h4>
        <b-field>
          <b-autocomplete style="width: 30%;"
            :data="searchAutoData"
            v-model="name"
            icon="filter"
            placeholder="Nombre científico"
            field="scientificName"
            @typing="getSpeciesSuggestions"
          >
          </b-autocomplete>
          <b-field>
            <b-taginput
              v-model="tags"
              :data="codes"
              autocomplete
              :open-on-focus="true"
              placeholder="IUCN"
            >
            </b-taginput>
          </b-field>
          <b-button type="is-primary" @click="loadGbifOccurrences()">Aplicar</b-button>
          <b-button icon-right="trash" @click="name=''; tags=[]; loadGbifOccurrences(1)"/>
        </b-field>
        <b-table
          :data='gbifOccurrencesData'
          :loading='loading'
          hoverable
          paginated
          :pagination-simple='true'
          backend-pagination
          :total='totalGbifOccurrences'
          @page-change='gbifOccurrencesOnPageChange'
        >
          <b-table-column width="30%" field="scientificName" label="Nombre científico" v-slot="props">
            <a :href="'https://gbif.org/es/occurrence/' + props.row.gbifID">{{ props.row.scientificName }}</a>
          </b-table-column>
          <b-table-column field="year" label="Año" v-slot="props">
            {{ props.row.year }}
          </b-table-column>
          <b-table-column field="iucnRedListCategory" label="Lista roja IUCN" v-slot="props">
            {{props.row.iucnRedListCategory}} - {{ iucnCodes[props.row.iucnRedListCategory] }}
          </b-table-column>
          <b-table-column field="publishingCountry" label="País que publica" v-slot="props">
            {{ props.row.publishingCountry }}
          </b-table-column>
          <b-table-column field="datasetName" label="Conjunto de datos" v-slot="props">
            <a :href="'https://gbif.org/es/dataset/' + props.row.datasetKey">{{props.row.datasetName}}</a>
          </b-table-column>
        </b-table>
      </b-tab-item>
      <b-tab-item value="datasets" label="Juegos de datos">
        <h4 class="title is-4 has-text-centered">Juegos de datos publicados de Venezuela</h4>
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
      </b-tab-item>
      <b-tab-item value="map" label="Mapa de presencias">
        <div class="columns is-gapless">
          <InteractiveMap class="column"/>
        </div>
      </b-tab-item>
    </b-tabs>

  </Layout>
</template>


<style>

</style>

<script>
import {getGbifOccurrences, getSpeciesSuggestions, getGbifDatasets, getGbifDatasetDetail} from '~/utils/data'

import InteractiveMap from '~/components/InteractiveMap.vue'

export default {
  metaInfo: {
    title: 'Prototipo GBIF'
  },
  data() {
    return {
      gbifOccurrencesData: [],
      gbifDatasetsData: [],
      activeTab: 'occurrences',
      isMapVisible: false,
      searchAutoData: [],
      name: '',
      totalGbifOccurrences: 0,
      totalGbifDatasets: 0,
      loading: false,
      gbifOccurrencesPage: 1,
      gbifDatasetsPage: 1,
      perPage: 20,
      tags: [],
      codes: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'],
      iucnCodes: {
        EX: 'Extinto',
        EW: 'Extinto',
        CR: 'En peligro crítico',
        EN: 'En peligro',
        VU: 'Vulnerable',
        NT: 'Casi amenazado',
        LC: 'Preocupación menor',
        DD: 'Datos insuficientes',
        NE: 'No evaluado'
      },
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
    InteractiveMap
  },
  mounted() {
    this.loadGbifOccurrences()
    //this.loadGbifDatasets()
  },
  methods: {
    loadGbifOccurrences(page) {
      this.loading = true
      getGbifOccurrences((page-1)*20, this.name, this.tags).then((result) => {
        this.gbifOccurrencesData = result.data.results
        this.totalGbifOccurrences = result.data.count
        this.loading = false
      })
    },
    gbifOccurrencesOnPageChange(page) {
      this.gbifOccurrencesPage = page
      this.loadGbifOccurrences(page)
    },
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
    getSpeciesSuggestions(name) {
      getSpeciesSuggestions(name).then((result) => {
        this.searchAutoData = result.data
      })
    },
    isGeoOutOfRange(geo) {
      for (let i=0; i<geo.length; i++) {
        return (geo[i].boundingBox.minLongitude > -59.57 || geo[i].boundingBox.maxLongitude < -73.036 || geo[i].boundingBox.maxLatitude < 0.72 || geo[i].boundingBox.minLatitude > 12.17)
      }
      return false
    },
    tabChanged() {
      if (this.activeTab === 'datasets' && this.gbifDatasetsData.length === 0) this.loadGbifDatasets()

      if (this.activeTab === 'map') {
        this.$nextTick(() => window.dispatchEvent(new Event('resize')))
      }
    }
  }
}
</script>
