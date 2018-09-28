export default {
  currentTab () {
    const exec = (resolve, reject) => {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => resolve(tabs[0]))
    }
    return new Promise(exec)
  }
}
