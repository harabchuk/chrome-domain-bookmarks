/**
 * @see {@link https://developer.chrome.com/extensions/manifest}
 */
module.exports = {
  name: 'domain-bookmarks',
  description: 'Context bookmarks for websites',
  author: 'Aliaksei Harabchuk <aliaksei.harabchuk@gmail.com>',
  version: '0.2.1',
  icons: {
    '64': 'icons/64.png'
  },
  /**
   * @see {@link https://developer.chrome.com/extensions/declare_permissions}
   */
  permissions: [
    'activeTab',
    'unlimitedStorage',
    'storage',
    'bookmarks'
  ],
  browser_action: {
    default_title: 'App Bookmarks',
    default_popup: 'pages/popup.html'
  },
  manifest_version: 2,
  content_security_policy: "script-src 'self'; object-src 'self'",
}
