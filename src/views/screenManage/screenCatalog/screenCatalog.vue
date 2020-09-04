<template>
  <div class="screen-catalog">
    <div class="left">
      <div class="menu_title">
        <span>大屏目录</span>
        <a-dropdown :trigger="['click']" placement="bottomLeft">
          <a class="ant-dropdown-link">
            <a-icon type="plus-square" class="menu_icon" />
          </a>
          <a-menu slot="overlay" class="drow_menu">
            <a-menu-item v-on:click="addScreen">
              新建大屏
            </a-menu-item>
            <a-menu-item key="1" @click="addFolder">
              新建文件夹
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="menu_search">
        <a-input placeholder="搜索大屏目录" v-model="searchName" @change="menuSearch">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <div class="menu-wrap screen-menu">
        <div
          class="group"
          :class="handleIsFolder(folder, 'items') ? 'is-folder' : ''"
          v-for="(folder, index) in folderList"
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
    </div>
    <div class="right">
      <span class="nav_title">电视统计大屏</span>
      <a-button class="btn_n1" @click="openScreen">
        全屏
      </a-button>
      <a-button class="btn_n2">
        刷新数据
      </a-button>
      <a-button type="primary" class="btn_pr" @click="editScreen">
        编辑大屏
      </a-button>
      <div class="contain" ref="contain" :style="wrapStyle">
        <screen v-if="folderList.length > 0 && flag" :style="canvasPanelStyle"></screen>
        <div class="empty" v-else>
          <img src="@/assets/images/icon_empty_state.png" class="empty_img" />
          <span class="empty_word"> 暂无内容 ， 请先添加大屏目录数据或者选择一个大屏目录 ~</span>
        </div>
      </div>
    </div>

    <a-modal v-model="screenVisible" title="新建大屏" @ok="handleOk">
      <a-form :form="screenForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="大屏名称">
          <a-input class="mod_input"
           v-decorator="['name', { rules: [{ required: true, message: '请输入大屏名称'}] }]"
           placeholder="请输入大屏名称"
           :maxLength="20" />
        </a-form-item>
        <a-form-item label="保存目录" v-if="isAdd !== 2">
          <a-select
            v-decorator="['parentId', { rules: [{ required: true, message: '请选择大屏目录' }] }]"
            placeholder="选择大屏目录"
            style="width:310px">
            <a-select-option v-for="(item, index) in folderList" :key="index" :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <new-folder ref="newFolderForm" :visible="folderVisible" @cancel="hideFolder" @create="creatFolder"></new-folder>
  </div>
</template>

<script>
import NewFolder from '@/components/newFolder/newFolder'
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'

import { mapGetters } from 'vuex' // 导入vuex
import Screen from '@/views/screen' // 大屏
import { addResizeListener, removeResizeListener } from 'bin-ui/src/utils/resize-event'

export default {
  components: {
    NewFolder,
    MenuFile,
    MenuFolder,
    Screen
  },
  data() {
    return {
      current: ['mail'],
      openKeys: ['sub1'],
      folderList: [], // 文件夹列表
      screenVisible: false, // 新建大屏弹窗
      isAdd: 1, // 1新增 2编辑 3删除
      folderVisible: false, // 新建文件夹弹窗
      screenForm: this.$form.createForm(this), // 新建大屏弹窗
      customStyle: 'background: #ffffff;border: 0;overflow: hidden;color:#3B3C43;',
      folderContenxtMenu: [
        {
          name: '新建大屏',
          onClick: this.handleScreen
        },
        {
          name: '重命名',
          onClick: this.handleResetFolder
        },
        {
          name: '删除',
          onClick: this.handleFolderDelete
        }
      ],
      fileContenxtMenu: [
        {
          name: '重命名',
          onClick: this.handleResetFile
        },
        {
          name: '删除',
          onClick: this.handleFileDelete
        }
      ],
      wrapStyle: {},
      range: 0,
      flag: true, // 用于刷新大屏数据
      searchName: '' // 搜索名称
    }
  },
  watch: {
    openKeys(val) {
      console.log('openKeys', val)
    }
  },
  computed: {
    ...mapGetters(['pageSettings', 'canvasRange', 'screenId']),
    fileSelectId: {
      get () {
        console.log(this.screenId)
        return this.screenId
      },
      set (value) {
        this.$store.dispatch('SetScreenId', value)
        // this.$store.commit('dataAccess/SET_MODELID', value)
      }
    },
    // 画布面板的样式
    canvasPanelStyle () {
      let obj = {
        width: `${this.pageSettings.width}px`,
        height: `${this.pageSettings.height}px`,
        transform: `scale(0.47) translate3d(0px, 0px, 0)`,
        transformOrigin: '0 0',
        backgroundColor: this.pageSettings.backgroundColor
      }
      return obj
    }
  },
  mounted() {
    if (!this.fileSelectId) {
      this.flag = false
    }
    this.getList()
    this.$on('fileSelect', this.handleFileSelect)

    this.$nextTick(this._calcStyle)
    addResizeListener(this.$refs.contain, this._calcStyle)
  },
  beforeDestroy () {
    removeResizeListener(this.$refs.contain, this._calcStyle)
  },
  methods: {
    // 获取文件夹列表
    getList() {
      let params = {
        name: this.searchName
      }
      this.$server.screenManage.folderList(params).then(res => {
        if (res.data.code === 200) {
          let rows = res.data.rows
          const list = rows.filter(item => {
            // 是否是文件夹
            return item.isFolder === '1'
          })
          // 后端不会返 所以前端要判断parentId与id对应的数据
          for (let item of list) {
            item.items = []
            for (let item2 of rows) {
              if (item2.parentId === item.id) {
                item.items.push(item2)
              }
            }
          }
          this.folderList = list
        }
      })
    },
    menuSearch() {
      this.getList()
    },
    /**
     * 是否为文件夹
     */
    handleIsFolder(item) {
      return item.hasOwnProperty('items')
    },
    // 右键删除文件夹
    handleFolderDelete(event, item, { folder }) {
      this.handleDelete(folder.id)
    },
    // 右键删除文件
    handleFileDelete(event, item, { parent, file, index }) {
      this.handleDelete(file.id)
    },
    // 删除
    handleDelete(id) {
      let params = {
        id: id
      }
      this.$server.screenManage.folderDel(params).then(res => {
        if (res.data.code === 200) {
          this.getList()
          this.$store.dispatch('SetScreenId', '')
          this.flag = false
        }
      })
    },
    // 重命名文件夹
    handleResetFolder(event, item, { folder }) {
      this.isAdd = 2
      this.id = folder.id
      this.folderVisible = true
      this.$nextTick(() => {
        this.$refs.newFolderForm.form.setFieldsValue({
          name: folder.name
        })
      })
    },
    // 重命名大屏
    handleResetFile(event, item, { parent, file, index }) {
      this.isAdd = 2
      this.id = file.id
      this.screenVisible = true
      // dom渲染以后才能给form赋值
      this.$nextTick(() => {
        this.screenForm.setFieldsValue({
          name: file.name
        })
      })
    },
    // 在文件夹底下新建大屏
    handleScreen(event, item, { folder }) {
      this.isAdd = 1
      this.screenVisible = true
      // dom渲染以后才能给form赋值
      this.$nextTick(() => {
        this.screenForm.setFieldsValue({
          parentId: folder.id
        })
      })
    },
    // 选择左侧菜单
    handleFileSelect(file) {
      if (this.fileSelectId === file.id) return
      this.flag = false
      this.fileSelectId = file.id
      this.$store.dispatch('SetScreenId', file.id)
      setTimeout(() => {
        this.flag = true
      })
    },
    // 点击新建大屏
    addScreen() {
      this.isAdd = 1
      this.screenVisible = true
    },
    // 确认新建大屏
    handleOk(e) {
      this.screenForm.validateFields((err, values) => {
        if (err) {
          return
        }
        if (this.isAdd === 1) { // 新增
          this.$router.push({
            path: '/admin',
            query: {
              ...values
            }
          })
        } else { // 编辑
          let params = {
            isFolder: 0,
            id: this.id,
            ...values
          }
          this.$server.screenManage.folderput(params).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              this.getList()
            }
          })
        }
        this.screenForm.resetFields()
        this.$store.dispatch('SetScreenId', '')
        this.screenVisible = false
      })
    },
    // 编辑大屏
    editScreen() {
      console.log(this.screenId)
      this.$router.push({ path: '/admin',
      query: {
        id: this.fileSelectId
      } })
    },
    // 点击新建文件夹
    addFolder() {
      this.isAdd = 1
      this.folderVisible = true
    },
    // 创建文件夹
    creatFolder() {
      const form = this.$refs.newFolderForm.form
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        console.log('Received values of form: ', values)
        if (this.isAdd === 1) { // 新增
          let params = {
            isFolder: 1,
            ...values
          }
          this.$server.screenManage.folderAdd(params).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              this.getList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else { // 修改
          let params = {
            isFolder: 1,
            id: this.id,
            ...values
          }
          this.$server.screenManage.folderput(params).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              this.getList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
        form.resetFields()
        this.folderVisible = false
      })
    },
    // 关闭新建文件夹弹窗
    hideFolder() {
      this.folderVisible = false
    },
    // 打开全屏
    openScreen () {
      this.$store.dispatch('SetIsScreen', true)
      // this.$router.push({ name: 'screen', params: { id: this.userId } })
      this.$nextTick(() => {
        var docElm = document.querySelector('.dv-screen')
        if (docElm) {
          if (docElm.requestFullscreen) { // W3C
            docElm.requestFullscreen()
          } else if (docElm.mozRequestFullScreen) { // FireFox
              docElm.mozRequestFullScreen()
          } else if (docElm.webkitRequestFullScreen) { // Chrome等
              docElm.webkitRequestFullScreen()
          } else if (docElm.msRequestFullscreen) { // IE11
              docElm.msRequestFullscreen()
          }
        }
      })
    },
    _calcStyle () {
      const wrap = this.$refs.contain
      if (!wrap) return
      // 计算wrap样式
      // 计算缩放比例
      let range = ((wrap.clientWidth - 120) / this.pageSettings.width)
      range = Math.round(range * 100) / 100
      if (range < 0.3) {
        range = 0.3
      }
      this.wrapStyle = {
        width: `${this.pageSettings.width * range + 120}px`,
        height: `${this.pageSettings.height * range + 120}px`
      }
      this.range = range
    }
  }
}
</script>

<style lang="styl" scoped>
@import "./screenCatalog.styl";
</style>
