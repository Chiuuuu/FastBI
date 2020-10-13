<template>
  <div class="menu" id="menuRef">
    <div class="menu_title">
      <span class="m-t-s">数据接入</span>
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link">
          <a-icon type="plus-square" class="menu_icon" />
        </a>
        <a-menu slot="overlay" class="drow_menu">
          <a-menu-item v-on:click="showModal">
            添加连接
          </a-menu-item>
          <a-menu-item key="1" @click="handleAddNewFolder">
            新建文件夹
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-modal
        v-model="visible"
        title="添加连接"
        :footer="null"
        :bodyStyle="{
          maxHeight: `calc( 100vh - 160px )`,
          overflowY: 'auto'
        }"
      >
        <a-row :gutter="[8, 8]">
          <a-col v-for="item in modelList" :key="item.id" :span="24 / 3">
            <a-card
              hoverable
              :bodyStyle="{ padding: '10px 0', fontSize: '12px' }"
              @click="handleSelectModelType($event, item)"
            >
              <img
                slot="cover"
                :alt="item.name"
                class="card-img"
                :src="item.imgurl"
              />
              <div class="card-title">{{ item.name }}</div>
            </a-card>
          </a-col>
        </a-row>
      </a-modal>
    </div>
    <div class="menu_search">
      <a-input placeholder="搜索数据接入名称" @input="handleSearchMenu">
        <a-icon class="icon_search" slot="suffix" type="search" />
      </a-input>
    </div>
    <a-empty v-if="menuList.length === 0" class="table_list-_empty">
      <span slot="description">暂无数据库连接</span>
    </a-empty>
    <template v-else>
      <!-- <p class="menu_tips">右键文件夹或选项有添加，重命名等操作</p> -->
      <div class="menu-wrap" @dragover.stop="handleDragOver" @drop="handleWrapDrop">
        <div
          class="group"
          :class="handleIsFolder(folder, 'items') ? 'is-folder' : ''"
          v-for="(folder, index) in menuList"
          :key="folder.id"
        >
          <template v-if="handleIsFolder(folder, 'items')">
            <menu-folder
              :folder="folder"
              :index="index"
              :contextmenus="folderContenxtMenu"
              @fileDrop="handleFileDrop"
            >
              <template v-slot:file="slotProps">
                <menu-file
                  :file="slotProps.file"
                  :index="slotProps.index"
                  :parent="folder"
                  :isSelect='fileSelectId === slotProps.file.id'
                  :contextmenus="fileContenxtMenu"
                  @fileSelect="handleFileSelect"
                  @fileDrag="handleFileDrag"
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
                @fileDrag="handleFileDrag"
              ></menu-file>
            </ul>
          </template>
        </div>
      </div>
    </template>
    <reset-name-modal
      ref="resetNameForm"
      :visible="resetNameVisible"
      :reset-name="resetName"
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
import ResetNameModal from '../data-main/data-menu/resetName'
import MoveFileModal from '../data-main/data-menu/moveFile'
import { mapState } from 'vuex'
import { menuSearchLoop } from '../../../dataModel/util'
import { fetchTableInfo, fetchDeleteMenuById } from '../../../../../api/dataAccess/api'
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'
import debounce from 'lodash/debounce'
export default {
  name: 'dataMenu',
  props: {
    menuData: {
      type: String,
      default: ''
    }
  },
  components: {
    ResetNameModal,
    MoveFileModal,
    MenuFile,
    MenuFolder
  },
  data() {
    return {
      // modelList: ['mysql', 'oracle', 'excel', 'csv'].map(function(item) {
      modelList: ['mysql', 'oracle'].map(function(item) {
        // 弹窗选项列表
        return {
          imgurl: require(`@/assets/images/icon_${item}.png`),
          name: item,
          type: item
        }
      }),
      searchValue: '', // 关键词搜索
      searchList: [], // 搜索结果
      // fileSelectId: '', // 选中左侧菜单
      resetNameVisible: false, // 重命名弹窗显示
      resetName: {
        item: '',
        type: '',
        parentId: ''
      }, // 选中文件夹
      selectFile: null, // 选中文件
      dragFile: null, // 选中文件
      moveFileVisible: false, // 移动文件夹弹窗
      menuNode: {
        // 存储节点
        targetNode: {}, // 目标节点
        parentNode: {} // 父级节点
      },
      folderContenxtMenu: [
        {
          name: '添加连接',
          onClick: this.showModal
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
          onClick: this.handleFilemoveFile
        },
        {
          name: '重命名',
          onClick: this.handleFileResetName
        },
        {
          name: '删除',
          onClick: this.handleFileDelete
        }
      ],
      icon: false,
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  computed: {
    ...mapState({
      tableList: state => state.dataAccess.menuList
    }),
    menuList() {
      return this.searchValue ? this.searchList : this.tableList
    },
    folderList() {
      return this.tableList.filter(item => item.fileType === 0)
    },
    fileSelectId: {
      get () {
        return this.$store.state.dataAccess.modelId
      },
      set (value) {
        this.$store.commit('dataAccess/SET_MODELID', value)
      }
    }
  },
  mounted() {
    this.handleGetMenuList()
    this.$on('fileSelect', this.handleFileSelect)
  },
  methods: {
    /**
    * 获取左侧菜单数据
    */
    handleGetMenuList() {
      this.$store.dispatch('dataAccess/getMenuList', this)
    },
    /**
     * @description 获取表详情信息
    */
    async getTableInfo(url, callback) {
      const result = await this.$server.common.getDetailByMenuId(url)
      if (result.code === 200) {
        if (callback && (callback instanceof Function)) {
          callback(result)
        }
        this.$EventBus.$emit('setFormData')
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 搜索目录列表
     */
    handleSearchMenu: debounce(function(event) {
      const value = event.target.value
      this.searchValue = value
      this.handleGetSearchList(value)
    }, 400),
    handleGetSearchList(value) {
      let result = []
      this.tableList.map(item => {
        const newItem = menuSearchLoop(item, value)
        if (newItem) result.push(newItem)
      })
      this.searchList = result
      console.log('搜索结果', this.searchList)
    },
    /**
    * 选择左侧菜单
    */
    handleFileSelect(file) {
      if (this.fileSelectId === file.id) return
      this.fileSelectId = file.id
      if (file.fileType === 1) {
        this.$store.dispatch('dataAccess/setModelType', 'mysql')
        this.getTableInfo(`/datasource/${file.id}`, result => {
          this.$store.dispatch('dataAccess/setModelInfo', {
            ...result.data.properties,
            id: this.fileSelectId,
            name: result.data.name,
            port: Number(result.data.properties.port)
          })
        })
      } else if (file.fileType === 2) {
        this.$store.dispatch('dataAccess/setModelType', 'oracle')
        this.getTableInfo(`/datasource/${file.id}`, result => {
          this.$store.dispatch('dataAccess/setModelInfo', {
            ...result.data.properties,
            id: this.fileSelectId,
            name: result.data.name,
            port: Number(result.data.properties.port)
          })
        })
      }
      this.$store.dispatch('dataAccess/setFirstFinished', false)
      this.$store.dispatch('dataAccess/setModelId', file.id)
      this.$EventBus.$emit('set-tab-index', '1')
      this.$emit('on-menuChange-componet', 'Main')
      this.$store.dispatch('dataAccess/setModelSelectType', '')
    },
    /**
    * 删除菜单
    */
    handleFileDelete(event, item, { file }) {
      this.$confirm({
        title: '确认提示',
        content: '确定删除该数据接入?',
        onOk: async () => {
          const result = await this.$server.common.deleMenuById(`/datasource/catalog/${file.id}`)
          if (result.code === 200) {
            this.handleGetMenuList()
            const isSame = file.id === this.fileSelectId
            if (isSame) this.$store.dispatch('dataAccess/setModelType', '')
          } else {
            this.$message.error(result.msg)
          }
        }
      })
    },
    /**
     * 文件夹删除
     */
    handleFolderDelete(event, index, { folder }) {
      this.$confirm({
        title: '确认提示',
        content: '确定删除该文件夹?',
        onOk: async () => {
          const result = await this.$server.common.deleMenuById(`/datasource/catalog/${folder.id}`)
          if (result.code === 200) {
            this.handleGetMenuList()
            this.$message.success('删除成功')
            const isSame = folder.id === this.fileSelectId
            if (isSame) this.$store.dispatch('dataAccess/setModelType', '')
          } else {
            this.$message.error(result.msg)
          }
        }
      })
    },
    /**
     * 打开数据类型弹窗
     */
    showModal(e, calle, vm) {
      this.visible = true
      this.$store.dispatch('dataAccess/setModelSelectType', 'new')
      this.$store.dispatch('dataAccess/setParentId', vm ? vm.folder.id : 0)
    },
    /**
    * 修改文件夹名称
    */
    handleFolderResetName(event, item, { folder }) {
      this.resetNameVisible = true
      this.resetName.type = 'reset'
      this.resetName.item = folder
      this.resetName.parentId = 0
    },
    /**
     * 菜单重命名
    */
    handleFileResetName(mouseEvent, event, { file, parent }) {
      this.resetName.type = 'reset'
      this.resetNameVisible = true
      this.resetName.item = file
      this.resetName.parentId = parent ? parent.id : 0
    },
    /**
     * 添加新文件夹
     */
    handleAddNewFolder() {
      this.resetNameVisible = true
      this.resetName.type = 'new'
    },
    /**
     * 是否为文件夹
     */
    handleIsFolder(item) {
      // return item.hasOwnProperty('items')
      return item.fileType === 0
    },
    /**
     * 拖动左侧菜单
     */
    handleFileDrag(file) {
      this.dragFile = file
    },
    /**
     * 拖动后投放到目标文件夹
     */
    async handleFileDrop(folder) {
      if (!this.dragFile || this.dragFile.parentId === folder.id) return
      const result = await this.$server.common.putMenuFolderName('/datasource/catalog/updata', {
        fileType: this.dragFile.fileType,
        id: this.dragFile.id,
        name: this.dragFile.name,
        parentId: folder.id,
        type: 1
      })
      if (result.code === 200) {
        this.handleGetMenuList()
        this.$message.success('移动成功')
      } else {
        this.$message.error(result.msg)
      }
    },
    handleDragOver(e) {
      e.preventDefault()
    },
    /**
     * 拖动后投放到最外层目录
     */
    async handleWrapDrop(e) {
      const className = e.toElement.className
      if (className.indexOf('menu-wrap') > -1 && this.dragFile.parentId !== 0) {
        const result = await this.$server.common.putMenuFolderName('/datasource/catalog/updata', {
          fileType: this.dragFile.fileType,
          id: this.dragFile.id,
          name: this.dragFile.name,
          parentId: 0,
          type: 1
        })
        if (result.code === 200) {
          this.handleGetMenuList()
          this.$message.success('移动成功')
        } else {
          this.$message.error(result.msg)
        }
      }
    },
    /**
     * 移动文件夹
     */
    handleFilemoveFile(event, index, { parent, file }) {
      this.selectFile = file
      this.moveFileVisible = true
    },
    /**
     * 选择移动文件夹弹窗确认
     */
    async handleFileMoveCreate(parentId) {
      const result = await this.$server.common.putMenuFolderName('/datasource/catalog/updata', {
        fileType: this.selectFile.fileType,
        id: this.selectFile.id,
        name: this.selectFile.name,
        parentId: parentId,
        type: 1
      })
      if (result.code === 200) {
        this.handleGetMenuList()
        this.$message.success('移动成功')
      } else {
        this.$message.error(result.msg)
      }

      this.resetNameVisible = false
    },
    /**
     * 选择哪个类型的数据接入
     */
    handleSelectModelType(event, item) {
      event.stopPropagation()
      console.log('model-type', item.type)
      this.visible = false
      this.$store.dispatch('dataAccess/setModelType', item.type)
      this.$store.dispatch('dataAccess/setFirstFinished', false)
      this.$store.dispatch('dataAccess/setModelId', 0)
      this.$store.dispatch('dataAccess/setModelInfo', {})
      this.$EventBus.$emit('resetForm')
      this.$EventBus.$emit('set-tab-index', '1')
    },
    /**
     * 重命名弹窗显示
     */
    handleResetNameModalShow(event, options) {
      this.resetNameVisible = true
    },
    /**
     * 重命名弹窗隐藏
     */
    handleResetNameCancel() {
      this.resetNameVisible = false
    },
    /**
     * 重命名弹窗确定
     */
    handleResetNameCreate(values) {
      if (this.resetName.type === 'new') {
        this.handleAddItem(values)
      } else if (this.resetName.type === 'reset') {
        this.handleResetName(values)
      }
      this.resetNameVisible = false
    },
    /**
     * 新增文件夹
     */
    async handleAddItem(values) {
      // const isHas = this.handleHasName(this.tableList, values)
      // if (isHas) return this.$message.warning('已存在')
      // const item = {
      //   id: this.tableList.length + 1,
      //   name: values.name,
      //   items: []
      // }
      // this.tableList.push(item)
      const result = await this.$server.common.addMenuFolder('/datasource/catalog', {
        fileType: 0,
        name: values.name,
        parentId: 0,
        type: 1
      })
      if (result.code === 200) {
        this.handleGetMenuList()
        this.$message.success('新建成功')
      } else {
        this.$message.error(result.msg)
      }

      this.resetNameVisible = false
    },
    /**
     * 修改文件夹及菜单名称
     */
    async handleResetName(values) {
      // const target = this.menuNode.targetNode
      // if (values.name === target.name) {
      //   return this.$message.warning('名称重复')
      // }

      // const isHas = this.handleHasName(this.tableList, values)
      // if (isHas) return this.$message.warning('已存在')

      // this.menuNode.targetNode = Object.assign(target, {
      //   name: values.name
      // })
      const result = await this.$server.common.putMenuFolderName('/datasource/catalog/updata', {
        fileType: this.resetName.item.fileType,
        id: this.resetName.item.id,
        name: values.name,
        parentId: this.resetName.parentId || 0,
        type: 1
      })
      if (result.code === 200) {
        this.handleGetMenuList()
        this.$message.success('修改成功')
      } else {
        this.$message.error(result.msg)
      }

      this.resetNameVisible = false
    },
    /**
     * 判断是否有相同名称
     */
    handleHasName(list, values) {
      const isHas = list.filter(item => {
        return item.name === values.name
      })
      console.log(isHas)
      return !!(isHas && isHas.length > 0)
    },
    /**
     * 选中哪个表
    */
    // async handleSelect({ item, key, selectedKeys }) {
    //   const itemObj = this.tableList.filter(item => {
    //     return item.id === key
    //   }).pop()
    //   if (itemObj.typeCore === 1) {
    //     this.$store.dispatch('dataAccess/setModelType', 'mysql')
    //     this.getTableInfo(`/system/mysql/${itemObj.id}`, result => {
    //       this.$store.dispatch('dataAccess/setModelInfo', {
    //         ...result.data,
    //         port: Number(result.data.port)
    //       })
    //     })
    //   } else if (itemObj.typeCode === 2) {
    //     this.$store.dispatch('dataAccess/setModelType', 'oracle')
    //   }
    //   this.$store.dispatch('dataAccess/setFirstFinished', false)
    //   this.$store.dispatch('dataAccess/setModelId', itemObj.id)
    // },
    mouseenter(icon) {
      this.icon = true
    },
    mouseleave() {
      this.icon = false
    }
  }
}
</script>

<style lang="styl" scope>
@import "./menu.styl";
</style>
