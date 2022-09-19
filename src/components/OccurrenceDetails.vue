<template>
  <div style="max-width: 900px;">
    <div class="box content">
      <div class="has-text-centered">
        <span>{{$t('label.occurrence')}} ({{$d(new Date(occurrence.eventDate), 'longdateonly')}})</span><br>
        <h4 class="title-5">{{occurrence.scientificName}}</h4>
      </div>
      <hr>
      <div>Summary</div>
      <dl style="display: grid; grid-template-columns: minmax(75px, 150px) 1fr;">
        <dt>{{$t('label.scientificname')}}</dt>
        <dd>{{occurrence.scientificName}}</dd>
        <dt>{{$t('label.taxonomy')}}</dt>
        <dd>{{occurrence.kingdom}} &gt; {{occurrence.phylum}} &gt; {{occurrence.class}} &gt; {{occurrence.order}} &gt; {{occurrence.family}} &gt; {{occurrence.genus}}</dd>
        <dt>{{$t('label.dataset')}}</dt>
        <dd>{{occurrence.datasetName}}</dd>
        <dt>{{$t('label.basisofrecord')}}</dt>
        <dd>{{occurrence.basisOfRecord}}</dd>
      </dl>
      <div>Citation</div>
      <div>{{dataset.citation.text}}</div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'OccurrenceDetails',
    props: {
      occurrence: { type: Object, required: true },
      dataset: { type: Object, required: true }
    },
    data() {
      return {
      }
    },
    created() {
      console.log(this.dataset)
    }
  }

</script>
