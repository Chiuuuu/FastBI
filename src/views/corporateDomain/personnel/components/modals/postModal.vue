<template>
  <a-modal title="岗位管理" :bodyStyle="bodyStyle" :visible="show" @ok="handleOk" @cancel="handleClose">
    <a-form-model ref="form" :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
      <a-form-model-item label="部门" prop="depart">
        <a-select v-model="form.depart">
          <a-select-option :value="1">部门1</a-select-option>
          <a-select-option :value="2">部门2</a-select-option>
          <a-select-option :value="3">部门3</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <a-button class="add-button" type="primary" @click="addPost" :disabled="showNewPost">添加岗位</a-button>
    <a-form-model v-for="(post, index) in postList" :key="post.id" :model="post" :rules="rules">
      <a-form-model-item prop="name">
        <a-input v-model="post.name">
          <a-popconfirm slot="suffix" title="确定删除该岗位吗？" ok-text="确定" cancel-text="取消" @confirm="deletePost(post, index)">
            <a-icon type="delete" style="cursor: pointer;"></a-icon>
          </a-popconfirm>
        </a-input>
      </a-form-model-item>
    </a-form-model>
    <a-form-model v-if="showNewPost" :model="newPost" :rules="rules">
      <a-form-model-item prop="name">
        <a-input v-model="newPost.name">
          <a-icon type="delete" slot="suffix" style="cursor: pointer;"></a-icon>
        </a-input>
      </a-form-model-item>
    </a-form-model>
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
      bodyStyle: { 'maxHeight': 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      form: {
        depart: 1
      },
      showNewPost: false,
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
    },
    deletePost(post, index) {
      
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

<style scoped>
.add-button {
  display: block;
  margin-bottom: 20px;
}
</style>
