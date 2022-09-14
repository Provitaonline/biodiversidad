<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.aboutContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <section class="content section" v-html="$page.aboutContent.summaryText[$i18n.locale.substr(0, 2)]"></section>
  </Layout>
</template>

<page-query>
  query {
    aboutContent (id: "about") {
      bannerText {
        en
        es
      }
      summaryText {
        en
        es
      }
    }
  }
</page-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$t('label.about'),
      titleTemplate: '%s - ' + this.$t('label.site')
    }
  },
}
</script>
