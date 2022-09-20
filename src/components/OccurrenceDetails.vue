<template>
  <div style="max-width: 900px;">
    <div class="box content">
      <div class="has-text-centered">
        <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/occurrence/' + occurrence.gbifID" target="_blank">
          {{$t('label.occurrence')}} ({{$d(new Date(occurrence.eventDate), 'longdateonly')}}) <font-awesome size="sm" :icon="['fas', 'external-link-alt']"/>
        </a>
        <br>
        <h4 class="title-5" v-html="occurrenceMore.gbifClassification.acceptedUsage.formattedName"></h4>
        <div v-if="occurrence.iucnRedListCategory" class="has-text-weight-semibold">{{$t('label.iucnredlistcategory')}}: {{occurrence.iucnRedListCategory}} - {{ $t('label.' + occurrence.iucnRedListCategory) }}</div>
      </div>
      <hr>
      <div v-if="occurrenceMore.primaryImage && occurrenceMore.primaryImage.identifier" style="margin-left: auto; margin-right: auto;">
        <figure>
          <a><img height="240" width="240" :src="'https://api.gbif.org/v1/image/unsafe/240x240/' + occurrenceMore.primaryImage.identifier"></a>
        </figure>
      </div>
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.summary')}}</div>
      <dl style="display: grid; grid-template-columns: minmax(75px, 150px) 1fr;">
        <dt>{{$t('label.scientificname')}}</dt>
        <dd v-html="occurrenceMore.gbifClassification.acceptedUsage.formattedName"></dd>
        <dt>{{$t('label.taxonomy')}}</dt>
        <dd>{{occurrence.kingdom}} &gt; {{occurrence.phylum}} &gt; {{occurrence.class}} &gt; {{occurrence.order}} &gt; {{occurrence.family}} &gt; {{occurrence.genus}}</dd>
        <dt>{{$t('label.dataset')}}</dt>
        <dd>
          <a :href="'https://gbif.org/' + $i18n.locale.substr(0, 2) + '/dataset/' + occurrence.datasetKey" target="_blank">
            {{occurrence.datasetName}} <font-awesome size="sm" :icon="['fas', 'external-link-alt']"/>
          </a>
        </dd>
        <dt>{{$t('label.basisofrecord')}}</dt>
        <dd>{{gbifTranslations.basisOfRecord[$i18n.locale.substr(0, 2)][occurrence.basisOfRecord]}}</dd>
      </dl>
      <div class="d-heading has-text-weight-semibold has-text-centered"><span style="text-transform:capitalize;">{{$t('label.record')}}</span></div>
      <dl style="display: grid; grid-template-columns: minmax(75px, 150px) 1fr;">
        <dt>{{$t('label.publisher')}}</dt>
        <dd>{{occurrenceMore.publisherTitle}}</dd>
        <dt>{{$t('label.publishingcountry')}}</dt>
        <dd>{{gbifTranslations.country[$i18n.locale.substr(0, 2)][occurrence.publishingCountry]}}</dd>
      </dl>
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.localization')}}</div>
      <dl style="display: grid; grid-template-columns: minmax(75px, 150px) 1fr; word-break: break-word;">
        <dt>{{$t('label.country')}}</dt>
        <dd>{{gbifTranslations.country[$i18n.locale.substr(0, 2)][occurrence.countryCode]}}</dd>
        <dt>GADM</dt>
        <dd>{{occurrence.gadm.level0.name}} &gt; {{occurrence.gadm.level1.name}} &gt; {{occurrence.gadm.level2.name}}</dd>
        <dt>{{$t('label.locality')}}</dt>
        <dd>{{occurrence.locality}}</dd>
        <dt>{{$t('label.coordinates')}}</dt>
        <dd>{{$t('label.latitude')}}: {{occurrence.decimalLatitude}}, {{$t('label.longitude')}}: {{occurrence.decimalLongitude}}</dd>
        <dt>{{$t('label.coordinateuncertainity')}}</dt>
        <dd v-if="occurrence.coordinateUncertaintyInMeters">{{$n(occurrence.coordinateUncertaintyInMeters)}} m</dd>
      </dl>
      <div class="d-heading has-text-weight-semibold has-text-centered">{{$t('label.citation')}}</div>
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

  export default {
    name: 'OccurrenceDetails',
    props: {
      occurrence: { type: Object, required: true },
      occurrenceMore: { type: Object, required: true }
    },
    data() {
      return {
        gbifTranslations: {}
      }
    },
    created() {
      this.gbifTranslations = loadGbifTranslations(this.$static.allGbifTranslations)
      console.log(this.occurrenceMore)
    }
  }

</script>
