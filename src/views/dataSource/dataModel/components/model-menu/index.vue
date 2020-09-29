<template>
  <div class="model-menu">
    <div class="menu_title">
      <span class="m-t-s">数据模型</span>
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link">
          <a-icon type="plus-square" class="menu_icon" />
        </a>
        <a-menu slot="overlay" class="drow_menu">
          <a-menu-item v-on:click="showModal">
            新建模型
          </a-menu-item>
          <a-menu-item @click="handleAddNewFolder">
            新建文件夹
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-modal v-model="visible" title="选择数据连接" :bodyStyle="{
      height: `300px`,
      overflowY: 'auto'
    }" @ok="handleOk">
      <a-input ref="userNameInput" v-model="search" placeholder="搜索数据连接" @pressEnter='handleSearch'>
        <a-icon slot="prefix" type="search" />
      </a-input>
      <router-link to="/dataSource/dataAccess" class="modal-item hover">新建数据连接</router-link>
      <div class="menu-wrap modal-wrap">
        <div
          class="group"
          :class="handleIsFolder(folder) ? 'is-folder' : ''"
          v-for="(folder, index) in sourceList"
          :key="folder.id"
        >
          <template v-if="handleIsFolder(folder)">
            <menu-folder
              :folder="folder"
              :index="index"
            >
              <template v-slot:file="slotProps">
                <menu-file
                  :file="slotProps.file"
                  :index="slotProps.index"
                  :isSelect='modalFileSelectId === slotProps.file.id'
                  :parent="folder"
                  @fileSelect="(file) => handleFileSelect(file, 'modal')"
                ></menu-file>
              </template>
            </menu-folder>
          </template>
          <template v-else>
            <ul class="items">
              <menu-file
                :file="folder"
                :index="index"
                :isSelect='modalFileSelectId === folder.id'
                @fileSelect="(file) => handleFileSelect(file, 'modal')"
              ></menu-file>
            </ul>
          </template>
        </div>
      </div>
    </a-modal>
    <a-empty v-if="modelList && modelList.length && modelList.length === 0" class="table_list-_empty">
      <span slot="description">暂无数据模型</span>
    </a-empty>
    <template v-else>
      <!-- <div class="menu_search">
        <a-input placeholder="搜索数据模型名称">
          <a-icon class="icon_search" slot="suffix" type="search" />
        </a-input>
      </div> -->
      <!-- <p class="menu_tips">右键文件夹或选项有添加，重命名等操作</p> -->
      <div class="menu-wrap">
        <div
          class="group is-folder"
          :class="handleIsFolder(folder) ? 'is-folder' : ''"
          v-for="(folder, index) in modelList"
          :key="folder.id"
        >
          <template v-if="handleIsFolder(folder)">
            <menu-folder
              :folder="folder"
              :index="index"
              :contextmenus="folderContenxtMenu"
            >
              <template v-slot:file="slotProps">
                <menu-file
                  :file="slotProps.file"
                  :index="slotProps.index"
                  :parent="folder"
                  :isSelect='fileSelectId === slotProps.file.id'
                  :contextmenus="fileContenxtMenu"
                  @fileSelect="handleFileSelect"
                ></menu-file>
              </template>
            </menu-folder>
          </template>
          <template v-else>
            <ul class="items">
              <menu-file
                :file="folder"
                :index="index"
                :isSelect='fileSelectId === folder.id'
                :contextmenus="fileContenxtMenu"
                @fileSelect="handleFileSelect"
              ></menu-file>
            </ul>
          </template>
        </div>
      </div>
    </template>
    <reset-name-modal
      ref="resetNameForm"
      :visible="resetName.visible"
      @cancel="handleResetNameCancel"
      @create="handleResetNameCreate"
    ></reset-name-modal>
    <move-file-modal
      :visible="moveFileVisible"
      :selected="selectFile"
      :menuList="folderList"
      @cancel="moveFileVisible = false"
      @create="handleFileMoveCreate"
    ></move-file-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ResetNameModal from '@/views/dataSource/dataAccess/components/data-main/data-menu/resetName'
import MoveFileModal from '@/views/dataSource/dataAccess/components/data-main/data-menu/moveFile'
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'
export default {
  name: 'model-menu',
  components: {
    ResetNameModal,
    MoveFileModal,
    MenuFolder,
    MenuFile
  },
  data() {
    return {
      visible: false,
      resetName: {
        visible: false,
        type: 'new',
        item: ''
      },
      search: '',
      sourceList: [],
      modelFolderList: [],
      modelFileList: [],
      modalFileSelectId: '',
      selectFile: null, // 选中文件
      moveFileVisible: false, // 移动文件夹弹窗
      folderContenxtMenu: [
        {
          name: '新建模型',
          onClick: this.handleFolderNewModel
        },
        {
          name: '重命名',
          onClick: this.handleFolderResetName
        },
        {
          name: '删除',
          onClick: this.handleFolderDelete
        }
      ],
      fileContenxtMenu: [
        {
          name: '移动到',
          onClick: this.handleFilemove
        },
        {
          name: '删除',
          onClick: this.handleFileDelete
        }
      ]
    }
  },
  computed: {
    ...mapState({
      modelList: state => state.dataModel.menuList
    }),
    folderList() {
      return this.modelList.filter(item => item.fileType === 0)
    },
    fileSelectId: {
      get () {
        return this.$store.state.dataModel.modelId
      },
      set (value) {
        this.$store.commit('dataModel/SET_MODELID', value)
      }
    }
  },
  created() {
    this.handleGetMenuList()
  },
  mounted() {
    this.$on('fileSelect', this.handleFileSelect)
  },
  methods: {
    /**
    * 获取数据源数据
    */
    async handleGetDataSourceList() {
      const result = await this.$server.common.getMenuList('/datasource/catalog/list/1')

      if (result.code === 200) {
        this.sourceList = result.rows
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 获取模型列表
     */
    async handleGetMenuList() {
      this.$store.dispatch('dataModel/getMenuList', this)
    },
    handleFolderNewModel(mouseEvent, event, { folder }) {
      this.$store.dispatch('dataModel/setParentId', folder.id)
      this.showModal()
    },
    /**
     * 打开弹窗
    */
    showModal() {
      this.visible = true
      this.handleGetDataSourceList()
    },
    /**
     * 是否为文件夹
     */
    handleIsFolder(item) {
      return item.fileType === 0
    },
    /**
     * 文件夹重命名
    */
    handleFolderResetName(mouseEvent, event, { folder }) {
      console.log('文件夹重命名', folder)
      this.resetName.type = 'reset'
      this.resetName.item = folder
      this.resetName.visible = true
    },
    async _resetName(form) {
      const result = await this.$server.common.putMenuFolderName('/model/catalog', {
        fileType: this.resetName.item.fileType,
        id: this.resetName.item.id,
        name: form.name,
        parentId: 0,
        type: 2
      })

      if (result.code === 200) {
        this.resetName.item.name = form.name
        this.$message.success('修改成功')
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 文件夹删除
    */
    async handleFolderDelete(mouseEvent, event, { folder }) {
      const result = await this.$server.common.deleMenuById('/model/catalog/' + folder.id)

      if (result.code === 200) {
        this.handleGetMenuList()
        this.$store.dispatch('dataModel/setModelId', 0)
        this.$message.success('删除成功')
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 移动文件夹
     */
    handleFilemove(event, index, { file }) {
      this.selectFile = file
      this.$store.dispatch('dataModel/setDatasource', file)
      this.$store.dispatch('dataModel/setModelId', file.id)
      this.moveFileVisible = true
    },
    /**
     * 选择移动文件夹弹窗确认
     */
    async handleFileMoveCreate(parentId) {
      const result = await this.$server.common.putMenuFolderName('/model/catalog', {
        fileType: this.selectFile.fileType,
        id: this.selectFile.id,
        name: this.selectFile.name,
        parentId: parentId,
        type: 2
      })
      if (result.code === 200) {
        this.handleGetMenuList()
        this.$message.success('移动成功')
      } else {
        this.$message.error(result.msg)
      }

      this.moveFileVisible = false
    },
    /**
     * 文件删除
    */
    async handleFileDelete(mouseEvent, event, { file }) {
      const result = await this.$server.common.deleMenuById(`/model/catalog/${file.id}`)

      if (result.code === 200) {
        this.$message.success('删除成功')
        this.handleGetMenuList()
        const isSame = file.id === this.fileSelectId
        if (isSame) this.$store.dispatch('dataModel/setModelId', 0)
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 点击左侧菜单获取模型信息
    */
    handleFileSelect(file, type) {
      if (type !== 'modal') {
        if (this.fileSelectId === file.id) return
        this.visible = false
        this.fileSelectId = file.id
        this.$emit('getModelInfo', this.fileSelectId)
        console.log('点击左侧菜单获取模型信息')
      } else {
        if (this.modalFileSelectId === file.id) return
        this.modalFileSelectId = file.id
        this.$store.dispatch('dataModel/setDatasource', file)
        this.$store.dispatch('dataModel/setDatasourceId', file.id)
      }
    },
    /**
     * 确定选择的数据连接
     */
    handleOk() {
      if (!this.modalFileSelectId) {
        return this.$message.error('请选择数据源')
      }
      this.visible = false
      this.$router.push({
        name: 'modelEdit',
        query: {
          type: 'add',
          datasourceId: this.modalFileSelectId
        }
      })
    },
    /**
     * 搜索
    */
    handleSearch() {
      console.log('搜索结果', this.search)
    },
    /**
     * 新增文件夹
    */
    handleAddNewFolder() {
      this.resetName.visible = true
      this.resetName.type = 'new'
    },
    async _addNewFolder(form) {
      const result = await this.$server.common.addMenuFolder('/model/catalog', {
        name: form.name,
        type: 2,
        parentId: 0,
        fileType: 0
      })

      if (result.code === 200) {
        this.$message.success('添加成功')
        this.handleGetMenuList()
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 重命名取消
    */
    handleResetNameCancel() {
      this.resetName.visible = false
    },
    /**
     * 重命名确定
    */
    handleResetNameCreate() {
      const form = this.$refs.resetNameForm.form
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        if (this.resetName.type === 'reset') {
          this._resetName(values)
        } else if (this.resetName.type === 'new') {
          this._addNewFolder(values)
        }
        form.resetFields()
        this.resetName.visible = false
      })
    }
  }
}
</script>

<style lang="styl" scoped>
@import "./menu.styl";
</style>
