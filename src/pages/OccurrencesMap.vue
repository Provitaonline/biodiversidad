<template>
  <Layout>
    <template slot="banner">
      <h1 class="title is-uppercase has-text-centered">
        Datos GBIF de Venezuela<br>Mapa de registros de presencia
      </h1>
    </template>
    <br>
    <div class="columns is-gapless">
      <InteractiveMap class="column"/>
    </div>

  </Layout>
</template>


<style>

</style>

<script>
import {getGbifOccurrences, getSpeciesSuggestions, getGbifDatasets, getGbifDatasetDetail} from '~/utils/data'

import InteractiveMap from '~/components/InteractiveMap.vue'

export default {
  metaInfo() {
    return {
      title: this.$t('label.occurrencesmap'),
      titleTemplate: '%s - ' + this.$t('label.site')
    }
  },
  data() {
    return {

    }
  },
  components: {
    InteractiveMap
  },
  mounted() {

  },
  methods: {

  }
}
</script>
