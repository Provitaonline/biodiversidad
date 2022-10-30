<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered" v-html="$page.aboutContent.bannerText[$i18n.locale.substr(0, 2)]"></h1>
    </template>
    <section class="content section container">
      <div class="columns">
        <div class="column" v-html="$page.aboutContent.provita[$i18n.locale.substr(0, 2)]"></div>
      </div>
      <div class="columns">
        <div class="column" v-html="$page.aboutContent.mission[$i18n.locale.substr(0, 2)]"></div>
        <div class="column" v-html="$page.aboutContent.values[$i18n.locale.substr(0, 2)]"></div>
      </div>
      <div class="columns">
        <div class="column" v-html="$page.aboutContent.terms[$i18n.locale.substr(0, 2)]"></div>
      </div>
      <div class="columns">
        <div class="column" v-html="$page.aboutContent.contact[$i18n.locale.substr(0, 2)]"></div>
        <div class="column" v-html="$page.aboutContent.address1[$i18n.locale.substr(0, 2)]"></div>
        <div class="column" v-html="$page.aboutContent.address2[$i18n.locale.substr(0, 2)]"></div>
      </div>
    </section>
  </Layout>
</template>

<page-query>
  query {
    aboutContent (id: "about") {
      bannerText {
        en
        es
      }
      provita {
        en
        es
      }
      mission {
        en
        es
      }
      values {
        en
        es
      }
      terms {
        en
        es
      }
      contact {
        en
        es
      }
      address1 {
        en
        es
      }
      address2 {
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
