<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        Datos GBIF de Venezuela<br>Registros de presencia de especies
      </h1>
    </template>
    <div class="columns is-gapless">
      <aside class="column is-narrow side-panel">
        <div class="side-panel-content">
          <div class="box">
            <div class="has-text-centered">
              <b><small>{{$t('label.filters')}}</small></b><br><br>
            </div>
            <b-field>
              <b-autocomplete size="is-small"
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
            </b-field>
            <div>
              <div v-if="currentRank === 0">{{ $t('label.' + ranks[currentRank]) }}:</div>
              <div v-for="selected, index in selectedTaxons">
                <div class="is-flex is-align-items-center">
                  <span>{{ $t('label.' + selected.rank) }}: {{ selected.taxon }}</span>
                  <span class="is-flex-grow-1"></span>
                  <a @click="removeTaxonClicked(index)"><font-awesome size="sm" :icon="['fas', 'times-circle']"/></a>
                </div>
              </div>
              <ul class="block-list is-small">
                <li v-for="item, index in taxonList">
                  <a @click="taxonClicked(item.taxon, item.taxonKey)" style="display:inline-block">{{ item.taxon }}</a>
                  <a @click="countClicked(item.taxon)" style="float: right;">({{ $n(item.count) }})</a>
                </li>
              </ul>
            </div>
            <b-field>
              <b-taginput
                size="is-small"
                v-model="tags"
                icon="filter"
                :data="iucnCodes"
                autocomplete
                :open-on-focus="true"
                placeholder="IUCN"
                clearable
                @input="clearApplyFilters()"
              >
                <template slot-scope="props">
                  {{props.option}} - {{ $t('label.' + props.option) }}
                </template>
              </b-taginput>
            </b-field>
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
          <b-table-column width="30%" field="scientificName" label="Nombre científico" v-slot="props">
            <a :href="'https://gbif.org/es/occurrence/' + props.row.gbifID">{{ props.row.scientificName }}</a>
          </b-table-column>
          <b-table-column field="year" label="Año" v-slot="props">
            {{ props.row.year }}
          </b-table-column>
          <b-table-column field="iucnRedListCategory" label="Lista roja IUCN" v-slot="props">
            <span v-if="props.row.iucnRedListCategory">{{props.row.iucnRedListCategory}} - {{ $t('label.' + props.row.iucnRedListCategory) }}</span>
          </b-table-column>
          <b-table-column field="publishingCountry" label="País que publica" v-slot="props">
            {{ props.row.publishingCountry }}
          </b-table-column>
          <b-table-column field="datasetName" label="Juego de datos" v-slot="props">
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
      isTaxonomyLoading: true,
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
    getGbifOccurrenceTaxonomies('kingdom').then(r => this.taxonList = r)
    /*getGbifOccurrenceTaxonomies('phylum', 1).then(r => console.log(r))
    getGbifOccurrenceTaxonomies('class', 44).then(r => console.log(r))
    getGbifOccurrenceTaxonomies('order', 212).then(r => console.log(r)) */
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
      if (this.currentRank >= this.ranks.length - 1) return

      this.selectedTaxons.push({taxon: taxon, taxonKey: taxonKey, rank: this.ranks[this.currentRank]})
      this.currentRank++
      getGbifOccurrenceTaxonomies(this.ranks[this.currentRank], taxonKey).then(r => this.taxonList = r)
    },
    countClicked(taxon) {
      this.name = taxon
    },
    removeTaxonClicked(index) {
      let taxonKey = (index === 0) ? undefined : this.selectedTaxons[index - 1].taxonKey
      this.selectedTaxons = this.selectedTaxons.filter((s, i) => i < index)
      this.currentRank = index
      getGbifOccurrenceTaxonomies(this.ranks[index], taxonKey).then(r => this.taxonList = r)
    }
  }
}
</script>
