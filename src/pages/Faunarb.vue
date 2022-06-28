<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        {{ $t('label.faunarb') }}
      </h1>
    </template>
    <section class="section has-text-centered">
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    </section>
    <section class="is-size-5">
      <Tree :treeData="taxonomy" />
    </section>
  </Layout>
</template>

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
