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
      <a-menu
        mode="inline"
        v-model="menuKey"
        @select="handleSelect"
      >
        <template v-for="(item, index) in tableList">
          <template v-if="handleIsFolder(item)">
            <a-menu-item
              v-if="item.items && item.items.length === 0"
              :key="item.id"
            >
              <a-dropdown :trigger="['contextmenu']">
                <div>
                  <a-icon type="file" />
                  {{ item.name }}
                  <!-- <a-icon type="more" style="margin-left:170px" /> -->
                </div>
                <a-menu slot="overlay">
                  <a-menu-item @click="handleResetFolderShow($event, item)">
                    重命名
                  </a-menu-item>
                  <a-menu-item @click="handleResetFolderDelete($event, index)">
                    删除
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-menu-item>
            <a-sub-menu v-else :key="index">
              <span slot="title">
                <a-dropdown :trigger="['contextmenu']">
                  <div>
                    <a-icon type="folder" /><span>{{ item.name }}</span>
                  </div>
                  <a-menu slot="overlay">
                    <a-menu-item @click="handleResetFolderShow($event, item)">
                      重命名
                    </a-menu-item>
                    <a-menu-item
                      @click="handleResetFolderDelete($event, index)"
                    >
                      删除
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
              <a-menu-item v-for="subitem in item.items" :key="subitem.id">
                <a-dropdown :trigger="['contextmenu']">
                  <div @mouseenter="mouseenter" @mouseleave="mouseleave">
                    <div>
                      <a-icon type="file" />
                      {{ subitem.name }}
                      <!-- <a-icon type="more" style="margin-left:130px" /> -->
                    </div>
                  </div>
                  <a-menu slot="overlay">
                    <a-menu-item
                      @click="
                        handleResetNameModalShow($event, {
                          type: 'sub',
                          parentNode: item,
                          item
                        })
                      "
                    >
                      重命名
                    </a-menu-item>
                    <a-menu-item>
                      删除
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-menu-item>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-menu-item :key="item.id">
              <a-dropdown :trigger="['contextmenu']">
                <div @mouseenter="mouseenter" @mouseleave="mouseleave">
                  <a-icon type="file" />{{ item.name
                  }}
                  <!-- <a-icon type="more" style="margin-left:170px" /> -->
                </div>
                <a-menu slot="overlay">
                  <a-menu-item>
                    重命名
                  </a-menu-item>
                  <a-menu-item>
                    删除
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
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
import { fetchTableInfo } from '../../../../../api/dataAccess/api'
export default {
  props: {
    menuData: {
      type: String,
      default: ''
    }
  },
  components: {
    ResetNameModal
  },
  data() {
    return {
      // menuKey: [],
      // tableList: [], // 表列表
      modelList: ['mysql', 'oracle', 'csv'].map(function(item) {
        // 弹窗选项列表
        return {
          imgurl: require(`@/assets/images/icon_${item}.png`),
          name: item,
          type: item
        }
      }),
      resetNameVisible: false, // 重命名弹窗显示
      resetNameType: '', // 重命名类型
      menuNode: {
        // 存储节点
        targetNode: {}, // 目标节点
        parentNode: {} // 父级节点
      },
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
    menuKey: {
      get () {
        return this.$store.state.dataAccess.modelId ? [this.$store.state.dataAccess.modelId] : []
      },
      set (value) {
        this.$store.commit('dataAccess/SET_MODELID', value.pop())
      }
    }
  },
  mounted() {
    this.handleGetMenuList()
  },
  methods: {
    handleGetMenuList() {
      this.$store.dispatch('dataAccess/getMenuList', this)
    },
    /**
     * 添加数据连接
     */
    showModal() {
      this.visible = true
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
    handleOk(e) {
      this.visible = false
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
