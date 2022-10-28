<template>
  <div id="mitchTree">
  </div>
</template>

<style lang="scss" scoped>

  ::v-deep .d3plus-textBox text {
    //font-size: 18px !important;
  }

</style>

<script>

import mitchTree from 'd3-mitch-tree'

export default {
  name: 'TaxonomyTree',
  props: {
    taxonomy4Chart: { type: Array, required: true },
    newTabLinks: { type: Boolean }
  },
  data() {
    return {

    }
  },
  mounted() {
    if (process.isClient) {
      new mitchTree.boxedTree({
        theme: 'custom',
        data: this.taxonomy4Chart[0],
        element: document.getElementById('mitchTree'),
        nodeDepthMultiplier: 200,
        allowFocus: true,
        //heightWithoutMargins: 700,
        allowNodeCentering: true,
        margins: {top:0, bottom: 0, left: 0, right: 0},
        nodeSettings: {
          verticalSpacing: 25, horizontalSpacing: 100, bodyBoxWidth: 180, bodyBoxHeight: 50, sizingMode: 'nodeSize'
        }
      })
        .setIdAccessor((data) => {return data.name})
        .setChildrenAccessor((data) => {return data.children})
        .setBodyDisplayTextAccessor((data) => {
            if (data.risk) {
              return data.name + '\n(' + data.risk + ')'
            }
          return data.name;
        })
        .on('nodeClick', this.nodeClickHandler)
        .initialize()
    }
  },
  unmounted() {
  },
  methods: {
    nodeClickHandler(e) {
      if (e.nodeDataItem.data.link) {
        window.open('https://especiesamenazadas.org/taxon' + e.nodeDataItem.data.link, this.newTabLinks ? '_blank' :'_self')
        e.preventDefault()
      }
    }
  }
}

</script>
