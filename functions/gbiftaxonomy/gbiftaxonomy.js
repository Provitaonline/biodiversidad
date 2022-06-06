const fetch = require('node-fetch')
exports.handler = async function(event, context) {
  try {
    //console.log(event.queryStringParameters.toString())
    let qry = event.queryStringParameters

    const response = await fetch('https://www.gbif.org/api/occurrence/breakdown' + '?' +  Object.keys(qry).map(key => `${key}=${qry[key]}`).join('&'), {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    return {
      statusCode: 200,
      headers: {'Cache-Control': 'public, s-maxage=86400'},
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}
