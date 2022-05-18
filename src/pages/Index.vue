<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        PORTAL PROVITA DE BIODIVERSIDAD DE VENEZUELA
      </h1>
    </template>
    <section class="section card-section">
      <div class="tile is-ancestor">
        <div class="tile">
          <div v-for="item in $page.homeContent.cards" class="tile is-parent" style="flex-direction: column;">
            {{item.title.en}}
          </div>
        </div>
      </div>
    </section>

  </Layout>
</template>


<style>

</style>

<page-query>
  query  {
    homeContent (id: "home") {
      cards {
        title {
          en
          es
        }
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
    console.log(this.$page.homeContent)
  },
  methods: {

  }
}
</script>
