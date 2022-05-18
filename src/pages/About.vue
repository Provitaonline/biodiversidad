<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        {{ $t('label.about') }}
      </h1>
    </template>
    <section class="section has-text-centered">
      <p>Prototipo del portal Provita de biodiversidad en Venezuela. Incluye acceso a datos alojados en la <a href="https://www.gbif.org/es/">Infraestructura Mundial de Información en Biodiversidad (GBIF)</a>.</p>
    </section>
  </Layout>
</template>

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
