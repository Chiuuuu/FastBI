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
          :class="handleIsFolder(folder, 'items') ? 'is-folder' : ''"
          v-for="(folder, index) in tableList"
          :key="folder.id"
        >
          <template v-if="handleIsFolder(folder, 'items')">
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
    <a-empty v-if="modelFolderList.length === 0 && modelFileList.length === 0" class="table_list-_empty">
      <span slot="description">暂无数据源</span>
    </a-empty>
    <template v-else>
      <div class="menu_search">
        <a-input placeholder="搜索数据模型名称">
          <a-icon class="icon_search" slot="suffix" type="search" />
        </a-input>
      </div>
      <p class="menu_tips">右键文件夹或选项有添加，重命名等操作</p>
      <div class="menu-wrap">
        <div
          class="group is-folder"
          :class="handleIsFolder(folder, 'items') ? 'is-folder' : ''"
          v-for="(folder, index) in modelFolderList"
          :key="folder.id"
        >
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
                :contextmenus="folderFileContenxtMenu"
                @fileSelect="handleFileSelect"
              ></menu-file>
            </template>
          </menu-folder>
        </div>
        <div
          class="group"
          v-for="(file, index) in modelFileList"
          :key="file.id"
        >
          <ul class="items">
            <menu-file
              :file="file"
              :index="index"
              :isSelect='fileSelectId === file.id'
              :contextmenus="fileContenxtMenu"
              @fileSelect="handleFileSelect"
            ></menu-file>
          </ul>
        </div>
      </div>
    </template>
    <reset-name-modal
      ref="resetNameForm"
      :visible="resetName.visible"
      @cancel="handleResetNameCancel"
      @create="handleResetNameCreate"
    ></reset-name-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ResetNameModal from '@/views/dataSource/dataAccess/components/data-main/data-menu/resetName'
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'
import {
  fetchMenuList,
  fetchChangeFolderName,
  fetchFolderDeleteById,
  fetchAddNewFolder,
  fetchDeleteFile
} from '@/api/dataModel/api'
export default {
  name: 'model-menu',
  components: {
    ResetNameModal,
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
      modelFolderList: [],
      modelFileList: [],
      modalFileSelectId: '',
      // modelList: [
      //   {
      //     id: '1',
      //     name: '文件夹',
      //     items: [
      //       {
      //         id: '2',
      //         name: '数据源'
      //       }
      //     ]
      //   },
      //   {
      //     id: '3',
      //     name: '默认的'
      //   }
      // ],
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
      folderFileContenxtMenu: [
        {
          name: '删除',
          onClick: (mouseEvent, event, options) => this.handleFileDelete(mouseEvent, event, options, 'folderFile')
        }
      ],
      fileContenxtMenu: [
        // {
        //   name: '移动到',
        //   onClick: this.handleFileMoveFolder
        // },
        {
          name: '删除',
          onClick: (mouseEvent, event, options) => this.handleFileDelete(mouseEvent, event, options, 'file')
        }
      ]
    }
  },
  computed: {
    ...mapState({
      tableList: state => state.dataAccess.menuList
    }),
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
    * 获取左侧菜单数据
    */
    handleGetModalMenuList() {
     this.$store.dispatch('dataAccess/getMenuList', this)
    },
    async handleGetMenuList() {
      const result = await fetchMenuList({
        url: '/admin/dev-api/datamodel/catalog/list'
      })

      if (result.data.code === 200) {
        this.modelFolderList = [].concat(result.data.data.folders)
        this.modelFileList = [].concat(result.data.data.items)
      } else {
        this.$message.error(result.data.msg)
      }
    },
    handleFolderNewModel() {
      this.$nextTick(() => {
        this.visible = true
      })
    },
    /**
     * 打开弹窗
    */
    showModal() {
      this.visible = true
      this.handleGetModalMenuList()
    },
    /**
     * 是否为文件夹
     */
    handleIsFolder(item) {
      return item.hasOwnProperty('items')
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
      const result = await fetchChangeFolderName({
        url: '/admin/dev-api/datamodel/catalog/updateCatalogName',
        data: {
          catalogId: this.resetName.item.id,
          catalogName: form.name
        }
      })

      if (result.data.code === 200) {
        this.resetName.item.name = form.name
        this.$message.success('删除成功')
      } else {
        this.$message.error(result.data.msg)
      }
    },
    /**
     * 文件夹删除
    */
    async handleFolderDelete(mouseEvent, event, { folder }) {
      console.log('文件夹删除', folder)
      const result = await fetchFolderDeleteById({
        url: '/admin/dev-api/datamodel/catalog/removeCatalogById',
        data: {
          catalogId: folder.id,
          modelIds: []
        }
      })

      if (result.data.code === 200) {
        const index = this.modelFolderList.indexOf(folder)
        this.modelFolderList.splice(index, 1)
        this.$message.success('删除成功')
      } else {
        this.$message.error(result.data.msg)
      }
    },
    /**
     * 文件移动到文件夹
    */
    handleFileMoveFolder() {
      console.log('文件移动到文件夹')
    },
    /**
     * 文件删除
    */
    async handleFileDelete(mouseEvent, event, { parent, file, index }, type) {
      console.log('文件删除', type)
      const result = await fetchDeleteFile({
        url: '/admin/dev-api/datamodel/datamodelInfo/deleteModelDataModelByModelId/' + file.id
      })

      if (result.data.code === 200) {
        this.$message.success('删除成功')
        if (type === 'folderFile') {
          parent.items.splice(index, 1)
        } else {
          this.modelFileList.splice(index, 1)
        }
        const isSame = file.id === this.fileSelectId
        if (isSame) this.$store.dispatch('dataModel/setModelId', -1)
      } else {
        this.$message.error(result.data.msg)
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
      }
    },
    handleOk() {
      // if (!this.modalFileSelectId) return
      this.visible = false
      this.$router.push({
        name: 'modelEdit',
        query: {
          type: 'add',
          dataConnectionId: this.modalFileSelectId
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
      const result = await fetchAddNewFolder({
        url: '/admin/dev-api/datamodel/catalog/addCatalog',
        data: {
          catalogName: form.name
        }
      })

      if (result.data.code === 200) {
        this.$message.success('添加成功')
        this.handleGetMenuList()
      } else {
        this.$message.error(result.data.msg)
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
