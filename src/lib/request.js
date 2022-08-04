import fetch from 'node-fetch'

const request = (url, options) => fetch(url, options).then(res => res.json())

export default request