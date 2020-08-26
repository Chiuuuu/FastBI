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
            <a-menu-item v-on:click="showModal">
              新建大屏
            </a-menu-item>
            <a-menu-item key="1" @click="addFolder">
              新建文件夹
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="menu_search">
        <a-input placeholder="搜索大屏目录">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <div class="menu-wrap">
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
      <!-- <a-collapse class="menu_collapse" default-active-key="1" :bordered="false">
        <template #expandIcon>
          <a-icon class="folder_icon" type="folder" style="font-size:16px;color:rgba(1,4,15, 0.8)" />
        </template>
        <a-collapse-panel v-for="(item, index) in folderList"
                          :key="index + 1"
                          :header="item.name"
                          :style="customStyle"
                          @contextmenu.prevent="rightClick(item)">
          <p class="menu_folder"
             :class="{active: item2.active}"
             v-for="(item2, index) in item.childen" :key="index + '_'"
             @click.stop="handleScreenClick(item2)"
             @contextmenu.prevent="rightClick(item2)">{{item2.name}}</p>
        </a-collapse-panel>
      </a-collapse> -->
      <!-- <a-menu
        :default-selected-keys="['1']"
        :open-keys.sync="openKeys"
        mode="inline"
      >
        <a-sub-menu v-for="(item, index) in folderList" :key="index" @contextmenu.prevent="rightClick()">
          <div slot="title"
            ><a-icon type="folder" /><span>{{item.name}}</span></div
          >
          <a-menu-item v-for="(item2, index) in item.childen" :key="index + '_'" @contextmenu.prevent="showMore(item2)">
            {{item2.name}}
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title"
            ><a-icon type="folder"/><input
              class="add_input"
              value="新建文件夹"
              onfocus="this.select();"
          /></span>
        </a-sub-menu>
      </a-menu> -->
    </div>
    <div class="right">
      <span class="nav_title">电视统计大屏</span>
      <a-button class="btn_n1">
        全屏
      </a-button>
      <a-button class="btn_n2">
        刷新数据
      </a-button>
      <a-button type="primary" class="btn_pr" @click="editScreen">
        编辑大屏
      </a-button>
      <div class="contain">
        <div class="empty">
          <img src="@/assets/images/icon_empty_state.png" class="empty_img" />
          <span class="empty_word"> 暂无内容 ， 请先添加大屏目录数据 ~</span>
        </div>
      </div>
    </div>

    <a-modal v-model="visible" title="新建大屏" @ok="handleOk">
      <a-form :form="folderForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="大屏名称">
          <a-input class="mod_input"
           v-decorator="['name', { rules: [{ required: true, message: '请输入大屏名称' }] }]"
           placeholder="请输入大屏名称" />
        </a-form-item>
        <a-form-item label="保存目录">
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
export default {
  components: {
    NewFolder,
    MenuFile,
    MenuFolder
  },
  data() {
    return {
      current: ['mail'],
      openKeys: ['sub1'],
      folderList: [], // 文件夹列表
      visible: false,
      isAdd: 1, // 1新增 2编辑 3删除
      folderVisible: false, // 新建文件夹弹窗
      folderForm: this.$form.createForm(this), // 新建大屏弹窗
      customStyle: 'background: #ffffff;border: 0;overflow: hidden;color:#3B3C43;',
      folderContenxtMenu: [
        {
          name: '删除',
          onClick: this.handleFolderDelete
        }
      ],
      fileContenxtMenu: [
        {
          name: '删除',
          onClick: this.handleFileDelete
        }
      ]
    }
  },
  watch: {
    openKeys(val) {
      console.log('openKeys', val)
    }
  },
  computed: {
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
    this.getList()
    this.$on('fileSelect', this.handleFileSelect)
  },
  methods: {
    // 获取文件夹列表
    getList() {
      this.$server.screenManage.folderList().then(res => {
        if (res.data.code === 200) {
          let rows = res.data.rows
          const list = rows.filter(item => {
            // 是否是文件夹
            return item.isFolder === '1'
          })
          // 后端不会返 所以前端要判断parentId与id对应的数据
          for (let item of list) {
            item.showMore = false
            // item.active = false
            this.$set(item, 'active', false)
            item.items = []
            for (let item2 of rows) {
              item2.showMore = false
              if (item2.parentId === item.id) {
                item.items.push(item2)
              }
            }
          }
          console.log(list)
          this.folderList = list
        }
      })
    },
    /**
     * 是否为文件夹
     */
    handleIsFolder(item) {
      return item.hasOwnProperty('items')
    },
    // 右键删除文件夹
    handleFolderDelete(event, item, { folder }) {

    },
    // 右键删除文件
    handleFileDelete(event, item, { parent, file, index }) {

    },
    // 选中文件
    handleFileSelect(file) {

    },
    // 右键点击文件夹
    showMore(item) {
      console.log(item)

      item.showMore = true
    },
    // 点击大屏菜单
    handleScreenClick(obj) {
      for (let item of this.folderList) {
        if (item.childen) {
          for (let item2 of item.childen) {
            item2.active = false
          }
        }
      }
      obj.active = true
      console.log(obj)
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.folderForm.validateFields((err, values) => {
        if (!err) {
          this.visible = false
          this.$router.push({
            path: '/admin',
            query: {
              ...values
            }
          })
        }
      })
    },
    // 编辑大屏
    editScreen() {
      this.$router.push({ name: 'admin' })
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

        if (this.isAdd === 1) {
          let params = {
            isFolder: 1,
            ...values
          }
          this.$server.screenManage.folderAdd(params).then(res => {
            console.log(res.data)
            this.$message.success(res.data.msg)
            if (res.data.code === 200) {
              this.getList()
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
    // 点击右键
    rightClick() {
      console.log(12)
    }
  }
}
</script>

<style lang="styl" scoped>
@import "./screenCatalog.styl";
</style>
