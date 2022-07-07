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
          <ClientOnly>
            <TaxonomyChart :taxonomy4Chart="taxonomy4Chart" />
          </ClientOnly>
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
    Tree,
    TaxonomyChart: () => import ('~/components/TaxonomyChart.vue').then(m => m)
  },
  created() {

  },
  mounted() {
    this.restoreFromQueryParms()
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
