import VueGtag from 'vue-gtag'

export default function (Vue, { isServer: disabled, router }) {
  if(process.isClient) {
    Vue.use(VueGtag, {
      config: { id: 'G-E07PJGQ7ZQ' }
    }, router)
  }
}
