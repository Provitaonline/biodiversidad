export function getPureText(text) {
  return text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function stripePattern(color, isFlipped) {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let img = new Image()
    img.src = '/images/stripes.svg'
    img.onload = () => {
      if (isFlipped) {
        ctx.translate(10, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(img, 0, 0)
      ctx.globalCompositeOperation = 'source-in'
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 10, 10)
      resolve(ctx.getImageData(0, 0, 10, 10))
    }
  })
}

// This is to address a bug in some browsers (e.g., Safari, ChromeiOS) which use cached page on 'back button' backend
// and do not restore form values consistently
export function reloadPageIfBrowserCached(route) {
  window.onpageshow = (e => {
    if (e.persisted  && window.location.search) {
      window.location.reload();
    }
  })
}

export function computeFormationTotals(byState) {
  let total = 0
  let formationTotals = {}
  byState.forEach((e, idx) => {
    //let stateTotal = e.plantFormations.reduce((pV, cV) => pV + (cV.areaKm2 ? cV.areaKm2 : 0), 0)
    let stateTotal = 0
    e.plantFormations.forEach(pf => {
      stateTotal += pf.areaKm2 ? pf.areaKm2 : 0
      if (formationTotals[pf.plantFormation]) {
        if (pf.areaKm2) formationTotals[pf.plantFormation] += pf.areaKm2
      } else {
        if (pf.areaKm2) formationTotals[pf.plantFormation] = pf.areaKm2
      }
    })
    byState[idx].stateTotal = stateTotal
    total += stateTotal
  })
  return({total: total, byState, formationTotals})
}

export function transform(object, kk, level) {

  if (level === undefined) level = 0
  if (kk === undefined || kk === '/Animalia') kk = ''
  let path = kk.split('/')

  let clazz = path[2] ? path[2] : ''

  return Object.entries(object).map(([key, value]) => {
    if (level === 2) clazz = key
    return Object.assign(
      {name: key, level: level, class: clazz},
        value && typeof value === 'object' && !value.hasDescription ?
          {children: transform(value, kk + '/' + key, level + 1) } :
            { value: 1, link: kk + '/' + value.jsonFile.split('.')[0], risk: value.risk })
  })
}
