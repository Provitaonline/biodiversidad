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
    <b-table ref="table" paginated :data="taxonomyTable">
      <b-table-column searchable width="20" field="phylum" :label="$t('label.phylum')">
        <template v-slot="props">
          <span style="cursor: pointer;" @click="cellClick(props.row.phylum, 'phylum')">{{ props.row.phylum }}</span>
        </template>
        <template #searchable="props">
          <input type="text" name="prevent_autofill" id="prevent_autofill" value="" style="display:none;" />
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable width="20" field="class" :label="$t('label.class')">
        <template v-slot="props">
          <span style="cursor: pointer;" @click="cellClick(props.row.class, 'class')">{{ props.row.class }}</span>
        </template>
        <template #searchable="props">
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable width="20" field="order" :label="$t('label.order')">
        <template v-slot="props">
          <span style="cursor: pointer;" @click="cellClick(props.row.order, 'order')">{{ props.row.order }}</span>
        </template>
        <template #searchable="props">
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable width="20" field="family" :label="$t('label.family')">
        <template v-slot="props">
          <span style="cursor: pointer;" @click="cellClick(props.row.family, 'family')">{{ props.row.family }}</span>
        </template>
        <template #searchable="props">
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable width="20" field="genus" :label="$t('label.genus')">
        <template v-slot="props">
          <span style="cursor: pointer;" @click="cellClick(props.row.genus, 'genus')">{{ props.row.genus }}</span>
        </template>
        <template #searchable="props">
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable width="170" field="species" :label="$t('label.species')">
        <template v-slot="props">
          <a :href="props.row.link" :target="newTabLinks ? '_blank' :'_self'">{{ props.row.species }}</a>
        </template>
        <template #searchable="props">
          <b-input class="search-field" v-model="props.filters[props.column.field]" size="is-small"
            :icon-right="props.filters[props.column.field] === '' || props.filters[props.column.field] === undefined ? '' : 'close-circle'"
            icon-right-clickable @icon-right-click="props.filters[props.column.field] = ''" />
        </template>
      </b-table-column>
      <b-table-column searchable width="210" field="risk" :label="$t('label.category')">
        <template v-slot="props">
          <div style="display: flex; align-items: center;">
            <img style="width: 30px;" :src="getRiskImage(props.row.risk)">
            <span style="cursor: pointer;" @click="cellClick(props.row.risk, 'risk')">&nbsp;&nbsp;{{ riskText(props.row.risk) }}</span>
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
import confirmDownload from "~//mixins/confirmDownload.js"

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
        phylum: s[1],
        class: s[2],
        order: s[3],
        family: s[4],
        genus: s[5],
        species: s[6],
        risk: t[item].risk,
        link: 'https://especiesamenazadas.org/taxon/' + (s.slice(1, 6).join('/') + '/' + t[item].jsonFile.split('.')[0]).toLowerCase()
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
        return `/Animalia/${item.phylum}/${item.class}/${item.order}/${item.family}/${item.genus},${item.species},${this.riskText(item.risk)},${item.link}`
      })
      list.unshift(this.$t('label.taxonomy') + ',' + this.$t('label.species') + ',' + this.$t('label.category') + ',' + this.$t('label.link'))
      this.doDownload(list)
    }
  }
}

</script>
