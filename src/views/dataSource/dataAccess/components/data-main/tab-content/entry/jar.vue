<template>
  <div class="tab-excel tab-datasource">
    <div class="tab-datasource-model scrollbar">
      <a-form-model
        ref="fileForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-model-item label="数据源名称" prop="name">
          <a-input placeholder="请输入数据源名称" v-model="form.name" @change="handleSetTableName" />
        </a-form-model-item>
        <a-form-model-item label="Jar文件" required>
          <a-spin :spinning="spinning">
            <div
              class="excel-list scrollbar"
              ref="files"
              @dragenter.stop="fileDragEnter"
            >
              <div
                class="mask"
                v-show="isDragenter"
                @dragleave.stop="fileDragLeave"
                @dragover.stop.prevent
                @drop.stop="fileDrop"
              ></div>
              <template v-if="currentFileList.length > 0">
                <div
                  class="excel-list-item"
                  :class="{ active: currentFileIndex === index }"
                  v-for="(item, index) in currentFileList"
                  :key="item"
                  :title="item"
                >
                  <div class="text">{{ item }}</div>
                  <div>
                    <a-icon style="margin-right: 10px" type="download" @click.stop="handleDownload(item)"></a-icon>
                    <a-icon type="delete" @click.stop="handleRemove(item)"></a-icon>
                  </div>
                </div>
              </template>
              <a-empty style="margin-top:35px" v-else>
                <span slot="description">点击添加或将文件拖拽至此上传</span>
              </a-empty>
            </div>
            <a-upload
              accept=".jar"
              name="file"
              :headers="{ 'content-type': 'multipart/form-data' }"
              :showUploadList="false"
              :before-upload="beforeFileUpload"
              @change="handleFileChange"
            >
              <a-button type="primary" :loading="loading">
                添加文件
              </a-button>
            </a-upload>
          </a-spin>
        </a-form-model-item>
      </a-form-model>
    </div>
    <a-button
      type="primary"
      class="btn_sub"
      @click="handleSaveForm"
      :loading="loading"
      v-if="hasPermission"
    >
      保存
    </a-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { hasPermission } from '@/utils/permission'
export default {
  name: 'model-jar',
  data() {
    return {
      btnPermission: [this.$PERMISSION_CODE.OPERATOR.edit, this.$PERMISSION_CODE.OPERATOR.add],
      loading: false,
      spinning: false,
      isDragenter: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入数据源名称'
          },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '长度为1~20'
          }
        ]
      },
      labelCol: {
        span: 4
      },
      fileList: [], // 文件列表
      fileInfoList: [], // 编辑时获取的文件信息
      deleteFileList: [], // 删除的文件列表
      currentFileIndex: 0 // 当前选中文件
    }
  },
  computed: {
    ...mapState({
      parentId: state => state.dataAccess.parentId,
      modelId: state => state.dataAccess.modelId,
      modelName: state => state.dataAccess.modelName,
      modelInfo: state => state.dataAccess.modelInfo,
      modelFileList: state => state.dataAccess.modelFileList,
      modelType: state => state.dataAccess.modelType,
      privileges: state => state.common.privileges,
      databaseName: state => state.dataAccess.databaseName
    }),
    currentFileList() {
      return this.fileInfoList.length > 0 ? this.fileInfoList : this.fileList
    },
    hasPermission() {
      return hasPermission(this.privileges, this.$PERMISSION_CODE.OPERATOR.edit)
    }
  },
  watch: {
    modelName(newValue, oldValue) {
      this.form.name = newValue
    }
  },
  mounted() {
    this.$EventBus.$on('setFormData', this.handleSetFormData)
    this.$EventBus.$on('resetForm', this.handleResetForm)
  },
  beforeDestroy() {
    this.$EventBus.$off('setFormData', this.handleSetFormData)
    this.$EventBus.$off('resetForm', this.handleResetForm)
  },
  methods: {
    // 重置表单
    handleResetForm() {
      this.form = { name: '' }
      this.fileList = []
      this.fileInfoList = []
    },
    /**
     * 设置表单名称
     */
    handleSetTableName() {
      this.$emit('on-set-table-name', this.form.name)
    },
    // 渲染表单
    handleSetFormData() {
      if (this.modelType !== 'jar') return
      this.handleResetForm()
      if (this.modelId) { // 有id就是编辑状态
        this.$set(this.form, 'name', this.modelName)
        this.getFileList()
      }
    },
    getFileList() {
      this.spinning = true
      this.$server.dataAccess.getJarPackageList(this.modelId)
        .then(res => {
          if (res.code === 200) {
            this.fileInfoList = res.rows
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    // 下载文件
    async handleDownload(name) {
      this.spinning = true
      const res = await this.$server.dataAccess.actionDownloadJarFile(name, this.modelId)
        .finally(() => {
          this.spinning = false
        })
      let a = document.createElement('a')
      a.href = `${process.env.VUE_APP_BASE_API}/jarDownload/${res.msg}`
      console.log(a.href)
      a.download = name
      a.click()
      a = null
    },
    // 删除文件
    handleRemove(file) {
      this.$confirm({
        title: '确认提示',
        content: '您确定要删除该文件吗',
        onOk: () => {
          let index = this.currentFileList.indexOf(file)
          this.fileInfoList.splice(index, 1)
          // 遍历新增的文件列表, 如果有就删除对象
          let isNewFile = false
          for (let i = 0; i < this.fileList.length; i++) {
            const item = this.fileList[i]
            if (item.name === file) {
              isNewFile = true
              this.fileList.splice(i, 1)
              break
            }
          }
          if (!isNewFile) {
            this.deleteFileList.push(file)
          }
        }
      })
    },
    // 处理拖动区域样式
    fileDragEnter(e) {
      const classList = this.$refs.files.classList
      if (!classList.contains('drag')) {
        this.isDragenter = true
        classList.add('drag')
      }
    },
    // 处理拖动区域样式
    fileDragLeave(e) {
      const classList = this.$refs.files.classList
      if (classList.contains('drag')) {
        this.isDragenter = false
        classList.remove('drag')
      }
    },
    fileDrop(e) {
      this.isDragenter = false
      this.$refs.files.classList.remove('drag')
      const fileList = [...e.dataTransfer.files]
      if (fileList.length > 1) {
        return this.$message.error('一次只能上传一个文件')
      }
      fileList.map(file => {
        this.fileValidate(file)
      })
      e.preventDefault()
    },
    // 手动上传文件
    beforeFileUpload() {
      return false
    },
    // 上传文件
    handleFileChange(e) {
      this.fileValidate(e.file)
    },
    // 校验文件
    fileValidate(file) {
      // 校验大小
      if (file.size > 100 * 1024 * 1024) return this.$message.error('文件大于100M, 无法上传')

      let name = file.name
      // // 校验重名
      // if (this.fileInfoList.some(file => file === name.slice(0, name.lastIndexOf('.')))) {
      //   return this.$message.error('文件命名重复, 请重新添加')
      // }
      // 校验重名
      if (this.fileInfoList.some(file => file === name)) {
        return this.$message.error('文件命名重复, 请重新添加')
      }

      // 校验jar文件类型
      const fileType = name.slice(name.lastIndexOf('.') + 1, name.length)
      if (/jar/.test(fileType)) {
        this.fileList.push(file)
        this.fileInfoList.push(name)
        // 新增文件未保存前不能查看库表结构
        this.$store.dispatch('dataAccess/setFirstFinished', false)
      } else {
        this.$message.error(name + '不是jar文件')
      }
    },
    handleUploadFile(id) {
      if (this.fileList.length < 1) return
      const formData = new FormData()
      this.fileList.map((file, index) => {
        formData.append('jarFiles[' + index + ']', file)
      })
      // this.deleteFileList.map((name, index) => {
      //   formData.append('databasesIdList[' + index + ']', name)
      // })
      formData.append('sourceId', this.modelId || id)

      this.$server.dataAccess.actionUploadJarFile(formData)
        .then(res => {
          if (res.code === 200) {
            // 保存后清空列表
            this.fileList = []
            this.deleteFileList = []
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleDeleteFile() {
      if (this.deleteFileList.length < 1) return
      this.$server.dataAccess.deleJarFiles({
        sourceId: this.modelId,
        fileList: this.deleteFileList
      })
        .then(res => {
          if (res.code !== 200) {
            this.$message.error(res.msg)
          }
        })
    },
    handleSaveForm() {
      if (this.fileInfoList.length === 0) {
        return this.$message.error('请上传文件')
      }
      this.$refs.fileForm.validate(async (pass, obj) => {
        if (pass) {
          this.loading = true
          const params = {
            id: this.modelId || 0,
            name: this.modelName,
            parentId: this.parentId || 0,
            type: 13
          }
          const result = await this.$server.dataAccess.saveTableInfo('datasource/save', params)
            .finally(() => {
              this.loading = false
            })

          if (result.code === 200) {
            await this.handleDeleteFile()
            await this.handleUploadFile(result.data.id)
            this.$message.success('保存成功')
            this.$store.dispatch('dataAccess/getMenuList')
            this.$store.dispatch('dataAccess/setModelId', result.data.id)
            this.$store.commit('common/SET_PRIVILEGES', result.data.privileges)
            this.$store.dispatch('dataAccess/setModelName', this.form.name)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import './read-file-table';
</style>
