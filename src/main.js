import '~/assets/style/index.scss'

import Buefy from 'buefy'
import Vuex from 'vuex'

import DefaultLayout from '~/layouts/Default.vue'

import VueCookieAcceptDecline from 'vue-cookie-accept-decline'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faEdit, faPlusSquare, faMinusSquare, faNewspaper, faCopy } from '@fortawesome/free-regular-svg-icons'
import { faFacebookF, faTwitter, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faFileDownload, faDownload, faMapMarkedAlt, faTimes, faBars, faAngleDown,
  faAngleUp, faSearch, faTrashAlt, faCloudUploadAlt, faPlus, faCheck, faExclamationCircle,
  faTimesCircle, faExclamationTriangle, faAngleLeft, faAngleRight, faCalendar, faArrowUp,
  faTag, faRss, faGlobe, faLink, faUndo, faChevronUp, faTrash, faFilter, faSpinner, faCaretDown, faCaretUp,
  faCaretRight, faInfoCircle, faExternalLinkAlt, faCamera
} from '@fortawesome/free-solid-svg-icons'

import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
library.add(
  faUser, faEdit, faFileDownload, faDownload, faMapMarkedAlt, faFacebookF, faTwitter,
  faInstagram, faGithub, faTimes, faBars, faAngleDown, faAngleUp, faSearch, faTrashAlt,
  faCloudUploadAlt, faPlus, faCheck, faPlusSquare, faMinusSquare, faExclamationCircle,
  faTimesCircle, faExclamationTriangle, faAngleLeft, faAngleRight, faCalendar, faArrowUp,
  faNewspaper, faTag, faRss, faGlobe, faLink, faCopy, faUndo, faChevronUp, faTrash, faFilter,
  faSpinner, faCaretDown, faCaretUp, faCaretRight, faInfoCircle, faExternalLinkAlt, faCamera
)

export default function (Vue, { router, head, isClient, appOptions }) {

  appOptions.i18n.setLocaleMessage('es-ve', require('./messages/messages.json').es)
  appOptions.i18n.setLocaleMessage('en-us', require('./messages/messages.json').en)

  Vue.use(Buefy, {defaultIconComponent: 'font-awesome', defaultIconPack: 'fas'})

  Vue.prototype.$eventBus = new Vue({})

  Vue.component('Layout', DefaultLayout)

  Vue.component('font-awesome', FontAwesomeIcon)

  Vue.component('vue-cookie-accept-decline', VueCookieAcceptDecline)
}
