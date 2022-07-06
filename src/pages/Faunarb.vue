<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.faunaRbContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <section class="section has-text-centered" v-html="$page.faunaRbContent.summaryText[$i18n.locale.substr(0, 2)]"></section>

    <section class="is-size-5 is-size-7-mobile">
      <Tree :treeData="taxonomy" />
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
      taxonomy: taxonomy
    }
  },
  components: {
    Tree
  },
  created() {

  }
}
</script>
