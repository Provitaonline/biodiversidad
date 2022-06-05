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
            <b-field label-position="on-border" :label="$t('label.iucnredlistcategory')">
              <b-taginput
                size="is-small"
                v-model="tags"
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
            <b-field label-position="on-border" :label="$t('label.taxon')">
              <b-autocomplete size="is-small"
                :data="searchAutoData"
                v-model="name"
                icon="filter"
                :placeholder="$t('label.entername')"
                field="scientificName"
                @typing="getSpeciesSuggestions"
                @input="clearApplyFilters()"
                clearable
              >
              </b-autocomplete>
            </b-field>
            <b-collapse :open="false" class="has-text-centered">
              <template #trigger="props">
                  <a
                      aria-controls="contentIdForA11y4"
                      :aria-expanded="props.open">
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
              <div style="display:block; position: relative; overflow-y: auto; max-height: 30vh;">
                <b-loading :is-full-page="false" v-model="isTaxonomyLoading"></b-loading>
                <ul class="block-list is-small has-text-left">
                  <li v-for="item, index in taxonList">
                    <a v-if="((currentRank < ranks.length - 1) && (item.taxon !== 'incertae sedis'))" @click="taxonClicked(item.taxon, item.taxonKey)" style="display:inline-block">{{ item.taxon }}</a>
                    <span v-else style="display:inline-block">{{ item.taxon }}</span>
                    <a @click="countClicked(item.taxon)" style="float: right;">({{ $n(item.count) }})</a>
                  </li>
                </ul>
              </div>
            </b-collapse>
            <hr>
            <b-field>
              <b-checkbox size="is-small" v-model="applyFilters" @input="applyFilterChange()">
                {{ $t('label.applifilters') }}
              </b-checkbox>
            </b-field>
          </div>
        </div>
      </aside>
      <div class="column">
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
      min-width: 20rem;
      border-right: 0;
    }
  }

  .block-list li {
    padding: 4px;
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
  }
</page-query>

<script>
import {getGbifOccurrences, getSpeciesSuggestions, getGbifOccurrenceTaxonomies} from '~/utils/data'

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
      isTaxonomyLoading: false,
      isFullPage: false,
      gbifOccurrencesPage: 1,
      perPage: 20,
      tags: [],
      iucnCodes: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'],
      selectedOptions: [],
      ranks: ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'],
      currentRank: 0,
      taxonList: [],
      selectedTaxons: []
    }
  },
  components: {
  },
  mounted() {
    this.loadGbifOccurrences(1)
    this.loadGbifOccurrenceTaxonomies(this.ranks[0])
  },
  methods: {
    loadGbifOccurrences(page) {
      this.loading = true
      getGbifOccurrences((page-1)*20, this.name, this.tags).then((result) => {
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
      if (this.applyFilters) {
        this.loadGbifOccurrences(1)
      } else {
        this.name=''
        this.tags=[]
        this.loadGbifOccurrences(1)
      }
    },
    clearApplyFilters() {
      this.applyFilters = false
    },
    taxonClicked(taxon, taxonKey) {
      this.selectedTaxons.push({taxon: taxon, taxonKey: taxonKey, rank: this.ranks[this.currentRank]})
      this.currentRank++
      this.loadGbifOccurrenceTaxonomies(this.ranks[this.currentRank], taxonKey)
    },
    countClicked(taxon) {
      this.name = taxon
    },
    removeTaxonClicked(index) {
      let taxonKey = (index === 0) ? undefined : this.selectedTaxons[index - 1].taxonKey
      this.selectedTaxons = this.selectedTaxons.filter((s, i) => i < index)
      this.currentRank = index
      this.loadGbifOccurrenceTaxonomies(this.ranks[index], taxonKey)

    }
  }
}
</script>
