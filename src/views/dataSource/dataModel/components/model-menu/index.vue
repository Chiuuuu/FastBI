<template>
  <div class="model-menu">
    <div class="menu_title">
      <span>数据模型</span>
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link">
          <a-icon type="plus-square" class="menu_icon" />
        </a>
        <a-menu slot="overlay" class="drow_menu">
          <a-menu-item v-on:click="showModal">
            新建模型
          </a-menu-item>
          <a-modal v-model="visible" title="选择数据链接" :bodyStyle="{
            height: `300px`,
            overflowY: 'auto'
          }">
            <a-input ref="userNameInput" v-model="search" placeholder="搜索数据连接" @pressEnter='handleSearch'>
              <a-icon slot="prefix" type="search" />
            </a-input>
            <router-link to="/dataSource/dataAccess" class="modal-item hover">新建数据链接</router-link>
            <div class="modal-wrap">
              <div
                class="group"
                :class="handleIsFolder(folder, 'items') ? 'is-folder' : ''"
                v-for="(folder, index) in modelList"
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
                        :parent="folder"
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
                      @fileSelect="handleFileSelect"
                    ></menu-file>
                  </ul>
                </template>
              </div>
            </div>
          </a-modal>
          <a-menu-item @click="handleAddNewFolder">
            新建文件夹
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-empty v-if="modelList.length === 0" class="table_list-_empty">
      <span slot="description">暂无数据源</span>
    </a-empty>
    <template v-else>
      <div class="menu_search">
        <a-input placeholder="搜索数据模型名称">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <p class="menu_tips">右键文件夹或选项有添加，重命名等操作</p>
      <div class="menu-wrap">
        <div
          class="group"
          :class="handleIsFolder(folder, 'items') ? 'is-folder' : ''"
          v-for="(folder, index) in modelList"
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
import ResetNameModal from '@/views/dataSource/dataAccess/components/data-main/data-menu/resetName'
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'
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
      resetNameVisible: false,
      search: '',
      modelList: [
        {
          id: '1',
          name: '文件夹',
          items: [
            {
              id: '2',
              name: '数据源'
            }
          ]
        },
        {
          id: '3',
          name: '默认的'
        }
      ],
      folderContenxtMenu: [
        {
          name: '新建模型',
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
      ]
    }
  },
  computed: {
    fileSelectId: {
      get () {
        return this.$store.state.dataModel.modelId
      },
      set (value) {
        this.$store.commit('dataModel/SET_MODELID', value)
      }
    }
  },
  mounted() {
    this.$on('fileSelect', this.handleFileSelect)
  },
  methods: {
    /**
     * 打开弹窗
    */
    showModal() {
      this.visible = true
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
    handleFolderResetName() {
      console.log('文件夹重命名')
    },
    /**
     * 文件夹删除
    */
    handleFolderDelete() {
      console.log('文件夹删除')
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
    handleFileDelete() {
      console.log('文件删除')
    },
    /**
     * 点击左侧菜单获取模型信息
    */
    handleFileSelect() {
      console.log('点击左侧菜单获取模型信息')
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
      this.resetNameVisible = true
    },
    /**
     * 重命名取消
    */
    handleResetNameCancel() {
      this.resetNameVisible = false
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

        // if (this.resetNameType === 'new') {
        //   this.handleAddItem(values)
        // } else if (this.resetNameType === 'folder') {
        //   this.handleResetFolderName(values)
        // }
        form.resetFields()
        this.resetNameVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./menu.less";
</style>
