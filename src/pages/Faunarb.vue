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
    <section>
      <Tree :treeData="taxonomy" />
    </section>
  </Layout>
</template>

<script>
const taxonomy = require('/content/faunarb/taxonomy.json')
import Tree from '~/components/Tree.vue'
import traverse from 'traverse'

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
    // Add link to leaf nodes
    traverse(this.taxonomy).forEach(function() {
      if (this.isLeaf) {
        let upd = this.parent.node
        upd.link = '/taxon/' + this.parent.path.slice(1, -1).join('/').toLowerCase() + '/' + this.parent.node.jsonFile.split('.')[0]
        this.parent.update(upd, true)
      }
    })
  }
}
</script>
