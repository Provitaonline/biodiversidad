<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.datasetsContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <b-loading :is-full-page="false" v-model="isDataLoading"></b-loading>
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
    <div style="display: flex;" class="total-heading">
      <div class="is-size-5 has-text-weight-semibold" style="margin-top: auto; margin-bottom: auto;">
        {{$t('label.numberofitems')}}: {{ $n(numItems()) }}
      </div>
      <a style="margin-top: auto; margin-bottom: auto; padding: 8px;" @click="clearFilters()"><font-awesome size="sm" :icon="['fas', 'trash']"/></a>
      <span class="is-size-7" style="margin-top: auto; margin-bottom: auto;">{{ $t('label.clearfilters') }}</span>
    </div>
    <b-table
      ref="table"
      :data='filteredGbifDatasetsData'
      :loading='loading'
      hoverable
      paginated
      :current-page="gbifDatasetsPage"
      @page-change="pageChanged"
      :perPage="perPage"
      :pagination-simple="false"
    >
      <b-table-column searchable sortable width="50%" field="title" :label="$t('label.title')">
        <template v-slot="props">
          <a @click="openDatasetDetails(props.row)" href="">{{ props.row.title }}</a>
        </template>
        <template #searchable="props">
          <b-input class="search-field" @input="columnFiltersChange()" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''; columnFiltersChange();" />
        </template>
      </b-table-column>
      <b-table-column searchable sortable field="pubDate" :label="$t('label.year')">
        <template v-slot="props">
          {{ props.row.pubDate ? props.row.pubDate.substr(0, 4) : $t('label.notavailable') }}
        </template>
        <template #searchable="props">
          <b-input @input="columnFiltersChange()" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''; columnFiltersChange();" />
        </template>
      </b-table-column>
      <b-table-column searchable sortable field="publishingOrganizationTitle" :label="$t('label.organization')">
        <template v-slot="props">
          {{ props.row.publishingOrganizationTitle }}
        </template>
        <template #searchable="props">
          <b-input @input="columnFiltersChange()" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''; columnFiltersChange();" />
        </template>
      </b-table-column>
      <b-table-column searchable sortable field="typeExpanded" :label="$t('label.type')">
        <template v-slot="props">
          {{ props.row.typeExpanded }}
        </template>
        <template #searchable="props">
          <b-input @input="columnFiltersChange()" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''; columnFiltersChange();" />
        </template>
      </b-table-column>
      <b-table-column searchable sortable field="licenseShort" :label="$t('label.license')">
        <template v-slot="props">
          {{ props.row.licenseShort }}
        </template>
        <template #searchable="props">
          <b-input @input="columnFiltersChange()" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''; columnFiltersChange();" />
        </template>
      </b-table-column>
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

  ::v-deep .top.level {
    padding-bottom: 24px;
  }

  .search-field {
    padding-bottom: 1rem;
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
import {getAllGbifDatasets, getGbifDatasetDetail, getGbifDatasetSpecies, getSavedTaxonomicGroups, saveTaxonomicGroups, getGbifGraphQLData} from '~/utils/data'
import {gbifGraphQlQuery} from '~/utils/config'

import DatasetDetails from '~/components/DatasetDetails.vue'

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
      isDataLoading: false,
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
      selectedOptions: [],
      isPropertyChangesEnabled: false
    }
  },
  components: {
  },
  mounted() {
    this.loadGbifDatasets()
    this.$eventBus.$on('localechanged', (locale) => {
      this.loadGbifDatasets()
    })
    this.restoreFromQueryParms()
    this.$nextTick(() => this.isPropertyChangesEnabled = true)
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
    },
    updateQueryParms() {
      let query = {}
      if (this.$refs.table.filters) {
        Object.keys(this.$refs.table.filters).forEach(filter => {
          if (this.$refs.table.filters[filter]) query[filter] = this.$refs.table.filters[filter]
        })
      }
      if (this.gbifDatasetsPage !== 1) query.page = this.gbifDatasetsPage
      if (this.selectedTaxonomicGroup !== 'order') query.rank = this.selectedTaxonomicGroup
      if (this.taxonomicGroupFilter) query.taxon = this.taxonomicGroupFilter
      if (this.applyFilters) query.filter = this.applyFilters
      if (!(Object.keys(query).length === 0 && Object.keys(this.$route.query).length === 0)) this.$router.replace({query: query})
    },
    restoreFromQueryParms(route) {
      let r = route ? route : this.$route
      if (Object.keys(r.query).length) {
        if (r.query.title || r.query.publishingOrganizationTitle || r.query.typeExpanded || r.query.licenseShort || r.query.pubDate) {
          if (r.query.title) this.$set(this.$refs.table.filters, 'title', r.query.title)
          if (r.query.publishingOrganizationTitle) this.$set(this.$refs.table.filters, 'publishingOrganizationTitle', r.query.publishingOrganizationTitle)
          if (r.query.typeExpanded) this.$set(this.$refs.table.filters, 'typeExpanded', r.query.typeExpanded)
          if (r.query.licenseShort) this.$set(this.$refs.table.filters, 'licenseShort', r.query.licenseShort)
          if (r.query.pubDate) this.$set(this.$refs.table.filters, 'pubDate', r.query.pubDate)
        }
        if (r.query.page) this.gbifDatasetsPage = parseInt(r.query.page)
        if (r.query.rank) this.selectedTaxonomicGroup = r.query.rank
        if (r.query.taxon) this.taxonomicGroupFilter = r.query.taxon
        if (r.query.filter) this.applyFilters = r.query.filter
      }
    },
    columnFiltersChange(e) {
      this.updateQueryParms()
    },
    pageChanged(p) {
      this.gbifDatasetsPage = p
    },
    clearFilters() {
      this.selectedTaxonomicGroup = 'order'
      this.taxonomicGroupFilter = ''
      this.applyFilters = false
      this.gbifDatasetsPage = 1
      if (Object.keys(this.$refs.table.filters).length) {
        Object.keys(this.$refs.table.filters).forEach(filter => {
          this.$refs.table.filters[filter] = ''
        })
        this.updateQueryParms()
      }
    },
    openDatasetDetails(dataset) {
      this.isDataLoading = true
      getGbifGraphQLData(gbifGraphQlQuery.dataset, dataset.key).then(d => {
        this.isDataLoading = false
        d.dataset.typeExpanded = dataset.typeExpanded
        this.$buefy.modal.open({
          parent: this,
          component: DatasetDetails,
          props: {
            dataset: d.dataset
          }
        })
      })
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
    },
    propertyChanges() {
      return `${this.gbifDatasetsPage}|${this.selectedTaxonomicGroup}|${this.taxonomicGroupFilter}|${this.applyFilters}`
    }
  },
  watch: {
    propertyChanges() {
      if (this.isPropertyChangesEnabled) this.updateQueryParms()
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.isPropertyChangesEnabled = false
    this.$refs.table.filters = {}
    this.gbifDatasetsPage = 1
    this.restoreFromQueryParms(to)
    this.$nextTick(() => this.isPropertyChangesEnabled = true)
    next()
  }
}
</script>
