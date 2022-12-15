<template>
  <div style="max-width: 900px;">
    <div class="box content">
      <div class="has-text-centered">
        <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/dataset/' + dataset.key" target="_blank">
          {{$t('label.dataset')}}<span v-if="dataset.pubDate">({{$d(new Date(dataset.pubDate), 'longdateonly')}})</span>&nbsp;<font-awesome size="sm" :icon="['fas', 'external-link-alt']"/>
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
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.contacts')}}</div>
      <div class="is-flex is-flex-wrap-wrap is-justify-content-center">
        <div class="contact" v-for="contact in dataset.volatileContributors">
          <div class="has-text-weight-semibold">{{contact.firstName}} {{contact.lastName}}</div>
          <div class="has-text-weight-semibold">{{contact.organization}}</div>
          <div class="has-text-weight-medium"><small>{{contact.position[0]}}</small></div>
          <hr style="margin: 0px;">
          <div v-for="role in contact.roles"><small>{{tRole(role)}}</small></div>
          <div><a :href="'mailto:'+ contact.email[0]" target="_blank"><small>{{contact.email[0]}}</small></a></div>
        </div>
        <div v-if="dataset.volatileContributors.length % 2" class="empty-contact"></div>
      </div>
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.citation')}}
        <CopyTextToClipboard :text="dataset.citation.text"/>
      </div>
      <div>{{dataset.citation.text}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "~/assets/style/_variables";

  .d-heading {
      background: rgb(245, 245, 245);
      padding-top: 10px;
      padding-bottom: 10px;
      border-style: solid;
      border-color: rgb(238, 238, 238);
      border-width: 1px 0px;
      margin-right: auto;
  }

  .contact {
    width: 300px;
    padding: 5px;
    margin: 2px;
    border-style: solid;
    border-width: 1px;
    border-color: lightgray;
  }

  .empty-contact {
    width: 300px;
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

import CopyTextToClipboard from '~/components/CopyTextToClipboard.vue'

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
    components: {
      CopyTextToClipboard
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
      },
      tRole(role) {
        let t = this.gbifTranslations.role[this.$i18n.locale.substr(0, 2)][role]
        return t ? t : role
      }
    }
  }

</script>
