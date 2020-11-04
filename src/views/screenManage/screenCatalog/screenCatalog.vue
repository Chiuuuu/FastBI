<template>
  <div class="screen-catalog">
    <div class="left">
      <div class="menu_title">
        <span>大屏目录</span>
        <a-dropdown :trigger="['click']" placement="bottomLeft">
          <a-icon type="plus-square" class="menu_icon" />
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
      <div class="menu_search" v-if="folderList.length > 0">
        <a-input placeholder="搜索大屏目录" v-model="searchName" @change="menuSearch">
          <a-icon class="icon_search" slot="suffix" type="search" />
        </a-input>
      </div>
      <div class="menu-wrap scrollbar screen-menu">
        <div
          class="group"
          :class="handleIsFolder(folder) ? 'is-folder' : ''"
          v-for="(folder, index) in folderList"
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
    </div>
    <div class="right scrollbar">
      <div class="right-header" v-if="fileSelectId !== ''">
        <span class="nav_title">{{fileName}}</span>
        <a-button class="btn_n1" @click="openScreen">
          全屏
        </a-button>
        <a-button class="btn_n2">
          刷新数据
        </a-button>
        <a-button type="primary" class="btn_pr" @click="editScreen">
          编辑大屏
        </a-button>
      </div>
      <div class="contain" ref="contain">
        <screen v-if="fileSelectId" :key="componentKey"></screen>
        <div class="empty" v-else>
          <img src="@/assets/images/icon_empty_state.png" class="empty_img" />
          <p class="empty_word"> 暂无内容 ， 请先添加大屏目录数据或者选择一个大屏目录 ~</p>
        </div>
      </div>
    </div>

    <a-modal v-model="screenVisible" :title="isAdd===1?'新建大屏':'重命名大屏'" @ok="handleOk">
      <a-form :form="screenForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="名称">
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

    <new-folder ref="newFolderForm" :title="folderTitle" :visible="folderVisible" @cancel="hideFolder" @create="creatFolder"></new-folder>
  </div>
</template>

<script>
import NewFolder from '@/components/newFolder/newFolder'
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'

import { mapGetters, mapActions } from 'vuex' // 导入vuex
import Screen from '@/views/screen' // 预览
import { addResizeListener, removeResizeListener } from 'bin-ui/src/utils/resize-event'
import debounce from 'lodash/debounce'
import { menuSearchLoop } from '@/views/dataSource/dataModel/util'

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
      folderTitle: '',
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
      searchName: '', // 搜索名称
      componentKey: 0
    }
  },
  watch: {
    openKeys(val) {
      console.log('openKeys', val)
    },
    screenId: {
      handler(val) {},
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['pageSettings', 'canvasRange', 'screenId', 'fileName', 'isScreen', 'parentId']),
    fileSelectId: {
      get () {
        return this.screenId
      },
      set (value) {
        this.$store.dispatch('SetScreenId', value)
        // this.$store.commit('dataAccess/SET_MODELID', value)
      }
    },
    menuList() {
      return this.searchValue ? this.searchList : this.tableList
    }
  },
  mounted() {
    this.getList()
    this.$on('fileSelect', this.handleFileSelect)

    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.componentKey -= 1
        this.$store.dispatch('SetIsScreen', false)
      }
    }
  },
  methods: {
    ...mapActions(['saveScreenData']),
    // 获取文件夹列表
    getList() {
      let params = {
        type: 3
      }
      this.$server.screenManage.getFolderList({ params }).then(res => {
        if (res.code === 200) {
          let rows = res.data
          this.folderList = rows
        }
      })
    },
    // 搜索
    menuSearch: debounce(function(event) {
      const value = event.target.value
      if (value !== '') {
        this.handleGetSearchList(value)
      } else {
        this.getList()
      }
    }, 400),
    handleGetSearchList(value) {
      let result = []
      this.folderList.map(item => {
        const newItem = menuSearchLoop(item, value)
        if (newItem) result.push(newItem)
      })
      this.folderList = result
      console.log('搜索结果', this.folderList)
    },
    /**
     * 是否为文件夹
     */
    handleIsFolder(item) {
      return item.fileType === 0
    },
    // 右键删除文件夹
    handleFolderDelete(event, item, { folder }) {
      if (folder.children && folder.children.length > 0) {
        return this.$message.error('文件夹下存在数据大屏不可删除')
      }
      this.handleDelete(folder.id)
    },
    // 右键删除文件
    handleFileDelete(event, item, { parent, file, index }) {
      this.handleDelete(file.id)
    },
    // 删除
    handleDelete(id) {
      let params = {
        id
      }
      this.$server.common.deleMenuFolder(`/screen/catalog/${id}`).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getList()
          this.$store.dispatch('SetScreenId', '')
          this.$store.dispatch('SetFileName', '')
          this.$store.dispatch('SetParentId', '')
        }
      })
    },
    // 重命名文件夹
    handleResetFolder(event, item, { folder }) {
      this.isAdd = 2
      this.id = folder.id
      this.folderVisible = true
      this.folderTitle = '重命名文件夹'
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
      this.pid = file.parentId
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
      this.fileSelectId = file.id
      this.$store.dispatch('SetScreenId', file.id)
      this.$store.dispatch('SetFileName', file.name)
      this.$store.dispatch('SetParentId', file.parentId)
    },
    // 点击新建大屏
    addScreen() {
      this.isAdd = 1
      this.screenVisible = true
    },
    // 新建/编辑大屏
    handleOk(e) {
      this.screenForm.validateFields((err, values) => {
        if (err) {
          return
        }
        this.$store.dispatch('SetScreenId', '')
        if (this.isAdd === 1) { // 新增
          this.saveScreenData({ ...values, isAdd: 1 })
          this.$store.dispatch('SetFileName', values.name)
          // this.$router.push({
          //   name: 'screenEdit',
          //   query: {
          //     ...values
          //   }
          // })
        } else { // 编辑
          let params = {
            fileType: 1,
            id: this.id,
            parentId: this.pid,
            ...values
          }
          this.$server.common.putMenuFolderName('/screen/catalog', params).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.getList()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
        this.screenForm.resetFields()
        this.screenVisible = false
      })
    },
    // 编辑大屏
    editScreen() {
      if (!this.screenId) {
        this.$message.error(' 请先添加大屏目录数据或者选择一个大屏目录')
        return
      }
      this.$router.push({ name: 'screenEdit',
      query: {
        id: this.fileSelectId
      } })
    },
    // 点击新建文件夹
    addFolder() {
      this.isAdd = 1
      this.folderVisible = true
      this.folderTitle = '新建文件夹'
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
            fileType: 0, // 0-文件夹,1-文件
            ...values,
            parentId: 0,
            type: 3 // 0-无类型,1-数据接入，2-数据建模,3-数据大屏
          }
          this.$server.common.addMenuFolder('/screen/catalog', params).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.getList()
              // 新建文件夹后 返回空页面 不显示大屏
              this.$store.dispatch('SetScreenId', '')
              this.$store.dispatch('SetFileName', '')
            } else {
              this.$message.error(res.msg)
            }
          })
        } else { // 修改
          let params = {
            fileType: 0,
            id: this.id,
            ...values
          }
          this.$server.common.putMenuFolderName('/screen/catalog', params).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
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
      this.componentKey += 1
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
     /**
     * 是否全屏并按键ESC键的方法
     */
    checkFull () {
      // document.fullscreenEnabled 谷歌浏览器一直返回true
      // let isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      let isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    }
  }
}
</script>

<style lang="styl" scoped>
@import "./screenCatalog.styl";
</style>
