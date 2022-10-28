<template>
  <div id="mitchTree">
  </div>
</template>

<style lang="scss" scoped>

  ::v-deep .d3plus-textBox text {
    //font-size: 18px !important;
  }

  ::v-deep .species-node {
    fill: red !important;
  }

</style>

<script>

import mitchTree from 'd3-mitch-tree'
import * as d3 from 'd3'

import {riskText} from '~/utils/misc'
import {riskColors} from '~/utils/config'

export default {
  name: 'TaxonomyTree',
  props: {
    taxonomy4Chart: { type: Array, required: true },
    newTabLinks: { type: Boolean }
  },
  data() {
    return {
      riskColors: riskColors,
      riskTextColors: {
        'Extinto': 'white',
        'Extinto a Nivel Regional': 'white',
        'En Peligro Crítico': 'white',
        'En Peligro': 'black',
        'Vulnerable': 'black'
      }
    }
  },
  mounted() {
    if (process.isClient) {
      console.log(this.taxonomy4Chart)
      let tree = new mitchTree.boxedTree({
        theme: 'custom',
        data: this.taxonomy4Chart[0],
        element: document.getElementById('mitchTree'),
        nodeDepthMultiplier: 200,
        allowFocus: true,
        widthWithoutMargins: 1400,
        allowNodeCentering: false,
        margins: {top:0, bottom: 0, left: -350, right: 0},
        nodeSettings: {
          verticalSpacing: 25, bodyBoxWidth: 150, bodyBoxHeight: 60, sizingMode: 'nodeSize'
        }
      })
        .setIdAccessor((data) => {return data.name})
        .setChildrenAccessor((data) => {return data.children})
        .setBodyDisplayTextAccessor((data) => {
          if (data.risk) {
            return data.name + '\n(' + riskText(data.risk, this.$i18n.locale.substr(0, 2)) + ')'
          }
          return data.name;
        })
        .on('nodeClick', this.nodeClickHandler)
        .initialize()

        let self = this

        // Change style of terminal nodes depending on risk value
        tree.update = function(nodeDataItem) {
          this.__proto__.update.call(this, nodeDataItem)
          if (nodeDataItem.data.children[0].risk) {
            let elements = document.getElementsByClassName('body-box')
            let n = nodeDataItem.data.children.length
            for (let i = n; i > 0; i--) {
              elements[elements.length - i].nextElementSibling.childNodes.forEach((child) => {
                child.style.fill = self.riskTextColors[nodeDataItem.data.children[n-i].risk]
              })
              elements[elements.length - i].style.fill = self.riskColor(nodeDataItem.data.children[n-i].risk)
            }
          }
        }
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
    },
    riskColor(r) {
      return d3.rgb(this.riskColors[r]).darker(0.2).formatHex()
    }
  }
}

</script>
