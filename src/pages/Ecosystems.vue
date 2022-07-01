<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        {{ $t('label.ecosystems') }}
      </h1>
    </template>
    <section class="section has-text-centered">
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    </section>
    <section class="section">
      <b-tabs type="is-boxed">
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
                        <b-tooltip :label="threatCategories[item.node.category].text" position="is-top" type="is-warning">
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
        <b-tab-item value="bystate" active :label="$t('label.bystate')">
          <b-table
            :data="plantFormations.byState"
            ref="table"
            detailed
            hoverable
            custom-detail-row
            detail-key="state"
            :opened-detailed="openedStates"
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
    </section>
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
import {computeFormationTotals} from '~/utils/misc'

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
      openedStates: []
    }
  },
  created() {
    this.$page.labels.global.threatCategories.forEach(item => {
      this.threatCategories[item.code] = {text: item.text, img: item.img}
    })
  },
  mounted() {
  },
  methods: {
    makeLink(t) {
      return slugify(t, {lower: true})
    },
    computePercent(value, total) {
      let p = (100 * value / total).toFixed(1)
      return p === '0.0' ? '<0.1%': p + '%'
    }
  }
}
</script>
