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
    </section>
  </Layout>
</template>

<style lang="scss" scoped>

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
import slugify from 'slugify'

export default {
  metaInfo() {
    return {
      title: this.$t('label.ecosystems'),
      titleTemplate: '%s - ' + this.$t('label.site')
    }
  },
  data() {
    return {
      threatCategories: {}
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
    }
  }
}
</script>
