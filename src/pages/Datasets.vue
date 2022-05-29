<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.datasetsContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <br>
    <b-field>
      <b-field :label="$t('label.rank')" label-position="on-border">
        <b-select v-model="selectedTaxonomicGroup" @input=" taxonomicGroupFilter = ''; applyFilters = false">
          <option
              v-for="option in Object.keys(taxonomicGroups)"
              :value="option"
              :key="option">
              {{ $t('label.' + option) }}
          </option>
        </b-select>
      </b-field>
      <b-field :label="$t('label.scientificname')" label-position="on-border">
        <b-autocomplete
          :data="taxonomicGroup"
          v-model="taxonomicGroupFilter"
          icon="filter"
          :placeholder="$t('label.selectone')"
          :disabled="!taxonomicGroupsReady"
          :open-on-focus="true"
          clearable
        >
        </b-autocomplete>
      </b-field>
      <b-checkbox v-model="applyFilters" :disabled="!isInTaxonomicGroup()">
        {{ $t('label.applifilters') }}
      </b-checkbox>
    </b-field>
    <b-table style="cursor: pointer;"
      :data='filteredGbifDatasetsData'
      :loading='loading'
      hoverable
      paginated
      :perPage='perPage'
      :pagination-simple='true'
    >
      <b-table-column width="50%" field="title" :label="$t('label.title')" v-slot="props">
        <a :href="'https://gbif.org/es/dataset/' + props.row.key">{{ props.row.title }}</a>
      </b-table-column>
      <b-table-column field="type" :label="$t('label.type')" v-slot="props">
        {{ datasetTypes[props.row.type] }}
      </b-table-column>
      <b-table-column field="publishingOrganizationTitle" :label="$t('label.organization')" v-slot="props">
        {{ props.row.publishingOrganizationTitle }}
      </b-table-column>
    </b-table>

  </Layout>
</template>


<style>

</style>

<page-query>
  query  {
    datasetsContent (id: "datasets") {
      bannerText {
        en
        es
      }
    }
  }
</page-query>

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
      taxonomicGroupFilter: '',
      applyFilters: false,
      taxonomicGroupsReady: false,
      selectedTaxonomicGroup: 'order',
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
      let getSpeciesPromises = []
      this.gbifDatasetsData.forEach(async (ds, idx) => {
        if (ds.type === 'CHECKLIST') {
          getSpeciesPromises.push(function() {return getGbifDatasetSpecies(ds.key)}())
        }
        let dataset = await getGbifDatasetDetail(ds.key)
        let gDS = this.gbifDatasetsData[idx]
        gDS.outOfRange = this.isGeoOutOfRange(dataset.data.geographicCoverages)
        this.$set(this.gbifDatasetsData, idx, gDS)
      })
      Promise.all(getSpeciesPromises).then((speciesData) => {
        speciesData.forEach(s => {
          s.data.results.forEach(r => {
            Object.keys(this.taxonomicGroups).forEach(rank => {
              if (r[rank]) {
                let cleanName = r[rank].replace(/<[^>]*>?/gm, '') // Strip tags that exist in some entries
                if (!this.taxonomicGroups[rank][cleanName]) {
                  this.$set(this.taxonomicGroups[rank], cleanName, {})
                }
                this.$set(this.taxonomicGroups[rank][cleanName], r.datasetKey, true)
              }
            })
          })
        })
        this.taxonomicGroupsReady = true
      })
    },
    isGeoOutOfRange(geo) {
      for (let i=0; i<geo.length; i++) {
        return (geo[i].boundingBox.minLongitude > -59.57 || geo[i].boundingBox.maxLongitude < -73.036 || geo[i].boundingBox.maxLatitude < 0.72 || geo[i].boundingBox.minLatitude > 12.17)
      }
      return false
    },
    isInTaxonomicGroup() {
      return Object.keys(this.taxonomicGroups[this.selectedTaxonomicGroup]).includes(this.taxonomicGroupFilter)
    }
  },
  computed: {
    filteredGbifDatasetsData() {
      if (this.applyFilters && this.isInTaxonomicGroup()) {
        return this.gbifDatasetsData.filter(d => {
          return !d.outOfRange && Object.keys(this.taxonomicGroups[this.selectedTaxonomicGroup][this.taxonomicGroupFilter]).includes(d.key)
        })
      }
      return this.gbifDatasetsData.filter(d => !d.outOfRange)
    },
    taxonomicGroup() {
      return Object.keys(this.taxonomicGroups[this.selectedTaxonomicGroup]).sort().filter(tg => {
        return tg.toLowerCase().indexOf(this.taxonomicGroupFilter.toLowerCase()) >= 0
      })
    }
  }
}
</script>
