<template>
  <div>
    <div style="display: flex; flex-wrap: wrap;">
      <div v-for="entry in Object.entries(riskColors)" class="legend-box">
        <div class="legend-item" :style="'background: ' + riskColor(entry[0]) + ';'">
        </div>
        <div class="is-size-7" style="padding-left: 4px">
          {{entry[0]}}
        </div>
      </div>
    </div>
    <div style="margin: auto; overflow-x: scroll;" id="chart"></div>
  </div>
</template>

<style lang="scss" scoped>

  ::v-deep .sunburst-viz .tooltip {
    max-width: none;
  }

  ::v-deep .sunburst-viz>svg {
    display: block;
    margin: auto;
  }

  .legend-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    margin-bottom: 6px;
    padding-right: 6px;
  }

  .legend-item {
    height: 14px;
    width: 18px;
  }

</style>

<script>
import SunBurst from 'sunburst-chart'
import * as d3 from 'd3'

const colorClass = d3.scaleOrdinal(d3.schemeSet3)

const colorHigh =  d3.scaleOrdinal(d3.schemeDark2)

export default {
  name: 'TaxonomyChart',
  props: {
    taxonomy4Chart: { type: Array, required: true },
    newTabLinks: { type: Boolean }
  },
  data() {
    return {
      chart: null,
      riskColors: {
        'Extinto': '#060000',
        'Extinto a Nivel Regional': '#970f11',
        'En Peligro Crítico': '#E91C1F',
        'En Peligro': '#FFA500',
        'Vulnerable': '#FFFF00'
      },
      innerWidth: 0
    }
  },
  mounted() {
    if (process.isClient) {
      let chartElement = document.getElementById('chart')

      this.chart = SunBurst()
      this.chart.data(this.taxonomy4Chart[0])
        .width(window.innerWidth*0.8)
        .height(window.innerHeight*0.8)
        .centerRadius(0.05)
        .radiusScaleExponent(1)
        (chartElement)

      this.innerWidth = window.innerWidth // Save initial value
      window.addEventListener('resize', this.resizeChart)

      this.chart.onClick(this.itemClicked)
      this.chart.color(this.getColor)
    }
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    resizeChart() {
      if (this.innerWidth !== window.innerWidth) { // Only if width actually changed
        this.innerWidth = window.innerWidth
        this.chart.width(window.innerWidth*0.8).height(window.innerHeight*0.8)
      }
    },
    itemClicked(n) {
      console.log(n)
      if (n && n.link) {
        //window.location.href = 'https://especiesamenazadas.org/taxon' + n.link
        window.open('https://especiesamenazadas.org/taxon' + n.link, this.newTabLinks ? '_blank' :'_self')
      } else {
        this.chart.focusOnNode(n)
      }
    },
    getColor(n) {
      if (n.level === 6) {
        return this.riskColor(n.risk)
      } else {
        if (n.level > 1) {
          let c = d3.rgb(colorClass(n.class))
          return c.darker((n.level*5)/10)
        } else {
          return colorHigh(n.name)
        }
      }
    },
    riskColor(r) {
      return d3.rgb(this.riskColors[r]).darker(0.2).formatHex()
    }
  }
}

</script>
