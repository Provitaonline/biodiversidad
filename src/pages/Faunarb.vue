<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.faunaRbContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <section class="section has-text-centered" v-html="$page.faunaRbContent.summaryText[$i18n.locale.substr(0, 2)]"></section>

    <section class="section">
      <b-tabs @input="tabChanged" v-model="activeTab" type="is-boxed">
        <b-tab-item class="is-size-5 is-size-7-mobile" value="tree" active :label="$t('label.tree')">
          <Tree :treeData="taxonomy" />
        </b-tab-item>
        <b-tab-item value="circles" :label="$t('label.circles')">
          <div id="chart"></div>
        </b-tab-item>
      </b-tabs>
    </section>
  </Layout>
</template>

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
      activeTab: 'tree',
      taxonomy: taxonomy,
      taxonomy4Chart: transform(taxonomy),
      myChart: null
    }
  },
  components: {
    Tree
  },
  created() {

  },
  mounted() {
    const color = d3.scaleOrdinal(d3.schemePaired)
    this.myChart = SunBurst()
    console.log(this.taxonomy4Chart)
    this.myChart.data(this.taxonomy4Chart[0]).onClick(this.itemClicked).color(d => color(d.name))(document.getElementById('chart'))
  },
  methods: {
    tabChanged() {
    },
    itemClicked(n) {
      if (n.link) {
        console.log(n)
      }
      this.myChart.focusOnNode(n)
    }
  }
}
</script>
