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
