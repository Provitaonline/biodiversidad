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
    }
  }
}
