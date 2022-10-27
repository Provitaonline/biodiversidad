<template>
  <div id="mitchTree">
  </div>
</template>

<style lang="scss" scoped>

  ::v-deep .d3plus-textBox text {
    font-size: 18px !important;
  }

</style>

<script>

import mitchTree from 'd3-mitch-tree'

export default {
  name: 'TaxonomyTree',
  props: {
    taxonomy4Chart: { type: Array, required: true },
  },
  data() {
    return {

    }
  },
  mounted() {
    if (process.isClient) {
      new mitchTree.boxedTree({theme: 'custom'})
        .setData(this.taxonomy4Chart[0])
        .setElement(document.getElementById('mitchTree'))
        .setIdAccessor((data) => {
          return data.name;
        })
        .setChildrenAccessor((data) => {
            return data.children;
        })
        .setBodyDisplayTextAccessor((data) => {
            if (data.risk) {
              console.log('terminal node')
              return data.name.split(' ').join('\n') + '\n(' + data.risk + ')'
            }
          return data.name;
        })
        .initialize()
    }
  },
  unmounted() {
  },
  methods: {

  }
}

</script>
