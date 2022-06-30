<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.datasetsContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <br>
    <div class="filter-container">
      <div class="rank-selector">
        <div class="taxonomic-filter-label">
          <b><small>{{$t('label.taxonomicfilter')}}:</small></b>
        </div>
        <b-field>
          <b-select size="is-small" v-model="selectedTaxonomicGroup" @input=" taxonomicGroupFilter = ''; applyFilters = false">
            <option
                v-for="option in Object.keys(taxonomicGroups)"
                :value="option"
                :key="option">
                {{ $t('label.' + option) }}
            </option>
          </b-select>
        </b-field>
      </div>
      <div class="taxonomy-select">
        <b-field>
          <b-autocomplete
            size="is-small"
            :data="taxonomicGroup"
            v-model="taxonomicGroupFilter"
            icon="filter"
            :placeholder="$t('label.selectone')"
            :disabled="!taxonomicGroupsReady"
            :open-on-focus="true"
            keep-first
            clearable
          >
          </b-autocomplete>
        </b-field>
      </div>
      <div class="apply-filter">
        <b-field >
          <b-checkbox size="is-small" v-model="applyFilters" :disabled="!isInTaxonomicGroup()">
            {{ $t('label.applyfilter') }}
          </b-checkbox>

          <div class="loading-indicator">
            <div v-show="!taxonomicGroupsReady">
              <font-awesome class="fa-spin" :icon="['fas', 'spinner']"/>
              <small><i> {{ $t('label.loadingnames') }}</i></small>
            </div>
          </div>
        </b-field>
      </div>
    </div>
    <br>
    <div class="is-size-5 has-text-weight-semibold total-heading">
      {{$t('label.numberofitems')}}: {{ $n(numItems()) }}
    </div>
    <b-table
      ref="table"
      :data='filteredGbifDatasetsData'
      :loading='loading'
      hoverable
      paginated
      detailed
      :perPage='perPage'
      :pagination-simple='false'
    >
      <b-table-column searchable sortable width="50%" field="title" :label="$t('label.title')">
        <template v-slot="props">
          <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/dataset/' + props.row.key">{{ props.row.title }}</a>
        </template>
        <template #searchable="props">
          <b-input v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable sortable field="publishingOrganizationTitle" :label="$t('label.organization')">
        <template v-slot="props">
          {{ props.row.publishingOrganizationTitle }}
        </template>
        <template #searchable="props">
          <b-input v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable sortable field="typeExpanded" :label="$t('label.type')">
        <template v-slot="props">
          {{ props.row.typeExpanded }}
        </template>
        <template #searchable="props">
          <b-input v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable sortable field="licenseShort" :label="$t('label.license')">
        <template v-slot="props">
          {{ props.row.licenseShort }}
        </template>
        <template #searchable="props">
          <b-input v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>

      <template #detail="props">
        <div>
          <div v-html="props.row.description"></div>
          <br>
          <small><b>{{ $t('label.pubdate') }}: </b>{{ $d(new Date(props.row.pubDate)) }}</small>
        </div>
      </template>
    </b-table>

  </Layout>
</template>


<style lang="scss" scoped>
  @import "~/assets/style/_variables";

  .filter-container {
    display: flex;
    align-items: center;
    border: 1px;
    border-color: #dbdbdb;
    border-style: solid;
    border-radius: 2px;
  }

  .taxonomy-select {
    padding: 4px;
    width: 15rem;
  }

  .apply-filter {
    display: flex;
    align-items: center;
    padding: 4px;
  }

  .loading-indicator {
    width: 8rem;
  }

  .rank-selector {
    display: flex;
    align-items: center;
    padding: 4px;
  }

  .taxonomic-filter-label {
    padding-right: 6px;
  }

  @media only screen and (max-width: 600px) {
    .filter-container {
      flex-direction: column;
      align-items: stretch;
    }
    .taxonomy-select {
      width: 100%;
    }
  }

  .total-heading {
    background-color: white;
    border-bottom-style: solid;
    border-bottom-color: #DBDBDB;
  }

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
import {getAllGbifDatasets, getGbifDatasetDetail, getGbifDatasetSpecies, getSavedTaxonomicGroups, saveTaxonomicGroups} from '~/utils/data'

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
        kingdom: {},
        phylum: {},
        class: {},
        order: {},
        family: {},
        genus: {}
      },
      taxonomicGroupFilter: '',
      applyFilters: false,
      taxonomicGroupsReady: false,
      selectedTaxonomicGroup: 'order',
      perPage: 24,
      tags: [],
      datasetTypes: {
        OCCURRENCE: {es: 'Registro', en: 'Occurrence'},
        CHECKLIST: {es: 'Lista de especies', en: 'Checklist'},
        SAMPLING_EVENT: {es: 'Evento de muestreo', en: 'Sampling event'},
        METADATA: {es: 'Metadatos', en: 'Metadata'},
        undefined: {es: 'Desconocido', en: 'Undefined'}
      },
      licenseTypes: {
        'http://creativecommons.org/licenses/by-nc/4.0/legalcode': 'CC BY-NC 4.0',
        'http://creativecommons.org/publicdomain/zero/1.0/legalcode': 'CC0 1.0',
        'http://creativecommons.org/licenses/by/4.0/legalcode': 'CC BY 4.0',
      },
      selectedOptions: []
    }
  },
  components: {
  },
  mounted() {
    this.loadGbifDatasets()
    this.$eventBus.$on('localechanged', (locale) => {
      this.loadGbifDatasets()
    })
  },
  methods: {
    async loadGbifDatasets() {
      this.loading = true
      let result = await getAllGbifDatasets(this.$i18n.locale.substr(0, 2))
      this.gbifDatasetsData = result.results

      this.gbifDatasetsData.forEach((ds, idx) => {
        this.gbifDatasetsData[idx].typeExpanded = this.datasetTypes[ds.type][this.$i18n.locale.substr(0, 2)]
        this.gbifDatasetsData[idx].licenseShort = this.licenseTypes[ds.license]
      })

      this.totalGbifDatasets = result.count
      this.loading = false

      // Retrieve cached taxonomicGroups
      let savedTaxonomicGroups = getSavedTaxonomicGroups()

      let getSpeciesPromises = []
      this.gbifDatasetsData.forEach(async (ds, idx) => {
        if (!savedTaxonomicGroups) {
          if (ds.type === 'CHECKLIST') {
            getSpeciesPromises.push(function() {return getGbifDatasetSpecies(ds.key)}())
          }
        }
        let dataset = await getGbifDatasetDetail(ds.key)
        let gDS = this.gbifDatasetsData[idx]
        gDS.outOfRange = this.isGeoOutOfRange(dataset.geographicCoverages)
        gDS.pubDate = dataset.pubDate
        this.$set(this.gbifDatasetsData, idx, gDS)
      })
      if (!savedTaxonomicGroups) {
        Promise.all(getSpeciesPromises).then((speciesData) => {
          speciesData.forEach(s => {
            s.results.forEach(r => {
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
          saveTaxonomicGroups(this.taxonomicGroups)
          this.taxonomicGroupsReady = true
        })
      } else {
        // Ok, we will use the cached taxonomicGroups data
        // Data structure needs to be reactive, hence the nested loops below
        Object.keys(savedTaxonomicGroups).forEach(rank => {
          Object.keys(savedTaxonomicGroups[rank]).forEach(name => {
            Object.keys(savedTaxonomicGroups[rank][name]).forEach(datasetKey => {
              if (!this.taxonomicGroups[rank][name]) {
                this.$set(this.taxonomicGroups[rank], name, {})
              }
              this.$set(this.taxonomicGroups[rank][name], datasetKey, true)
            })
          })
        })
        this.taxonomicGroupsReady = true
      }
    },
    isGeoOutOfRange(geo) {
      for (let i=0; i<geo.length; i++) {
        return (geo[i].boundingBox.minLongitude > -59.57 || geo[i].boundingBox.maxLongitude < -73.036 || geo[i].boundingBox.maxLatitude < 0.72 || geo[i].boundingBox.minLatitude > 12.17)
      }
      return false
    },
    isInTaxonomicGroup() {
      return Object.keys(this.taxonomicGroups[this.selectedTaxonomicGroup]).includes(this.taxonomicGroupFilter)
    },
    numItems() {
      if (this.$refs.table) return this.$refs.table.newDataTotal
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
