<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.occurrencesContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <b-loading :is-full-page="false" v-model="isDataLoading"></b-loading>
    <div class="columns is-gapless">
      <aside class="column is-narrow side-panel">
        <div class="side-panel-content">
          <div class="box">
            <div class="has-text-centered">
              <b>{{$t('label.filters')}}</b><br><br>
            </div>
            <b-field label-position="on-border" :label="$t('label.state')">
              <b-autocomplete size="is-small"
                :data="filteredStates"
                v-model="state"
                icon="filter"
                :open-on-focus="true"
                :keep-first="true"
                :placeholder="$t('label.chooseone')"
                field="node.name"
                clearable
                @input="clearApplyFilters()"
              >
              </b-autocomplete>
            </b-field>
            <b-field label-position="on-border" :label="$t('label.iucnredlistcategory')">
              <b-taginput
                size="is-small"
                v-model="filters.iucnRedListCategory"
                icon="filter"
                :data="iucnCodes"
                autocomplete
                :open-on-focus="true"
                :placeholder="$t('label.addone')"
                clearable
                @input="clearApplyFilters()"
              >
                <template slot-scope="props">
                  {{props.option}} - {{ $t('label.' + props.option) }}
                </template>
              </b-taginput>
            </b-field>
            <b-field label-position="on-border" :label="$t('label.scientificname')">
              <b-autocomplete size="is-small"
                :data="searchAutoData"
                v-model="scientificName"
                icon="filter"
                :placeholder="$t('label.entername')"
                field="scientificName"
                @typing="getSpeciesSuggestions"
                @input="clearApplyFilters()"
                clearable
              >
              </b-autocomplete>
            </b-field>
            <div style="border: 1px; border-color: #dbdbdb; padding-bottom: 5px; border-style: solid; border-radius: 2px;">
              <b-collapse :open="false">
                <template #trigger="props">
                  <a>
                    <b-icon :icon="!props.open ? 'caret-down' : 'caret-up'"></b-icon>
                    <small><b>{{ $t('label.taxonomynavigator') }}</b></small>
                  </a>
                </template>
                <div>
                  <div class="is-size-7 has-text-centered">{{ $t('label.clicktonavigate') }}</div>
                  <div class="is-size-7 has-text-centered">{{ $t('label.clicktochoose') }}</div>
                  <!-- <div v-if="currentRank === 0"><small>{{ $t('label.' + ranks[currentRank]) }}:</small></div> -->
                  <div v-for="selected, index in selectedTaxons">
                    <div class="is-flex is-align-items-center is-size-6">
                      <span><small>{{ $t('label.' + selected.rank) }}: {{ selected.taxon }}</small></span>
                      <span class="is-flex-grow-1"></span>
                      <a @click="removeTaxonClicked(index)"><small><font-awesome size="sm" :icon="['fas', 'times-circle']"/></small></a>
                    </div>
                  </div>
                </div>
                <div class="taxon-list">
                  <b-loading :is-full-page="false" v-model="isTaxonomyLoading"></b-loading>
                  <ul class="block-list is-small has-text-left">
                    <li class="taxon-list-header">
                      <span class="taxon-list-name"><b>{{ $t('label.' + ranks[currentRank]) }}</b></span>
                      <span class="taxon-list-count"><b>({{ $t('label.count') }})</b></span>
                    </li>
                    <li v-for="item, index in taxonList">
                      <a v-if="((currentRank < ranks.length - 1) && (item.taxon !== 'incertae sedis'))" @click="taxonClicked(item.taxon, item.taxonKey)" class="taxon-list-name">{{ item.taxon }}</a>
                      <span v-else class="taxon-list-name">{{ item.taxon }}</span>
                      <a @click="countClicked(item.taxon, item.taxonKey)" class="taxon-list-count">({{ $n(item.count) }})</a>
                    </li>
                  </ul>
                </div>
              </b-collapse>
            </div>
            <hr>
            <b-field>
              <b-checkbox size="is-small" v-model="applyFilters" @input="applyFilterChange()">
                {{ $t('label.applyfilters') }}
              </b-checkbox>
              <a @click="clearFilters()">&nbsp<font-awesome :icon="['fas', 'trash']"/></a><span class="is-size-7" style="margin-top: auto; margin-bottom: auto;">&nbsp{{ $t('label.clearfilters') }}</span>
            </b-field>
          </div>
        </div>
      </aside>
      <div class="column">
        <b-tabs @input="tabChanged" v-model="activeTab" type="is-boxed" animation="fade">
          <b-tab-item value="table" active :label="$t('label.table')">
            <div class="is-size-5 has-text-weight-semibold total-heading">
              {{$t('label.numberofoccurrences')}}: {{ $n(totalGbifOccurrences) }}
            </div>
            <b-table
              :data='gbifOccurrencesData'
              :loading='loading'
              hoverable
              paginated
              :pagination-simple='true'
              backend-pagination
              :current-page="gbifOccurrencesPage"
              :total='totalGbifOccurrences'
              @page-change='gbifOccurrencesOnPageChange'
            >
              <b-table-column width="30%" field="scientificName" :label="$t('label.scientificname')" v-slot="props">
                <!-- <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/occurrence/' + props.row.gbifID">{{ props.row.scientificName }}</a> -->
                <a @click="openOccurrenceDetails(props.row)" href="">{{ props.row.scientificName }}</a>
              </b-table-column>
              <b-table-column field="year" :label="$t('label.year')" v-slot="props">
                {{ props.row.year }}
              </b-table-column>
              <b-table-column field="gadm" :label="$t('label.state')" v-slot="props">
                {{ (props.row.gadm && props.row.gadm.level1) ? props.row.gadm.level1.name : '' }}
              </b-table-column>
              <b-table-column field="iucnRedListCategory" :label="$t('label.iucnredlistcategory')" v-slot="props">
                <span v-if="props.row.iucnRedListCategory">{{props.row.iucnRedListCategory}} - {{ $t('label.' + props.row.iucnRedListCategory) }}</span>
              </b-table-column>
              <b-table-column field="publishingCountry" :label="$t('label.publishingcountry')" v-slot="props">
                {{ props.row.publishingCountry }}
              </b-table-column>
              <b-table-column field="datasetName" :label="$t('label.dataset')" v-slot="props">
                <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/dataset/' + props.row.datasetKey">{{props.row.datasetName ? props.row.datasetName : props.row.datasetKey}}</a>
              </b-table-column>
            </b-table>
          </b-tab-item>
          <b-tab-item value="map" active :label="$t('label.map')">
            <InteractiveMap v-if="renderMap" :filters="filters" :applyFilters="applyFilters"/>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </Layout>
</template>


<style lang="scss" scoped>
  @import "~/assets/style/_variables";

  @media only screen and (min-width: 769px) {
    .side-panel {
      width: 20rem;
      transition: margin-left .3s;
    }
  }

  @media only screen and (max-width: 768px) {
    .side-panel {
      //min-width: 20rem;
      border-right: 0;
    }
    .side-panel-content>div {
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  .block-list li {
    padding: 4px;
  }

  .taxon-list {
    display: block;
    position: relative;
    overflow-y: auto;
    max-height: 30vh;
  }

  .taxon-list-header {
    border-bottom-style: groove;
    border-bottom-width: thin;
  }

  .taxon-list-name {
    display: inline-block
  }

  .taxon-list-count {
    float: right;
  }

  .total-heading {
    background-color: white;
    border-bottom-style: solid;
    border-bottom-color: #DBDBDB;
  }

  ::v-deep .top.level {
    padding-bottom: 8px;
  }

</style>

<page-query>
  query  {
    occurrencesContent (id: "occurrences") {
      bannerText {
        en
        es
      }
    }
    allGadmData: allGadmData (sortBy: "name", order: ASC) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
</page-query>

<script>
import {getGbifOccurrences, getSpeciesSuggestions, getGbifOccurrenceTaxonomies, getTaxonName, getGbifGraphQLData} from '~/utils/data'
import {getPureText, reloadPageIfBrowserCached} from '~/utils/misc'
import {gbifGraphQlQuery} from '~/utils/config'

import InteractiveMap from '~/components/InteractiveMap.vue'
import OccurrenceDetails from '~/components/OccurrenceDetails.vue'

export default {
  metaInfo() {
    return {
      title: this.$t('label.occurrences'),
      titleTemplate: '%s - ' + this.$t('label.site')
    }
  },
  data() {
    return {
      activeTab: 'table',
      gbifOccurrencesData: [],
      searchAutoData: [],
      applyFilters: false,
      taxon: '',
      state: '',
      scientificName: '',
      totalGbifOccurrences: 0,
      loading: false,
      isTaxonomyLoading: false,
      isDataLoading: false,
      isFullPage: false,
      gbifOccurrencesPage: 1,
      perPage: 20,
      iucnCodes: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'],
      selectedOptions: [],
      ranks: ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'],
      currentRank: 0,
      taxonList: [],
      selectedTaxons: [],
      filters: {
        iucnRedListCategory: [],
        gadmLevel1Gid: undefined
      },
      renderMap: false
    }
  },
  components: {
    InteractiveMap
  },
  created() {
    if (process.isClient) reloadPageIfBrowserCached(this.$route)
  },
  mounted() {
    this.restoreFromQueryParms()
  },
  methods: {
    loadGbifOccurrences(page) {
      this.gbifOccurrencesPage = page
      this.loading = true
      this.filters.gadmLevel1Gid = this.stateId
      this.filters.taxonKey = this.scientificNameKey()
      getGbifOccurrences((page-1)*20, this.applyFilters ? this.filters : null, this.$i18n.locale.substr(0, 2)).then((result) => {
        this.gbifOccurrencesData = result.results
        this.totalGbifOccurrences = result.count
        this.loading = false
      })
    },
    gbifOccurrencesOnPageChange(page) {
      this.loadGbifOccurrences(page)
      this.updateQueryParms()
    },
    getSpeciesSuggestions(name) {
      getSpeciesSuggestions(name).then((result) => {
        this.searchAutoData = result
      })
    },
    loadGbifOccurrenceTaxonomies(rank, taxonKey) {
      this.isTaxonomyLoading = true
      getGbifOccurrenceTaxonomies(rank, taxonKey).then(r => {
        this.taxonList = r
        this.isTaxonomyLoading = false
      })
    },
    applyFilterChange() {
      this.loadGbifOccurrences(1)
      this.updateQueryParms()
      this.$eventBus.$emit('filterchange', this.applyFilters)
    },
    clearApplyFilters() {
      this.applyFilters = false
    },
    clearFilters() {
      this.state = ''
      this.scientificName = ''
      this.filters.iucnRedListCategory = []
      this.filters.taxonKey = []
      this.filters.gadmLevel1Gid = undefined
      this.taxon = ''
      if (this.applyFilters) {
        this.clearApplyFilters()
        this.applyFilterChange()
      }
    },
    taxonClicked(taxon, taxonKey) {
      this.selectedTaxons.push({taxon: taxon, taxonKey: taxonKey, rank: this.ranks[this.currentRank]})
      this.currentRank++
      this.loadGbifOccurrenceTaxonomies(this.ranks[this.currentRank], taxonKey)
    },
    countClicked(taxon, taxonKey) {
      this.clearApplyFilters()
      this.scientificName = taxon
      this.searchAutoData = [{scientificName: taxon, key: taxonKey, status: "ACCEPTED"}]
    },
    removeTaxonClicked(index) {
      let taxonKey = (index === 0) ? undefined : this.selectedTaxons[index - 1].taxonKey
      this.selectedTaxons = this.selectedTaxons.filter((s, i) => i < index)
      this.currentRank = index
      this.loadGbifOccurrenceTaxonomies(this.ranks[index], taxonKey)

    },
    tabChanged() {
      if (this.activeTab === 'map') {
        this.$nextTick(() => window.dispatchEvent(new Event('resize')))
      }
      this.updateQueryParms()
    },
    scientificNameKey() {
      if (this.scientificName.trim() === '') return undefined
      let item = this.searchAutoData.find(e => (e.scientificName === 'incertae sedis' || e.status === "ACCEPTED") && e.scientificName.toLowerCase() === this.scientificName.toLowerCase())
      return (item && item.key !== undefined) ? item.key : undefined
    },
    updateQueryParms() {
      let query = {}
      if (this.gbifOccurrencesPage !== 1) query.page = this.gbifOccurrencesPage
      if (this.activeTab !== 'table') query.tab = this.activeTab
      if (this.state) query.state = this.state
      if (this.filters.taxonKey !== undefined) query.taxonKey = this.filters.taxonKey
      if (this.filters.iucnRedListCategory.length) query.iucnRedListCategory = this.filters.iucnRedListCategory
      if (!(Object.keys(query).length === 0 && Object.keys(this.$route.query).length === 0)) this.$router.replace({query: this.applyFilters || query.tab || query.page ? query : {}})
    },
    async restoreFromQueryParms() {
      if (Object.keys(this.$route.query).length) {
        if (this.$route.query.page) this.gbifOccurrencesPage = parseInt(this.$route.query.page)
        if (this.$route.query.tab) this.activeTab = this.$route.query.tab
        if (this.$route.query.state) this.state = this.$route.query.state
        if (this.$route.query.taxonKey !== undefined) {
          let tn = await getTaxonName(this.$route.query.taxonKey)
          this.filters.taxonKey = this.$route.query.taxonKey
          this.scientificName = tn.canonicalName ? tn.canonicalName : tn.scientificName
          this.searchAutoData = [{scientificName: this.scientificName, key: this.$route.query.taxonKey, status: "ACCEPTED"}]
        }
        if (this.$route.query.iucnRedListCategory) {
          if (Array.isArray(this.$route.query.iucnRedListCategory)) {
            this.filters.iucnRedListCategory = this.$route.query.iucnRedListCategory
          } else {
            this.filters.iucnRedListCategory.push(this.$route.query.iucnRedListCategory)
          }
        }
      }

      this.$nextTick(() => {
        if (Object.keys(this.$route.query).length) {
          this.applyFilters = true
        }
        this.loadGbifOccurrences(this.gbifOccurrencesPage)
        this.loadGbifOccurrenceTaxonomies(this.ranks[0])
        this.renderMap = true
      })
    },
    openOccurrenceDetails(occurrence) {
      this.isDataLoading = true
      getGbifGraphQLData(gbifGraphQlQuery.occurrence, occurrence.key).then(o => {
        this.isDataLoading = false
        this.$buefy.modal.open({
          parent: this,
          component: OccurrenceDetails,
          props: {
            occurrence: occurrence,
            occurrenceMore: o.occurrence
          }
        })
      })
    },
  },
  computed: {
    filteredStates() {
      return this.$page.allGadmData.edges.filter(item => {return getPureText(item.node.name).includes(getPureText(this.state))})
    },
    stateId() {
      let edge = this.$page.allGadmData.edges.find(e => e.node.name === this.state)
      return edge ? edge.node.id : undefined
    }
  }
}
</script>
