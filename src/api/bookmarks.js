export default {
  getOtherBookmarksFolder () {
    const exec = (resolve, reject) => {
      chrome.bookmarks.getChildren('0', folders => {
        if (folders && folders.length > 1) {
          resolve(folders[1])
        } else {
          reject(new Error(`Found only ${folders.length} folders but at least two required.`))
        }
      })
    }
    return new Promise(exec)
  },
  findFolder (parentId, title) {
    const executor = (resolve, reject) => {
      chrome.bookmarks.getChildren(parentId, items => {
        if (items) {
          const existing = items.find(node => node.title === title)
          if (existing) {
            resolve(existing)
          } else {
            resolve(null)
          }
        } else {
          resolve(null)
        }
      })
    }
    return new Promise(executor)
  },
  createFolder (parentId, title) {
    const exec = (resolve, reject) => {
      chrome.bookmarks.create({parentId, title}, newFolder => { resolve(newFolder) })
    }
    return new Promise(exec)
  },
  getOrCreateFolder (parentId, title) {
    const exec = (resolve, reject) => {
      this.findFolder(parentId, title).then(folder => {
        if (folder) {
          resolve(folder)
        } else {
          this.createFolder(parentId, title).then(resolve)
        }
      })
    }
    return new Promise(exec)
  },
  createBookmark (parentId, url, title) {
    const exec = (resolve, reject) => {
      chrome.bookmarks.create({parentId, title, url}, resolve)
    }
    return new Promise(exec)
  },
  findBookmark (parentId, url) {
    const exec = (resolve, reject) => {
      chrome.bookmarks.getChildren(parentId, items => {
        if (items) {
          const bookmark = items.find(node => node.url === url)
          if (bookmark) {
            resolve(bookmark)
          } else {
            resolve(null)
          }
        } else {
          resolve(null)
        }
      })
    }
    return new Promise(exec)
  },
  getOrCreateBookmark (parentId, url, title) {
    const exec = (resolve, reject) => {
      this.findBookmark(parentId, url).then(bookmark => {
        if (bookmark) {
          resolve([bookmark, false])
        } else {
          this.createBookmark(parentId, url, title).then(b => resolve([b, true]))
        }
      })
    }
    return new Promise(exec)
  },
  findBookmarks (needle) {
    const exec = (resolve, reject) => {
      chrome.bookmarks.search(needle, results => { resolve(results) })
    }
    return new Promise(exec)
  },
  deleteBookmark (id) {
    const exec = (resolve, reject) => {
      chrome.bookmarks.remove(id, resolve)
    }
    return new Promise(exec)
  },
  updateBookmark (id, title) {
    const exec = (resolve, reject) => {
      chrome.bookmarks.update(id, { title }, resolve)
    }
    return new Promise(exec)
  }
}
