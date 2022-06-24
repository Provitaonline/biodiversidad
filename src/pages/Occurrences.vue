<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.occurrencesContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
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
                  <div v-if="taxon" class="is-flex is-align-items-center has-text-left" style="padding-top: 4px; padding-bottom: 4px;">
                    <div class="is-size-7"><span class="has-text-weight-bold">Selección:</span> {{taxon}}</div>
                    <span class="is-flex-grow-1"></span>
                    <a @click="clearSelectedTaxon()"><small><font-awesome size="sm" :icon="['fas', 'times-circle']"/></small></a>
                  </div>
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
        <b-tabs @input="tabChanged" v-model="activeTab" type="is-boxed">
          <b-tab-item value="table" active label="Table">
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
              :total='totalGbifOccurrences'
              @page-change='gbifOccurrencesOnPageChange'
            >
              <b-table-column width="30%" field="scientificName" :label="$t('label.scientificname')" v-slot="props">
                <a :href="'https://gbif.org/es/occurrence/' + props.row.gbifID">{{ props.row.scientificName }}</a>
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
                <a :href="'https://gbif.org/es/dataset/' + props.row.datasetKey">{{props.row.datasetName}}</a>
              </b-table-column>
            </b-table>
          </b-tab-item>
          <b-tab-item value="map" active label="Map">
            <InteractiveMap :filters="filters" />
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
import {getGbifOccurrences, getSpeciesSuggestions, getGbifOccurrenceTaxonomies} from '~/utils/data'
import {getPureText} from '~/utils/misc'

import InteractiveMap from '~/components/InteractiveMap.vue'

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
        taxonKey: [],
        gadmLevel1Gid: undefined
      }
    }
  },
  components: {
    InteractiveMap
  },
  mounted() {
    this.loadGbifOccurrences(1)
    this.loadGbifOccurrenceTaxonomies(this.ranks[0])
  },
  methods: {
    loadGbifOccurrences(page) {
      this.loading = true
      this.filters.gadmLevel1Gid = this.stateId
      this.filters.taxonKey[1] = this.scientificNameKey()
      getGbifOccurrences((page-1)*20, this.applyFilters ? this.filters : null).then((result) => {
        this.gbifOccurrencesData = result.results
        this.totalGbifOccurrences = result.count
        this.loading = false
      })
    },
    gbifOccurrencesOnPageChange(page) {
      this.gbifOccurrencesPage = page
      this.loadGbifOccurrences(page)
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
      this.taxon = taxon
      this.filters.taxonKey[0] = taxonKey
    },
    removeTaxonClicked(index) {
      let taxonKey = (index === 0) ? undefined : this.selectedTaxons[index - 1].taxonKey
      this.selectedTaxons = this.selectedTaxons.filter((s, i) => i < index)
      this.currentRank = index
      this.loadGbifOccurrenceTaxonomies(this.ranks[index], taxonKey)

    },
    clearSelectedTaxon() {
      this.taxon = ''
      this.filters.taxonKey[0] = undefined
      this.clearApplyFilters()
    },
    tabChanged() {
      if (this.activeTab === 'map') {
        this.$nextTick(() => window.dispatchEvent(new Event('resize')))
      }
    },
    scientificNameKey() {
      if (this.scientificName.trim() === '') return undefined
      let item = this.searchAutoData.find(e => e.scientificName.toLowerCase() === this.scientificName.toLowerCase())
      return item && item.key ? item.key : undefined
    }
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
