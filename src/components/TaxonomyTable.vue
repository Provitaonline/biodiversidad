<template>
  <div>
    <div style="display: flex;" class="total-heading">
      <div style="margin-top: auto; margin-bottom: auto;">
        <a id="download-file" download="list.csv" ref="download" :href="downloadLink"></a>
        <a @click="confirmDownload()" :title="$t('label.download')"><font-awesome :icon="['fas', 'download']"/></a>&nbsp;
      </div>
      <div class="is-size-5 has-text-weight-semibold" style="margin-top: auto; margin-bottom: auto;">
        {{$t('label.numberofitems')}}: {{ $n(numItems()) }}
      </div>
      <a style="margin-top: auto; margin-bottom: auto; padding: 8px;" @click="clearFilters()"><font-awesome size="sm" :icon="['fas', 'trash']"/></a>
      <span class="is-size-7" style="margin-top: auto; margin-bottom: auto;">{{ $t('label.clearfilters') }}</span>
    </div>
    <b-table style="font-size: 0.9rem" ref="table" paginated :data="taxonomyTable">
      <b-table-column searchable field="taxonomy" :label="$t('label.taxonomy')">
        <template v-slot="props">
          <span>{{ props.row.taxonomy }}</span>
        </template>
        <template #searchable="props">
          <input type="text" name="prevent_autofill" id="prevent_autofill" value="" style="display:none;" />
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable field="species" :label="$t('label.species')">
        <template v-slot="props">
          <a :href="props.row.link" :target="newTabLinks ? '_blank' :'_self'">{{ props.row.species }}</a>
        </template>
        <template #searchable="props">
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable field="commonName" :label="$t('label.commonname')">
        <template v-slot="props">
          <a :href="props.row.link" :target="newTabLinks ? '_blank' :'_self'">{{ props.row.commonName }}</a>
        </template>
        <template #searchable="props">
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable :custom-search="filterByRisk" field="risk" :label="$t('label.category')">
        <template v-slot="props">
          <div style="display: flex; justify-content: center;">
            <b-tooltip :label="props.row.riskO[$i18n.locale.substr(0, 2)]">
              <img style="width: 30px; cursor: pointer;" :src="getRiskImage(props.row.riskO.es)">
            </b-tooltip>
          </div>
        </template>
        <template #searchable="props">
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
    </b-table>
  </div>
</template>

<style lang="scss" scoped>
  ::v-deep .vulnerable {
    background-color: #FFFF00;
  }

  .search-field {
    padding-bottom: 1rem;
  }

</style>

<script>

import flatten from 'flat'
import {riskText, tText} from '~/utils/misc'
import confirmDownload from '~/mixins/confirmDownload.js'

const separator = ' → '

export default {
  name: 'TaxonomyTable',
  props: {
    taxonomy: { type: Object, required: true },
    newTabLinks: { type: Boolean }
  },
  mixins: [confirmDownload],
  data() {
    return {
      taxonomyTable: [],
      downloadLink: null
    }
  },
  mounted() {
    let t = flatten(this.taxonomy, { maxDepth: 7 })
    this.taxonomyTable = Object.keys(t).map(item => {
      let s = item.split('.')
      return {
        taxonomy: s.slice(0, 6).join(separator),
        species: s[6],
        riskO: {es: t[item].risk, en: riskText(t[item].risk, 'en')},
        link: 'https://especiesamenazadas.org/taxon/' + (s.slice(1, 6).join('/') + '/' + t[item].jsonFile.split('.')[0]).toLowerCase(),
        commonName: t[item].commonName
      }
    }).sort((a,b) => tText(a).localeCompare(tText(b)))
  },
  unmounted() {
  },
  methods: {
    cellClick(v, f) {
      this.$set(this.$refs.table.filters, f, v)
    },
    riskText(r) {
      return riskText(r, this.$i18n.locale.substr(0, 2))
    },
    numItems() {
      if (this.$refs.table) return this.$refs.table.newDataTotal
      return 0
    },
    clearFilters() {
      if (Object.keys(this.$refs.table.filters).length) {
        Object.keys(this.$refs.table.filters).forEach(filter => {
          this.$refs.table.filters[filter] = ''
        })
      }
    },
    getRiskImage(r) {
      return require('~/assets/images/' + r.toLowerCase().replaceAll(' ', '-').replaceAll('í', 'i') + '.png')
    },
    getListCSV() {
      let list = this.$refs.table.newData.map(item => {
        return '/' + item.taxonomy.replaceAll(separator, '/') + `,${item.species},${item.commonName},${item.riskO[this.$i18n.locale.substr(0, 2)]},${item.link}`
      })
      list.unshift(this.$t('label.taxonomy') + ',' + this.$t('label.species') + ',' + this.$t('label.commonname') + ',' + this.$t('label.category') + ',' + this.$t('label.link'))
      this.doDownload(list)
    },
    filterByRisk(row, input) {
      return row.riskO[this.$i18n.locale.substr(0, 2)].toLowerCase().includes(input.toLowerCase())
    }
  }
}

</script>
