<template>
  <div style="max-width: 900px;">
    <div class="box content">
      <div class="has-text-centered">
        <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/occurrence/' + occurrence.gbifID" target="_blank">
          {{$t('label.occurrence')}} <span v-if="occurrence.eventDate">({{$d(new Date(occurrence.eventDate), 'longdateonly')}})</span> <font-awesome size="sm" :icon="['fas', 'external-link-alt']"/>
        </a>
        <br>
        <h4 class="title-5" v-html="occurrenceMore.gbifClassification.usage.formattedName"></h4>
        <div v-if="occurrence.iucnRedListCategory" class="has-text-weight-semibold">{{$t('label.iucnredlistcategory')}}: {{occurrence.iucnRedListCategory}} - {{ $t('label.' + occurrence.iucnRedListCategory) }}</div>
      </div>
      <hr>
      <div v-if="occurrenceMore.primaryImage && occurrenceMore.primaryImage.identifier" style="margin-left: auto; margin-right: auto;">
        <figure>
          <img height="240" width="240" :src="'https://api.gbif.org/v1/image/unsafe/240x240/' + occurrenceMore.primaryImage.identifier">
        </figure>
      </div>
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.summary')}}</div>
      <dl style="display: grid; grid-template-columns: minmax(75px, 150px) 1fr;">
        <dt>{{$t('label.scientificname')}}</dt>
        <dd v-html="occurrenceMore.gbifClassification.usage.formattedName"></dd>
        <dt>{{$t('label.taxonomy')}}</dt>
        <dd>{{occurrence.kingdom}} &gt; {{occurrence.phylum}} &gt; {{occurrence.class}} &gt; {{occurrence.order}} &gt; {{occurrence.family}} &gt; {{occurrence.genus}}</dd>
        <dt>{{$t('label.dataset')}}</dt>
        <dd>
          <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/dataset/' + occurrence.datasetKey" target="_blank">
            {{occurrenceMore.datasetTitle}} <font-awesome size="sm" :icon="['fas', 'external-link-alt']"/>
          </a>
        </dd>
        <dt>{{$t('label.basisofrecord')}}</dt>
        <dd>{{gbifTranslations.basisOfRecord[$i18n.locale.substr(0, 2)][occurrence.basisOfRecord]}}</dd>
      </dl>
      <div class="d-heading has-text-weight-semibold has-text-centered"><span style="text-transform:capitalize;">{{$t('label.record')}}</span></div>
      <dl style="display: grid; grid-template-columns: minmax(75px, 150px) 1fr;">
        <dt>{{$t('label.recordid')}}</dt>
        <dd>
          <a v-if="occurrence.occurrenceID.toLowerCase().startsWith('http')" :href="occurrence.occurrenceID" target="_blank">{{occurrence.occurrenceID}} </span> <font-awesome size="sm" :icon="['fas', 'external-link-alt']"/></a>
          <span v-else>{{occurrence.occurrenceID}}</span>
        </dd>
        <dt>{{$t('label.occurrencestatus')}}</dt>
        <dd>{{occurrenceStatuses[occurrence.occurrenceStatus][$i18n.locale.substr(0, 2)]}}</dd>
        <dt>{{$t('label.publisher')}}</dt>
        <dd>{{occurrenceMore.publisherTitle}}</dd>
        <dt>{{$t('label.publishingcountry')}}</dt>
        <dd>{{gbifTranslations.country[$i18n.locale.substr(0, 2)][occurrence.publishingCountry]}}</dd>
        <dt v-if="occurrenceMore.institution">{{$t('label.institution')}}</dt>
        <dd v-if="occurrenceMore.institution">{{occurrenceMore.institution.name}}</dd>
        <dt>{{$t('label.license')}}</dt>
        <dd><a :href="occurrence.license" target="_blank">{{licenseTypes[occurrence.license]}} </span> <font-awesome size="sm" :icon="['fas', 'external-link-alt']"/></a></dd>
        <dt>{{$t('label.rightsholder')}}</dt>
        <dd>{{occurrence.rightsHolder}}</dd>
      </dl>
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.localization')}}</div>
      <dl style="display: grid; grid-template-columns: minmax(75px, 150px) 1fr; word-break: break-word;">
        <dt>{{$t('label.country')}}</dt>
        <dd>{{gbifTranslations.country[$i18n.locale.substr(0, 2)][occurrence.countryCode]}}</dd>
        <dt v-if="occurrence.gadm.level0">GADM</dt>
        <dd v-if="occurrence.gadm.level0">{{occurrence.gadm.level0.name}} &gt; {{occurrence.gadm.level1.name}} &gt; {{occurrence.gadm.level2.name}}</dd>
        <dt v-if="occurrence.verbatimLocality">{{$t('label.locality')}}</dt>
        <dd v-if="occurrence.verbatimLocality">{{occurrence.verbatimLocality}}</dd>
        <dt>{{$t('label.coordinates')}}</dt>
        <dd>{{$t('label.latitude')}}: {{occurrence.decimalLatitude}}, {{$t('label.longitude')}}: {{occurrence.decimalLongitude}}</dd>
        <dt v-if="occurrence.coordinateUncertaintyInMeters">{{$t('label.coordinateuncertainity')}}</dt>
        <dd v-if="occurrence.coordinateUncertaintyInMeters">{{$n(occurrence.coordinateUncertaintyInMeters)}} m</dd>
      </dl>
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.citation')}}
        <a title="Copiar" class="copy-citation-to-clipboard" :data-clipboard-text="occurrenceMore.dataset.citation.text">
          <font-awesome :icon="['far', 'copy']"/>
        </a>
      </div>
      <div>{{occurrenceMore.dataset.citation.text}}</div>
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

import ClipboardJS from 'clipboard'
let clipboard

  export default {
    name: 'OccurrenceDetails',
    props: {
      occurrence: { type: Object, required: true },
      occurrenceMore: { type: Object, required: true }
    },
    data() {
      return {
        gbifTranslations: {},
        occurrenceStatuses: {
          PRESENT: {es: 'Presente', en: 'Present'},
          ABSENT: {es: 'Ausente', en: 'Absent'}
        },
        licenseTypes: licenseTypes
      }
    },
    created() {
      this.gbifTranslations = loadGbifTranslations(this.$static.allGbifTranslations)
    },
    mounted() {
      clipboard = new ClipboardJS('.copy-citation-to-clipboard')
    },
    beforeDestroy() {
      clipboard.destroy()
    }
  }

</script>
