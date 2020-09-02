<template>
  <div class="menu">
    <div class="menu_title">
      <span>数据连接</span>
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link">
          <a-icon type="plus-square" class="menu_icon" />
        </a>
        <a-menu slot="overlay" class="drow_menu">
          <a-menu-item v-on:click="showModal">
            添加连接
          </a-menu-item>
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
          <a-menu-item key="1" @click="handleAddNewFolder">
            新建文件夹
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-empty v-if="tableList.length === 0" class="table_list-_empty">
      <span slot="description">暂无数据库连接</span>
    </a-empty>
    <template v-else>
      <div class="menu_search">
        <a-input placeholder="搜索数据连接名称">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <p class="menu_tips">右键文件夹或选项有添加，重命名等操作</p>
      <div class="menu-wrap">
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
      :visible="resetNameVisible"
      @cancel="handleResetNameCancel"
      @create="handleResetNameCreate"
    ></reset-name-modal>
  </div>
</template>

<script>
import ResetNameModal from '../data-main/data-menu/resetName'
import { mapState } from 'vuex'
import { fetchTableInfo, fetchDeleteMenuById } from '../../../../../api/dataAccess/api'
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'
export default {
  name: 'data-menu',
  props: {
    menuData: {
      type: String,
      default: ''
    }
  },
  components: {
    ResetNameModal,
    MenuFile,
    MenuFolder
  },
  data() {
    return {
      modelList: ['mysql', 'oracle'].map(function(item) {
        // 弹窗选项列表
        return {
          imgurl: require(`@/assets/images/icon_${item}.png`),
          name: item,
          type: item
        }
      }),
      // fileSelectId: '', // 选中左侧菜单
      resetNameVisible: false, // 重命名弹窗显示
      resetNameType: '', // 重命名类型
      menuNode: {
        // 存储节点
        targetNode: {}, // 目标节点
        parentNode: {} // 父级节点
      },
      folderContenxtMenu: [
        {
          name: '添加链接',
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
          onClick: this.handleFileMoveFolder
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
    * 选择左侧菜单
    */
    async handleFileSelect(file) {
      if (this.fileSelectId === file.id) return
      this.fileSelectId = file.id
      if (file.typeCore === 1) {
        this.$store.dispatch('dataAccess/setModelType', 'mysql')

        const result = await fetchTableInfo({
          url: '/admin/dev-api/system/mysql/' + file.id
        })
        if (result.data.code === 200) {
          this.$store.dispatch('dataAccess/setModelInfo', {
            ip: result.data.data.ip,
            name: result.data.data.name,
            password: result.data.data.password,
            port: Number(result.data.data.port),
            username: result.data.data.username
          })
          this.$EventBus.$emit('setFormData')
        } else {
          this.$message.error(result.data.msg)
        }
      } else if (file.typeCore === 2) {
        this.$store.dispatch('dataAccess/setModelType', 'oracle')
        const result = await fetchTableInfo({
          url: '/admin/dev-api/system/oracle/' + file.id
        })
        if (result.data.code === 200) {
          this.$store.dispatch('dataAccess/setModelInfo', {
            ...result.data.data,
            port: Number(result.data.data.port)
          })
          this.$EventBus.$emit('setFormData')
        } else {
          this.$message.error(result.data.msg)
        }
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
    async handleFileDelete(event, item, { parent, file, index }) {
      const result = await fetchDeleteMenuById({
        url: `/admin/dev-api/system/catalog/delete/${file.id}`
      })
      if (result.data.code === 200) {
        if (parent) {
          parent.splice(index, 1)
        } else {
          this.tableList.splice(index, 1)
        }
      } else {
        this.$message.error(result.data.msg)
      }
    },
    /**
     * 打开数据类型弹窗
     */
    showModal() {
      this.visible = true
      this.$store.dispatch('dataAccess/setModelSelectType', 'new')
    },
    /**
     * 打开数据类型弹窗
     */
    showResetNameModal() {
      this.resetNameVisible = true
    },
    /**
    * 修改文件夹名称
    */
    handleFolderResetName(event, item, { folder }) {
      this.resetNameVisible = true
      // this.resetNameType = 'new'
      folder.name = 'new'
    },
    /**
     * 添加新文件夹
     */
    handleAddNewFolder() {
      this.resetNameVisible = true
      this.resetNameType = 'new'
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
    handleResetFolderShow(event, item) {
      this.resetNameType = 'folder'
      this.menuNode = Object.assign(this.menuNode, {
        targetNode: item,
        parentNode: {}
      })
      this.handleResetNameModalShow()
    },
    /**
     * 文件夹删除
     */
    handleResetFolderDelete(event, index) {
      this.tableList.splice(index, 1)
    },
    /**
     * 选择哪个类型的数据连接
     */
    handleSelectModelType(event, item) {
      event.stopPropagation()
      console.log('model-type', item.type)
      this.visible = false
      this.$store.dispatch('dataAccess/setModelType', item.type)
      this.$store.dispatch('dataAccess/setFirstFinished', false)
      this.$store.dispatch('dataAccess/setModelId', -1)
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
    handleResetNameCreate() {
      const form = this.$refs.resetNameForm.form
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        console.log('Received values of form: ', values)

        if (this.resetNameType === 'new') {
          this.handleAddItem(values)
        } else if (this.resetNameType === 'folder') {
          this.handleResetFolderName(values)
        }
        form.resetFields()
        this.resetNameVisible = false
      })
    },
    /**
     * 新增文件夹
     */
    handleAddItem(values) {
      const isHas = this.handleHasName(this.tableList, values)
      if (isHas) return this.$message.warning('已存在')
      const item = {
        id: this.tableList.length + 1,
        name: values.name,
        items: []
      }
      this.tableList.push(item)
    },
    /**
     * 修改文件夹名称
     */
    handleResetFolderName(values) {
      const target = this.menuNode.targetNode
      if (values.name === target.name) {
        return this.$message.warning('名称重复')
      }

      const isHas = this.handleHasName(this.tableList, values)
      if (isHas) return this.$message.warning('已存在')

      this.menuNode.targetNode = Object.assign(target, {
        name: values.name
      })
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
    async handleSelect({ item, key, selectedKeys }) {
      console.log('select', selectedKeys)
      const itemObj = this.tableList.filter(item => {
        return item.id === key
      }).pop()
      console.log('obj', itemObj)
      if (itemObj.typeCore === 1) {
        this.$store.dispatch('dataAccess/setModelType', 'mysql')

        const result = await fetchTableInfo({
          url: '/admin/dev-api/system/mysql/' + itemObj.id
        })
        console.log('result', result)
        if (result.data.code === 200) {
          this.$store.dispatch('dataAccess/setModelInfo', {
            ip: result.data.data.ip,
            name: result.data.data.name,
            password: '',
            port: Number(result.data.data.port),
            username: result.data.data.username
          })
          this.$EventBus.$emit('setFormData')
        } else {
          this.$message.error(result.data.msg)
        }
      } else if (itemObj.typeCode === 2) {
        this.$store.dispatch('dataAccess/setModelType', 'oracle')
      }
      this.$store.dispatch('dataAccess/setFirstFinished', false)
      this.$store.dispatch('dataAccess/setModelId', itemObj.id)
    },
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
