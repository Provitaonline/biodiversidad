<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$t('label.mainbanner')"></h1>
    </template>
    <div style="padding-bottom: 0px;" class="section container has-text-centered">
      <div class="content" v-html="$page.homeContent.intro[$i18n.locale.substr(0, 2)]"></div>
    </div>
    <div class="section card-section">
      <div class="row">
        <div v-for="item in $page.homeContent.cards" class="column">
            <div class="card is-child menu-card">
              <g-link :to="$tp(item.link)">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <g-image :immediate="true" :src="item.image"/>
                  </figure>
                </div>
              </g-link>
              <div class="card-content has-text-centered" style="padding: 4px;">
                <div class="content">
                  <div class="box is-size-4 is-size-5-mobile has-text-weight-medium explore-title">{{item.title[$i18n.locale.substr(0, 2)]}}</div>
                  <span v-html="item.summary[$i18n.locale.substr(0, 2)]"></span>
                  <br><br>
                </div>
              </div>
              <div class="menu-card-button" >
                <g-link :to="$tp(item.link)">
                  <button class="button is-primary">{{$t('label.explore')}}</button>
                </g-link>
              </div>
            </div>
        </div>
      </div>
    </div>

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
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }

  .card-content {
    height: 265px;
  }

  @media screen and (max-width: 1024px) and (min-width: 769px)  {
    .card-content {
      height: 265px;
    }
  }

  @media screen and (min-width: 1279px)  {
    .card-content {
      height: 200px;
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

  .row {
    display: flex;
    flex-wrap: wrap;
  }

  .column {
    flex: 20%;
    padding: 10px;
  }

  @media screen and (max-width: 992px) {
    .column {
      flex: 50%;
    }
  }

  @media screen and (max-width: 600px) {
    .row {
      flex-direction: column;
    }
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
    let hash = this.$route.hash
    if (hash.includes('invite_token') || hash.includes('recovery_token')) window.location.href = 'admin' + hash
  },
  methods: {

  }
}
</script>
