<template>
  <div id="chart-content">
    <b-loading :is-full-page="true" v-model="isCapturing"></b-loading>

    <div style="display: flex; flex-wrap: wrap;">
      <div v-for="entry in Object.entries(riskColors)" class="legend-box">
        <div class="legend-item" :style="'background: ' + riskColor(entry[0]) + ';'">
        </div>
        <div class="is-size-7" style="padding-left: 4px">
          {{riskText(entry[0])}}
        </div>
      </div>
    </div>
    <div v-show="!isCapturing" class="chart-controls" style="display: flex; flex-wrap: wrap;">
      <b-dropdown style="display: fit-content; white-space: nowrap;" :mobile-modal="false">
        <a slot="trigger"><font-awesome :icon="['fas', 'info-circle']" /></a>
        <b-dropdown-item custom>
          <p class="has-text-left is-size-7" v-html="$static.faunaRbContent.chartHelpText[$i18n.locale.substr(0, 2)]">
          </p>
        </b-dropdown-item>
      </b-dropdown>
      <a id="download-file" download="list.csv" ref="download" :href="downloadLink">{{downloadLink}}</a>
      &nbsp;<a @click="confirmDownload()" :title="$t('label.download')"><font-awesome :icon="['fas', 'download']"/></a>
      <div style="flex-grow: 1;"></div>
      &nbsp;<a @click="confirmScreenShot()" :title="$t('label.screenshot')"><font-awesome :icon="['fas', 'camera']"/></a>
    </div>
    <div style="margin-left: auto; margin-top: 0rem; overflow-x: scroll;" id="chart"></div>
    <audio id="cameraClick" src="/sound/camera-shutter-click.mp3"></audio>
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

<static-query>
  query {
    faunaRbContent (id: "faunarb") {
      chartHelpText {
        en
        es
      }
    }
  }
</static-query>

<script>
import SunBurst from 'sunburst-chart'
import * as d3 from 'd3'

import {riskText} from '~/utils/misc'
import {riskColors} from '~/utils/config'
import confirmDownload from '~//mixins/confirmDownload.js'
import confirmScreenshot from '~//mixins/confirmScreenshot.js'

const colorClass = d3.scaleOrdinal(d3.schemeSet3)

const colorHigh =  d3.scaleOrdinal(d3.schemeDark2)

export default {
  name: 'TaxonomyChart',
  props: {
    taxonomy4Chart: { type: Array, required: true },
    newTabLinks: { type: Boolean }
  },
  mixins: [confirmDownload, confirmScreenshot],
  data() {
    return {
      chart: null,
      riskColors: riskColors,
      highRankTaxonColors: {
        Animalia: '#178867',
        Chordata: '#CECDCB',
        Arthropoda: '#7570b3',
        Mollusca: '#e729aa',
        Cnidaria: '#D8BEA2'
      },
      innerWidth: 0,
      currentNode: this.taxonomy4Chart[0],
      downloadLink: null,
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
      if (n && n.link) {
        window.open('https://especiesamenazadas.org/taxon' + n.link, this.newTabLinks ? '_blank' :'_self')
      } else {
        this.currentNode = n ? n : this.taxonomy4Chart[0]
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
          return this.highRankTaxonColors[n.name]
        }
      }
    },
    riskColor(r) {
      return d3.rgb(this.riskColors[r]).darker(0.2).formatHex()
    },
    riskText(r) {
      return riskText(r, this.$i18n.locale.substr(0, 2))
    },
    traverse(n, list) {
      if (n.children) {
        n.children.forEach(child => {
          this.traverse(child, list)
        })
      } else {
        list.push(n.hierarchy + ',' + n.name + ',' + this.riskText(n.risk) + ',' + 'https://especiesamenazadas.org/taxon' + n.link)
      }
    },
    getListCSV() {
      let list = []
      this.traverse(this.currentNode, list)
      list.sort().unshift(this.$t('label.taxonomy') + ',' + this.$t('label.species') + ',' + this.$t('label.category') + ',' + this.$t('label.link'))
      this.doDownload(list)
    }
  }
}

</script>
