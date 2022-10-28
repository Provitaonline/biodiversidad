import html2canvas from 'html2canvas'

export default {
  data() {
    return {
      isCapturing: false
    }
  },
  methods: {
    confirmScreenShot() {
      this.$buefy.dialog.confirm({
        message: this.$t('label.confirmscreenshot'),
        cancelText: this.$t('label.cancel'),
        confirmText: 'Ok',
        onConfirm: () => {
          this.screenShot()
        }
      })
    },
    async screenShot() {
      this.isCapturing = true
      document.getElementById('cameraClick').play()
      await this.$nextTick()
      let canvas = await html2canvas(document.getElementById('chart-content'))
      let link = document.createElement('a')
      link.setAttribute('download', 'chart.png')
      link.href = canvas.toDataURL()
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.isCapturing = false
    }
  }
}
