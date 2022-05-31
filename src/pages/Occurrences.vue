<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        Datos GBIF de Venezuela<br>Registros de presencia de especies
      </h1>
    </template>
    <br>
    <b-field>
      <div style="align-self: center">
        <b><small>{{$t('label.filters')}}:&nbsp</small></b>
      </div>
      <b-autocomplete size="is-small" style="width: 20%;"
        :data="searchAutoData"
        v-model="name"
        icon="filter"
        placeholder="Nombre científico"
        field="scientificName"
        @typing="getSpeciesSuggestions"
        @input="clearApplyFilters()"
        clearable
      >
      </b-autocomplete>
      <b-taginput
        size="is-small"
        v-model="tags"
        icon="filter"
        :data="codes"
        autocomplete
        :open-on-focus="true"
        placeholder="IUCN"
        clearable
        @input="clearApplyFilters()"
      >
      </b-taginput>
      &nbsp&nbsp
      <b-checkbox size="is-small" v-model="applyFilters" @input="applyFilterChange()">
        {{ $t('label.applifilters') }}
      </b-checkbox>
      <!-- <b-button size="is-small" type="is-primary" @click="loadGbifOccurrences()">Aplicar</b-button>
      <b-button size="is-small" icon-right="trash" @click="name=''; tags=[]; loadGbifOccurrences(1)"/> -->
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
      <b-table-column field="datasetName" label="Juego de datos" v-slot="props">
        <a :href="'https://gbif.org/es/dataset/' + props.row.datasetKey">{{props.row.datasetName}}</a>
      </b-table-column>
    </b-table>

  </Layout>
</template>


<style>

</style>

<script>
import {getGbifOccurrences, getSpeciesSuggestions} from '~/utils/data'

export default {
  metaInfo() {
    return {
      title: this.$t('label.occurrences'),
      titleTemplate: '%s - ' + this.$t('label.site')
    }
  },
  data() {
    return {
      gbifOccurrencesData: [],
      searchAutoData: [],
      applyFilters: false,
      name: '',
      totalGbifOccurrences: 0,
      loading: false,
      gbifOccurrencesPage: 1,
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
      selectedOptions: []
    }
  },
  components: {
  },
  mounted() {
    this.loadGbifOccurrences()
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
    getSpeciesSuggestions(name) {
      getSpeciesSuggestions(name).then((result) => {
        this.searchAutoData = result.data
      })
    },
    applyFilterChange() {
      if (this.applyFilters) {
        this.loadGbifOccurrences()
      } else {
        this.name=''
        this.tags=[]
        this.loadGbifOccurrences(1)
      }
    },
    clearApplyFilters() {
      this.applyFilters = false
    }
  }
}
</script>
