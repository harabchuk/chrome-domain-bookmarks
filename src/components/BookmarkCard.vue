<template>
  <el-card v-if="bookmark" class="card" shadow="hover" :body-style="{padding: '0'}">
      <div :class="['card-content', {active: active}]" v-if="!editing">
        <a @click="onLinkClick(bookmark)" class="link" href="">{{ bookmark.title }}</a>
        <i @click="onDeleteClick(bookmark)" class="el-icon-delete" title="Delete bookmark"></i>
        <i @click="onEditClick(bookmark)" class="el-icon-edit" title="Edit bookmark title"></i>
      </div>
      <div class="card-content editing" v-if="editing">
        <el-input
          type="textarea"
          :rows="2"
          placeholder=""
          v-model="textareaTitle">
        </el-input>
        <i @click="onSaveClick()" class="el-icon-check" title="Save changes"></i>
        <i @click="onCancelClick()" class="el-icon-close" title="Cancel changes"></i>
      </div>
  </el-card>
</template>

<script>
  export default {
    name: 'BookmarkCard',
    data () {
      return {
        editing: false,
        textareaTitle: ''
      }
    },
    props: {
      bookmark: Object,
      active: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    methods: {
      onLinkClick (bookmark) {
        this.$emit('linkClick', bookmark)
      },
      onDeleteClick (bookmark) {
        this.$emit('delete', bookmark)
      },
      onEditClick (bookmark) {
        this.textareaTitle = this.bookmark.title
        this.editing = true
      },
      onSaveClick () {
        this.editing = false
        if (!this.textareaTitle || this.textareaTitle === this.bookmark.title) {
          return
        }
        this.bookmark.title = this.textareaTitle
        this.$emit('updated', this.bookmark)
      },
      onCancelClick () {
        this.editing = false
      }
    }
  }
</script>

<style scoped>
    .card {
        margin-bottom: 5px;
    }
    .card-content {
        display: flex;
        justify-content: space-around;
        align-items: stretch;
        padding-right: 15px;
    }
    .link {
        display: block;
        width: 100%;
        padding: 15px 5px 15px 15px;
    }
    .link,
    .link:visited {
        color: dodgerblue;
        text-decoration: none;
    }
    .link:hover {
        text-decoration: underline;
    }
    .card i{
        margin-top: 15px;
        margin-right: 3px;
        cursor: pointer;
        width: 15px;
        display: block;
        flex-grow: 0;
    }
    .card i:hover {
        color: darkred;
    }
    .active .link{
        font-weight: bold;
    }
    .el-icon-check {
        color: green;
    }
    .el-icon-close {
        color: darkred;
    }
    .editing textarea {
        font-size: 9px !important;
    }
</style>