import '~/assets/style/index.scss'

import Buefy from 'buefy'
import Vuex from 'vuex'

import DefaultLayout from '~/layouts/Default.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faEdit, faPlusSquare, faMinusSquare, faNewspaper, faCopy } from '@fortawesome/free-regular-svg-icons'
import { faFacebookF, faTwitter, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faFileDownload, faDownload, faMapMarkedAlt, faTimes, faBars, faAngleDown,
  faAngleUp, faSearch, faTrashAlt, faCloudUploadAlt, faPlus, faCheck, faExclamationCircle,
  faTimesCircle, faExclamationTriangle, faAngleLeft, faAngleRight, faCalendar, faArrowUp,
  faTag, faRss, faGlobe, faLink, faUndo, faChevronUp, faTrash, faFilter, faSpinner
} from '@fortawesome/free-solid-svg-icons'

import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
library.add(
  faUser, faEdit, faFileDownload, faDownload, faMapMarkedAlt, faFacebookF, faTwitter,
  faInstagram, faGithub, faTimes, faBars, faAngleDown, faAngleUp, faSearch, faTrashAlt,
  faCloudUploadAlt, faPlus, faCheck, faPlusSquare, faMinusSquare, faExclamationCircle,
  faTimesCircle, faExclamationTriangle, faAngleLeft, faAngleRight, faCalendar, faArrowUp,
  faNewspaper, faTag, faRss, faGlobe, faLink, faCopy, faUndo, faChevronUp, faTrash, faFilter,
  faSpinner
)

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.use(Buefy, {defaultIconComponent: 'font-awesome', defaultIconPack: 'fas'})

  Vue.component('Layout', DefaultLayout)

  Vue.component('font-awesome', FontAwesomeIcon)
}
