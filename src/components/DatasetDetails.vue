<template>
  <div style="max-width: 900px;">
    <div class="box content">
      <div class="has-text-centered">
        <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/dataset/' + dataset.key" target="_blank">
          {{$t('label.dataset')}}<span v-if="dataset.created">({{$d(new Date(dataset.created), 'longdateonly')}})</span>&nbsp;<font-awesome size="sm" :icon="['fas', 'external-link-alt']"/>
        </a>
        <h4 class="title-5">{{dataset.title}}</h4>
        <h6 class="title-6">{{dataset.typeExpanded}}</h6>
        {{$t('label.publishedby')}}: <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/publisher/' + dataset.publishingOrganizationKey" target="_blank">{{dataset.publishingOrganizationTitle}} <font-awesome size="sm" :icon="['fas', 'external-link-alt']"/></a>
        <br>
        {{$t('label.license')}}: <a :href="dataset.license" target="_blank">{{licenseTypes[dataset.license]}} </span> <font-awesome size="sm" :icon="['fas', 'external-link-alt']"/></a>
      </div>
      <hr>
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.description')}}</div>
      <div v-html="dataset.description"></div>
      <div v-if="dataset.geographicCoverages && dataset.geographicCoverages.length">
        <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.geographicscope')}}</div>
        <div v-for="gc in dataset.geographicCoverages">
          <div v-html="gc.description"></div>
        </div>
      </div>
      <div v-if="dataset.taxonomicCoverages && dataset.taxonomicCoverages.length">
        <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.taxonomicscope')}}</div>
        <div v-for="tc in dataset.taxonomicCoverages">
          <div v-html="tc.description"></div><br>
          <div class="tags" style="margin-bottom: 5px;">
            <span class="tag is-light" v-for="(c, idx) in sortedCoverages(tc.coverages)">{{c.scientificName}}</span>
          </div>
        </div>
      </div>
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.citation')}}</div>
      <div>{{dataset.citation.text}}</div>

    </div>
  </div>
</template>

<style>

  .d-heading {
      background: rgb(245, 245, 245);
      padding-top: 10px;
      padding-bottom: 10px;
      border-style: solid;
      border-color: rgb(238, 238, 238);
      border-width: 1px 0px;
      margin-right: auto;
  }

</style>

<static-query>
  query  {
    allGbifTranslations: allGbifTranslations {
      edges {
        node {
          id
          en
          es
        }
      }
    }
  }
</static-query>

<script>
import {loadGbifTranslations} from '~/utils/misc'
import {licenseTypes} from '~/utils/config'

  export default {
    name: 'DatasetDetails',
    props: {
      dataset: { type: Object, required: true }
    },
    data() {
      return {
        gbifTranslations: {},
        licenseTypes: licenseTypes,
      }
    },
    created() {
      this.gbifTranslations = loadGbifTranslations(this.$static.allGbifTranslations)
    },
    methods: {
      sortedCoverages(coverages) {
        return coverages.sort((a, b) => {
          const nameA = a.scientificName.toUpperCase()
          const nameB = b.scientificName.toUpperCase()
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        })
      }
    }
  }

</script>
