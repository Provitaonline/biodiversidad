<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.ecosystemsContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <div class="section container has-text-centered" v-html="$page.ecosystemsContent.summaryText[$i18n.locale.substr(0, 2)]"></div>
    <div class="section container">
      <b-tabs @input="tabChanged" v-model="activeTab" type="is-boxed">
        <b-tab-item value="plantformations" active :label="$t('label.plantformations')">
          <div class="tile box is-ancestor is-size-6 is-size-7-mobile">
            <div class="tile is-parent" style="flex-wrap: wrap;">
              <div v-for="item in $page.vcards.edges" class="tile is-child is-6">
                <div class="vcard-frame">
                  <div class="media">
                    <figure class="media-left">
                      <a :href="'https://ecosistemasamenazados.org/fichas/' + makeLink(item.node.title)"><g-image :src="item.node.cardimage"></g-image></a>
                    </figure>
                    <div>
                      <div style="display: flex;">
                        <b-tooltip :label="riskText(threatCategories[item.node.category].text, $i18n.locale.substr(0, 2))" position="is-top" type="is-warning">
                          <div class="iconInTable">
                            <img :src="threatCategories[item.node.category].img.src"></img>
                          </div>
                        </b-tooltip>
                        &nbsp;&nbsp;<a :href="'https://ecosistemasamenazados.org/fichas/' + makeLink(item.node.title)"><strong v-html="item.node.title"></strong></a>
                      </div>
                      <div is-size-7 style="margin-left: 38px;" v-if="item.node.areain2010">
                        {{$n(item.node.areain1988)}} km<sup>2</sup> {{$t('label.in')}} 1988<br>
                        <hr class="skinny">
                        {{$n(item.node.areain2010)}} km<sup>2</sup> {{$t('label.in')}} 2010<br>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item value="bystate" active>
          <template #header>
            <span>{{$t('label.bystate')}}</span>
            <span @click="closeAllDetails" v-if="openedStates.length">&nbsp;<font-awesome :icon="['fas', 'angle-up']"/></span>
          </template>
          <b-table
            :data="plantFormations.byState"
            ref="table"
            detailed
            hoverable
            custom-detail-row
            detail-key="state"
            :opened-detailed="openedStates"
            @details-open="detailsChanged"
            @details-close="detailsChanged"
            :mobile-cards="false"
            :show-detail-icon="true">
            <b-table-column width="50%" style="text-align: left;" field="state">
              <template v-slot:header="{ column }">
                {{openedStates.length ? $t('label.plantformations') : ''}}
              </template>
              <template v-slot="props">
                <b>{{ props.row.state }}</b>
              </template>
            </b-table-column>
            <b-table-column  field="area" numeric>
              <template v-slot:header="{ column }">
                {{openedStates.length ? $t('label.area') : ''}}
              </template>
              <template v-slot="props">
              </template>
            </b-table-column>
            <b-table-column  field="percentState" numeric>
              <template v-slot:header="{ column }">
                {{openedStates.length ? '% ' + $t('label.state') : ''}}
              </template>
              <template v-slot="props">
              </template>
            </b-table-column>
            <b-table-column field="percentCountry" numeric>
              <template v-slot:header="{ column }">
                <div v-html="openedStates.length ? '% ' + $t('label.country') : ''"></div>
              </template>
              <template v-slot="props">
              </template>
            </b-table-column>
            <b-table-column field="percentOverTotal" numeric>
              <template v-slot:header="{ column }">
                <div v-html="openedStates.length ? '% / ' + $t('label.total') : ''"></div>
              </template>
              <template v-slot="props">
              </template>
            </b-table-column>
            <template slot="detail" slot-scope="props">
              <tr v-for="item, idx in props.row.plantFormations" :key="props.row.state + idx">
                <td></td>
                <td max-width="50%"><div style="padding-left: 10px;"><a :href="'https://ecosistemasamenazados.org/fichas/' + item.slug">{{item.plantFormation}}</a></div></td>
                <td><span style="float: right;" v-if="item.areaKm2">{{$n(item.areaKm2)}} km<sup>2</sup></span></td>
                <td><span style="float: right;" v-if="item.areaKm2">{{computePercent(item.areaKm2, props.row.stateTotal)}}</span></td>
                <td><span style="float: right;" v-if="item.areaKm2">{{computePercent(item.areaKm2, plantFormations.total)}}</span></td>
                <td><span style="float: right;" v-if="item.areaKm2">{{computePercent(item.areaKm2, plantFormations.formationTotals[item.plantFormation])}}</span></td>
              </tr>
            </template>
          </b-table>
        </b-tab-item>
      </b-tabs>
    </div>
  </Layout>
</template>

<style lang="scss" scoped>

  ::v-deep td {
    padding: 4px !important;
  }

  ::v-deep th {
    padding: 4px !important;
  }

  /*::v-deep .th-wrap {
    justify-content: flex-end;
  }*/

  .iconInTable {
    width: 30px;
    height: 30px;
  }

  .vcard-frame {
    height: calc(100% - 20px);
    margin: 10px;
    padding: 10px;
    border: 1px solid lightgray;
  }

  .skinny {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  @media screen and (max-width: 600px)  {
    ::v-deep .layout {
      padding: 4px;
    }
    ::v-deep .section {
      padding: 4px;
    }

    ::v-deep .box {
      padding: 4px;
    }
  }

</style>

<page-query>
  query {
    vcards: allRiskCard (sortBy: "title", order: ASC) {
      edges {
        node {
          title
          category
          cardimage (width: 100, height: 100, quality: 90)
          areain1988
          areain2010
        }
      }
    }
    ecosystemsContent (id: "ecosystems") {
      bannerText {
        en
        es
      }
      summaryText {
        en
        es
      }
    }
    labels (id: "labels") {
      global {
        threatCategories {
          code
          text
          img
        }
      }
    }
  }
</page-query>

<script>
const byState = require('/content/ecosystems/plant-formations-by-state.json')
import slugify from 'slugify'
import {computeFormationTotals, riskText} from '~/utils/misc'

//console.log(computeFormationTotals(byState))


export default {
  metaInfo() {
    return {
      title: this.$t('label.ecosystems'),
      titleTemplate: '%s - ' + this.$t('label.site')
    }
  },
  data() {
    return {
      threatCategories: {},
      plantFormations: computeFormationTotals(byState),
      openedStates: [],
      activeTab: 'plantformations',
    }
  },
  created() {
    this.$page.labels.global.threatCategories.forEach(item => {
      this.threatCategories[item.code] = {text: item.text, img: item.img}
    })
  },
  mounted() {
    this.restoreFromQueryParms()
  },
  methods: {
    makeLink(t) {
      return slugify(t.replaceAll('/', ' '), {lower: true})
    },
    computePercent(value, total) {
      let p = (100 * value / total).toFixed(1)
      return p === '0.0' ? '<' + this.$i18n.n(0.1) + '%': this.$i18n.n(p) + '%'
    },
    tabChanged() {
      this.updateQueryParms()
    },
    detailsChanged() {
      this.updateQueryParms()
    },
    closeAllDetails() {
      this.openedStates = []
      this.updateQueryParms()
    },
    updateQueryParms() {
      let query = {}
      if (this.activeTab !== 'plantformations') query.tab = this.activeTab
      if (this.openedStates.length) query.openedStates = JSON.stringify(this.openedStates)
      if (!(Object.keys(query).length === 0 && Object.keys(this.$route.query).length === 0)) this.$router.replace({query: query})
    },
    restoreFromQueryParms() {
      if (Object.keys(this.$route.query).length) {
        if (this.$route.query.tab) this.activeTab = this.$route.query.tab
        if (this.$route.query.openedStates) {
          try {
            let oS = JSON.parse(this.$route.query.openedStates)
            if (Array.isArray(oS)) this.openedStates = oS.filter(s => this.plantFormations.byState.some(pfS => pfS.state === s))
          } catch {}
        }
      }
    },
    riskText(r, locale) {
      return riskText(r, locale)
    }
  }
}
</script>
