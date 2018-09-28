import URL from 'url-parse'

export default {
  getDomain (url, domainLevel = 2) {
    const urlObj = new URL(url)
    const parts = urlObj.hostname.split('.')
    const sliced = parts.slice(-domainLevel)
    return sliced.join('.')
  }
}
