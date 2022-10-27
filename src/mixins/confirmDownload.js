export default {
  methods: {
    confirmDownload() {
      this.$buefy.dialog.confirm({
        message: this.$t('label.downloadspecieslist'),
        cancelText: this.$t('label.cancel'),
        confirmText: 'Ok',
        onConfirm: () => {
          this.$buefy.toast.open(this.$t('label.datadownloaded'))
          this.getListCSV()
        }
      })
    },
    doDownload(list) {
      this.downloadLink = URL.createObjectURL(new Blob([list.join('\r\n')], {type: 'text/csv'}))
      this.$nextTick(() => {
        this.$refs.download.click()
        URL.revokeObjectURL(this.downloadLink)
        this.downloadLink = null
        this.isLoading = false
      })
    }
  }
}
