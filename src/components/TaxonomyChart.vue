<template>
  <div>
    <div style="overflow-x: scroll;" id="chart"></div>
  </div>
</template>

<style lang="scss" scoped>

  ::v-deep .sunburst-viz .tooltip {
    max-width: none;
  }

</style>

<script>
import SunBurst from 'sunburst-chart'
import * as d3 from 'd3'

export default {
  name: 'TaxonomyChart',
  props: {
    taxonomy4Chart: { type: Array, required: true }
  },
  data() {
    return {
    }
  },
  mounted() {
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
  }
}

</script>
