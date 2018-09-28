<template>
    <div class="popup">
        <div class="header">
            <div>
                <el-tooltip class="item" effect="light" content="Bookmark current page" placement="bottom">
                    <el-button type="warning" icon="el-icon-star-off" size="small" circle
                               @click="newBookmark" ></el-button>
                </el-tooltip>
            </div>
            <div>
                <el-checkbox v-model="showAllSubdomains" @change="changedDomainsOptions">Show all subdomains</el-checkbox>
                <div class="checkBoxSubtitle">{{ subdomainsCurrentOption }}</div>
            </div>
        </div>
        <div class="items">
            <BookmarkCard v-for="bookmark in items"
                          :bookmark="bookmark" :key="bookmark.url"
                          :active="bookmark.url==currentUrl"
                          @linkClick="clickLink"
                          @delete="deleteBookmark"
                          @updated="updatedBookmark"
            >
            </BookmarkCard>
        </div>
    </div>
</template>

<script>
  import URL from 'url-parse'
  import domain from '../utils/domain'
  import storage from '../api/storage'
  import bookmarks from '../api/bookmarks'
  import tabs from '../api/tabs'
  import BookmarkCard from '../components/BookmarkCard'

  export default {
    data: () => ({
      items: [],
      currentUrl: null,
      showAllSubdomains: true,
      currentTopDomain: null,
      currentSubdomain: null
    }),
    components: {
      BookmarkCard
    },
    computed: {
      subdomainsCurrentOption () {
        return this.showAllSubdomains ? '*.' + this.currentTopDomain : this.currentSubdomain
      }
    },
    created () {
      tabs.currentTab().then(activeTab => {
        const urlObject = new URL(activeTab.url)
        this.currentUrl = urlObject
        this.currentTopDomain = domain.getDomain(activeTab.url, 2)
        this.currentSubdomain = domain.getDomain(activeTab.url, 3)
        this.showAllSubdomains = storage.get('show_subdomains_' + this.currentTopDomain)
        const searchTerm = this.showAllSubdomains ? this.currentTopDomain : this.currentSubdomain
        bookmarks.findBookmarks(searchTerm).then(items => {
          this.items = items
        })
      })
    },
    methods: {
      clickLink (bookmark) {
        const { url } = bookmark
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
          const activeTab = tabs[0]
          chrome.tabs.update(activeTab.id, {url})
          window.close()
        })
      },
      deleteBookmark (bookmark) {
        this.items = this.items.filter(b => b.id !== bookmark.id)
        bookmarks.deleteBookmark(bookmark.id)
      },
      updatedBookmark (bookmark) {
        bookmarks.updateBookmark(bookmark.id, bookmark.title)
      },
      changedDomainsOptions (showAllSubdomains) {
        storage.set('show_subdomains_' + this.currentTopDomain, showAllSubdomains)
        const searchTerm = showAllSubdomains ? this.currentTopDomain : this.currentSubdomain
        bookmarks.findBookmarks(searchTerm).then(items => {
          this.items = items
        })
      },
      newBookmark () {
        tabs.currentTab().then(activeTab => {
          bookmarks.getOtherBookmarksFolder()
            .then(folder => {
              return bookmarks.getOrCreateFolder(folder.id, 'Domain Bookmarks')
            })
            .then(folder => {
              return bookmarks.getOrCreateBookmark(folder.id, activeTab.url, activeTab.title)
            })
            .then(([b, created]) => {
              if (created) {
                this.items.push(b)
              }
            })
        })
      }
    }
  }
</script>

<style lang="scss">
.popup {
  width: 350px;
  min-height: 80px;
  max-height: 500px;
  overflow-y: auto;
}
.header {
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
    align-items: center;
}
.checkBoxSubtitle {
  font-size: 80%;
  margin-left: 24px;
}
</style>
