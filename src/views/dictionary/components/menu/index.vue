<template>
  <div class="menu scrollbar" id="menuRef">
    <div class="menu_title">
      <span class="m-t-s">数据字典</span>
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link">
          <a-icon type="plus-square" class="menu_icon" />
        </a>
        <a-menu slot="overlay" class="drow_menu">
          <a-menu-item key="1" @click="handleAddNewFolder">
            新建文件夹
          </a-menu-item>
          <a-menu-item @click="showModal">
            新建代码集
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-modal
        v-model="visible"
        title="添加数据字典"
        :bodyStyle="{
          maxHeight: `calc( 100vh - 160px )`,
          overflowY: 'auto'
        }"
        @ok="handleAddItem"
      >
        <a-form-model ref="form" :model="form" :rules="rules" width="500px" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-form-model-item label="数据字典名称" prop="name">
            <a-input v-model="form.name" placeholder="请输入数据字典名称"></a-input>
          </a-form-model-item>
          <a-form-model-item label="存储文件夹" prop="parentId">
            <a-select v-model="form.parentId">
              <a-select-option v-for="item in folderList" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
    <div class="menu_search">
      <a-input placeholder="搜索数据字典名称" @input="handleSearchMenu">
        <a-icon class="icon_search" slot="suffix" type="search" />
      </a-input>
    </div>
    <a-empty v-if="menuList.length === 0" class="table_list_empty">
      <span slot="description">暂无数据字典</span>
    </a-empty>
    <template v-else>
      <!-- <p class="menu_tips">右键文件夹或选项有添加，重命名等操作</p> -->
      <div class="menu-wrap scrollbar" @dragover.stop="handleDragOver" @drop="handleWrapDrop">
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
                  :isSelect='file.id === slotProps.file.id'
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
                :isSelect='file.id === folder.id'
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
      show-title="数据字典"
      :visible="resetNameVisible"
      :reset-type="1"
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
import ResetNameModal from './resetName'
import MoveFileModal from './moveFile'
import { menuSearchLoop } from '@/utils/menuSearch'
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'
import debounce from 'lodash/debounce'
export default {
  name: 'permMenu',
  props: {
    file: {
      type: Object,
      default() {
        return {}
      }
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
      tableList: [],
      searchValue: '', // 关键词搜索
      searchList: [], // 搜索结果
      resetNameVisible: false, // 重命名弹窗显示
      resetName: {
        item: '',
        type: '',
        parentId: ''
      }, // 选中文件夹
      form: {
        name: '',
        parentId: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入数据字典名称'
          },
          {
            max: 20,
            message: '请输入1-20个字的数据字典名称'
          }
        ],
        parentId: [
          {
            required: true,
            message: '请选择存储位置'
          }
        ]
      },
      visible: false,
      selectFile: null, // 选中文件
      dragFile: null, // 选中文件
      moveFileVisible: false, // 移动文件夹弹窗
      folderContenxtMenu: [
        {
          name: '添加数据字典',
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
      ]
    }
  },
  computed: {
    menuList() {
      return this.searchValue ? this.searchList : this.tableList
    },
    folderList() {
      return this.tableList.filter(item => item.fileType === 0)
    }
  },
  mounted() {
    this.handleGetMenuList()
  },
  methods: {
    /**
    * 获取左侧菜单数据
    */
    async handleGetMenuList() {
      const result = await this.$server.dataDictionary.getDictionaryMenu()
      if (result.code === 200) {
        this.tableList = result.rows
      } else {
        this.$message.error(result.msg || '获取目录失败')
      }
    },
    showModal(event, item, vm) {
      this.visible = true
      if (vm && vm.folder) {
        this.form.parentId = vm.folder.id
      } else {
        this.form.parentId = undefined
      }
    },
    /**
     * 搜索文件夹列表
     */
    handleSearchMenu: debounce(function(event) {
      const value = event.target.value
      this.searchValue = value
      if (value) {
        this.handleGetSearchList(value)
      }
    }, 400),
    handleGetSearchList(value) {
      let result = []
      this.tableList.map(item => {
        const newItem = menuSearchLoop(item, value)
        if (newItem) result.push(newItem)
      })
      this.searchList = result
    },
    /**
    * 选择左侧菜单
    */
    handleFileSelect(file) {
      if (this.file.id === file.id) return
      this.$emit('update:file', file)
    },
    /**
    * 删除菜单
    */
    handleFileDelete(event, item, { file }) {
      this.$confirm({
        title: '确认提示',
        content: '确定删除该数据字典?',
        onOk: async () => {
          const result = await this.$server.dataDictionary.deleDictionaryMenu(file.id)
          if (result.code === 200) {
            this.handleGetMenuList()
            this.$message.success('删除成功')
            const isSame = file.id === this.file.id
            if (isSame) {
              this.$emit('update:file', {})
            }
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
      if (folder.children && folder.children.length > 0) {
        return this.$message.error('文件夹下存在数据字典不可删除')
      }
      this.$confirm({
        title: '确认提示',
        content: '确定删除该文件夹?',
        onOk: async () => {
          const result = await this.$server.dataDictionary.deleDictionaryMenu(folder.id)
          if (result.code === 200) {
            this.handleGetMenuList()
            this.$message.success('删除成功')
            const isSame = folder.id === this.file.id
            if (isSame) {
              this.$emit('update:file', {})
            }
          } else {
            this.$message.error(result.msg)
          }
        }
      })
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
      const result = await this.$server.dataDictionary.putDictionaryMenu({
        fileType: this.dragFile.fileType,
        id: this.dragFile.id,
        name: this.dragFile.name,
        parentId: folder.id,
        type: 6
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
     * 拖动后投放到最外层文件夹
     */
    async handleWrapDrop(e) {
      // const className = e.toElement.className
      // if (className.indexOf('menu-wrap') > -1 && this.dragFile.parentId !== 0) {
      //   const result = await this.$server.dataDictionary.putDictionaryMenu({
      //     fileType: this.dragFile.fileType,
      //     id: this.dragFile.id,
      //     name: this.dragFile.name,
      //     parentId: 0,
      //     type: 6
      //   })
      //   if (result.code === 200) {
      //     this.handleGetMenuList()
      //     this.$message.success('移动成功')
      //   } else {
      //     this.$message.error(result.msg)
      //   }
      // }
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
      const result = await this.$server.dataDictionary.putDictionaryMenu({
        fileType: this.selectFile.fileType,
        id: this.selectFile.id,
        name: this.selectFile.name,
        parentId: parentId,
        type: 6
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
        this.handleAddMenu(values)
      } else if (this.resetName.type === 'reset') {
        this.handleResetName(values)
      }
      this.resetNameVisible = false
    },
    /**
     * 新增文件夹
     */
    async handleAddMenu(values) {
      const result = await this.$server.dataDictionary.addDictionaryMenu({
        fileType: 0,
        name: values.name,
        parentId: 0,
        type: 6
      })
      if (result.code === 200) {
        this.handleGetMenuList()
        this.$message.success('新建成功')
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 新增菜单
     */
    async handleAddItem() {
      const result = await this.$server.dataDictionary.addDictionaryMenu({
        fileType: 1,
        name: this.form.name,
        parentId: this.form.parentId || 0,
        type: 6
      })
      if (result.code === 200) {
        this.handleGetMenuList()
        this.$message.success('新建成功')
        this.$refs.form.resetFields()
        this.visible = false
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 修改文件夹及菜单名称
     */
    async handleResetName(values) {
      const result = await this.$server.dataDictionary.putDictionaryMenu({
        fileType: this.resetName.item.fileType,
        id: this.resetName.item.id,
        name: values.name,
        parentId: this.resetName.parentId || 0,
        type: 6
      })
      if (result.code === 200) {
        this.handleGetMenuList()
        this.$message.success('修改成功')
      } else {
        this.$message.error(result.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./menu";
</style>
