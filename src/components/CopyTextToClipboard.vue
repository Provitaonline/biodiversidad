<template>
  <b-tooltip :active="showCopiedMsg" :label="$t('label.copied')">
    <a :title="$t('label.copy')" class="copy-citation-to-clipboard" :data-clipboard-text="text">
      <font-awesome :icon="['far', 'copy']"/>
    </a>
  </b-tooltip>
</template>

<script>
import ClipboardJS from 'clipboard'
let clipboard

export default {
  name: 'CopyTextToClipboard',
  props: {
    text: { type: String, required: true }
  },
  data() {
    return {
      showCopiedMsg: false
    }
  },
  mounted() {
    clipboard = new ClipboardJS('.copy-citation-to-clipboard')
    clipboard.on('success', () => {
      this.showCopiedMsg = true
      setTimeout(() => {
        this.showCopiedMsg = false
      }, 1000)
    })
  },
  beforeDestroy() {
    clipboard.destroy()
  }
}
</script>
