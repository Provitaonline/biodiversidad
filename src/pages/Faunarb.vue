<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.faunaRbContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <section class="section has-text-centered" v-html="$page.faunaRbContent.summaryText[$i18n.locale.substr(0, 2)]"></section>

    <section class="section">
      <b-tabs @input="tabChanged" v-model="activeTab" type="is-boxed">
        <b-tab-item class="is-size-5 is-size-7-mobile" value="list" active :label="$t('label.list')">
          <Tree :treeData="taxonomy" />
        </b-tab-item>
        <b-tab-item value="graph" :label="$t('label.graph')">
          <div style="overflow-x: scroll;" id="chart"></div>
        </b-tab-item>
      </b-tabs>
    </section>
  </Layout>
</template>

<style lang="scss" scoped>

  ::v-deep .tooltip {
    max-width: none;
  }

</style>

<page-query>
  query {
    faunaRbContent (id: "faunarb") {
      bannerText {
        en
        es
      }
      summaryText {
        en
        es
      }
    }
  }
</page-query>

<script>
import SunBurst from 'sunburst-chart'
import * as d3 from 'd3'
const taxonomy = require('/content/faunarb/taxonomy.json')
import {transform} from '~/utils/misc'
import Tree from '~/components/Tree.vue'

export default {
  metaInfo() {
    return {
      title: this.$t('label.faunarb'),
      titleTemplate: '%s - ' + this.$t('label.site')
    }
  },
  data() {
    return {
      activeTab: 'list',
      taxonomy: taxonomy,
      taxonomy4Chart: transform(taxonomy),
      chart: null
    }
  },
  components: {
    Tree
  },
  created() {

  },
  mounted() {
    this.restoreFromQueryParms()
    if (process.isClient) {
      const color = d3.scaleOrdinal(d3.schemeTableau10)
      let chart = SunBurst()
      chart.data(this.taxonomy4Chart[0])
        .width(window.innerWidth*0.8)
        .height(window.innerHeight*0.8)
        .centerRadius(0.05)
        .radiusScaleExponent(1)
        .onClick(itemClicked)
        .color(getColor)
        (document.getElementById('chart'))

      function itemClicked(n) {
        if (n && n.link) {
          window.location.href = 'https://especiesamenazadas.org/taxon' + n.link
        } else {
          chart.focusOnNode(n)
        }
      }

      function getColor(n) {
        let riskColors = {
          'En Peligro': '#FFA500',
          'En Peligro Crítico': '#E91C1F',
          'Extinto': '#060000',
          'Vulnerable': '#FFFF00',
          'Extinto a Nivel Regional': '#CD1417'
        }
        if (n.level === 6) {
          return d3.rgb(riskColors[n.risk]).darker(0.3)
        } else {
          if (n.level > 2) {
            let c = d3.rgb(color(n.class))
            return c.darker((n.level*3)/10)
          } else {
            return color(n.name)
          }
        }
      }
    }
  },
  methods: {
    tabChanged() {
      this.updateQueryParms()
    },
    updateQueryParms() {
      let query = {}
      if (this.activeTab !== 'list') query.tab = this.activeTab
      if (!(Object.keys(query).length === 0 && Object.keys(this.$route.query).length === 0)) this.$router.replace({query: query})
    },
    restoreFromQueryParms() {
      if (Object.keys(this.$route.query).length) {
        if (this.$route.query.tab) this.activeTab = this.$route.query.tab
      }
    }
  }
}
</script>
