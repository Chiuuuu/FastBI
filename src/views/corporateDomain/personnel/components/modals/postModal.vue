<template>
  <a-modal
    title="岗位管理"
    :bodyStyle="bodyStyle"
    :visible="show"
    :footer="null"
    destroyOnClose
    @ok="handleOk"
    @cancel="handleClose">
    <a-form-model ref="form" :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" labelAlign="left">
      <a-form-model-item label="部门" prop="depart">
        <a-select v-model="form.depart">
          <a-select-option :value="1">部门1</a-select-option>
          <a-select-option :value="2">部门2</a-select-option>
          <a-select-option :value="3">部门3</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <a-button class="add-button" type="primary" @click="addPost" :disabled="showNewPost">添加岗位</a-button>
    <div ref="scroll" class="form-list scrollbar">
      <div class="form-list-item" v-for="(post, index) in postList" :key="post.id">
        <template>
          <a-form-model ref="editForm" class="item-name" v-if="index === editIndex" :model="post" :rules="rules">
            <a-form-model-item prop="name">
              <a-input v-model="post.name" />
            </a-form-model-item>
          </a-form-model>
          <div class="item-name show-name" v-else>{{ post.name }}</div>
        </template>
        <a class="handler" v-if="index !== editIndex" @click="editPost(post, index)">编辑</a>
        <a class="handler" v-else @click="savePost(post, index)">保存</a>
        <a-popconfirm title="确定删除该岗位吗？" ok-text="确定" cancel-text="取消" @confirm="deletePost(post, index)">
          <a class="handler">删除</a>
        </a-popconfirm>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'personnelPostModal',
  props: {
    show: Boolean,
    modalData: Object
  },
  data() {
    return {
      bodyStyle: { 'height': 'calc(100vh - 240px)' },
      form: {
        depart: 1
      },
      showNewPost: false,
      editIndex: '',
      newPost: {
        name: ''
      },
      postList: [
        { id: '1', name: 'java' },
        { id: '2', name: '前端' },
        { id: '3', name: '测试' },
        { id: '4', name: '产品' }
      ],
      rules: {
        name: { required: true, message: '请填写岗位名称' }
      }
    }
  },
  methods: {
    addPost() {
      this.showNewPost = true
      this.postList.unshift({
        id: '',
        name: ''
      })
      this.editIndex = 0
      this.$refs.scroll.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    deletePost(post, index) {
      
    },
    editPost(post, index) {
      this.editIndex = index
    },
    savePost(post, index) {
      this.$refs.editForm[0].validate((ok, obj) => {
        if (ok) {
          // this.editIndex = ''
        }
      })
    },
    clearModal() {
      this.form = this.$options.data().form
    },
    clearNewPost() {
      this.showNewPost = false
      this.newPost.name = ''
    },
    handleClose() {
      this.$emit('close')
    },
    handleOk() {
      this.clearModal()
      this.clearNewPost()
      this.handleClose()
    }
  }
}
</script>

<style lang="less" scoped>
@import "./modal-common.less";
</style>
