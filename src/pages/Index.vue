<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$t('label.mainbanner')"></h1>
    </template>
    <section class="section has-text-centered">
      <br>
      {{ $page.homeContent.intro[$i18n.locale.substr(0, 2)] }}
    </section>
    <section class="section card-section">
      <div class="tile is-ancestor">
        <div class="tile">
          <div v-for="item in $page.homeContent.cards" class="tile is-parent" style="flex-direction: column;">
            <g-link :to="$tp(item.link)">
              <div class="card tile is-child menu-card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <g-image class="img-hover-effect" :src="item.image"/>
                  </figure>
                </div>
                <div class="card-content has-text-centered">
                  <div class="content">
                    <div class="box is-size-4 is-size-5-mobile has-text-weight-medium explore-title">{{item.title[$i18n.locale.substr(0, 2)]}}</div>
                    <span>{{item.summary[$i18n.locale.substr(0, 2)]}}</span>
                    <br><br>
                  </div>
                </div>
                <div class="menu-card-button" >
                  <button class="button is-primary">{{$t('label.explore')}}</button>
                </div>
              </div>
            </g-link>
          </div>
        </div>
      </div>
    </section>

  </Layout>
</template>


<style lang="scss" scoped>

  @import "~/assets/style/_variables";

  .card-section {
    /* padding-top: 88px;
    padding-bottom: 88px; */
    max-width: 1400px;
    margin: 0 auto;
  }

  .card {
    box-shadow: none;
  }

  .card-content {
    height: 200px;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }

  @media screen and (max-width: 1024px) and (min-width: 769px)  {
    .card-content {
      height: 260px;
    }
  }

  @media screen and (min-width: 1279px)  {
    .card-content {
      height: 170px;
    }
  }

  .card-image {
    /* padding: 10%; */
  }

  .menu-card:hover {
    box-shadow: 0 2px 44px 0 rgba(0, 0, 0, 0.14);
  }

  .menu-card {
    box-shadow: none;
  }

  .menu-card-button {
    display: flex;
    justify-content: center;
    padding: 10px 10px 28px;
  }

  .explore-title {
    color: $primary;
    margin: 0;
    box-shadow: none;
  }

</style>

<page-query>
  query  {
    homeContent (id: "home") {
      intro {
        en
        es
      }
      cards {
        title {
          en
          es
        }
        summary {
          en
          es
        }
        link
        image
      }
    }
  }
</page-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$t('label.main'),
      titleTemplate: '%s - ' + this.$t('label.site')
    }
  },
  data() {
    return {

    }
  },
  components: {
  },
  mounted() {
  },
  methods: {

  }
}
</script>
