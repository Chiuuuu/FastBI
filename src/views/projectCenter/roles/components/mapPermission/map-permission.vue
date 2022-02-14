<template>
<!-- 片区地图权限 -->
  <div class="tab scrollbar">
    <!-- 模块名称 -->
    <a-row class="line" style="padding-left: 16px">
      <a-col span="2">{{ roleTitle }}</a-col>
      <a-col>
        <a-button
          style="margin-left:10px"
          size="small"
          type="primary"
          @click="handleSetMapTree"
        >{{ status === 'show' ? '查看片区身份' : '配置片区身份' }}</a-button>
      </a-col>
    </a-row>
    <!-- 权限标题(增删改查发布...) -->
    <a-row class="title">
      <a-col :span="24 - injectActionList.length * 2">
        <span>所有模块</span>
      </a-col>
      <a-col :span="2" align="left" v-for="item in injectActionList" :key="item.permission">
        <span>{{ item.name }}</span>
      </a-col>
    </a-row>
    <!-- 全选栏 -->
    <div class="checkbox-all">
      <a-row>
        <a-col :span="24 - injectActionList.length * 2">
          <span style="margin-right: 8px">全选</span>
          <a-checkbox :disabled="status === 'show'" :indeterminate="indeterminate" :checked="checkAll" @change="handleCheckAll"></a-checkbox>
        </a-col>
        <a-col :span="injectActionList.length * 2">
          <a-checkbox-group :value="injectAllPermission" style="width:100%">
            <a-row>
              <a-col span="5" v-for="(subitem,subindex) in injectActionList" :key="subitem.permission" :style="{
                width: `${100 / injectActionList.length}%`
              }">
                <a-checkbox
                  :class="`custom-checkbox-${subindex+1}`"
                  :value="subitem.permission"
                  @change="(e) => handleCheckbox(subitem, e)"
                  :disabled="status === 'show'"></a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </div>

    <!-- 勾选项 -->
    <div class="content scrollbar">
      <LimitTree ref="tree" v-on="$listeners" :show-icon="false" />
    </div>

    <!-- 片区地图数据配置模态框 -->
    <MapTree ref="MapTree" :visible.sync="visibleMapTree" v-on="$listeners" />
  </div>
</template>

<script>
import MapTree from './map-tree'
import LimitTree from '../limitTree/limit-tree.vue'
export default {
  name: 'mapPermission',
  inject: [
    'status',
    'getCurrentAllPermission',
    'getProvideActionList',
    'getCurrentRoleTab',
    'getProvideTreeData'
  ],
  props: {
    roleTitle: String,
    options: Object
  },
  data() {
    return {
      visibleMapTree: false,
      list: [{ title: '片区地图' }, { title: '片区地址' }]
    }
  },
  components: {
    MapTree,
    LimitTree
  },
  computed: {
    isDisabled() {
      return this.status === 'show'
    },
    checkAll() {
      return this.injectAllPermission.length > 0 &&
      this.injectAllPermission.length === this.injectActionList.length
    },
    indeterminate() {
      return (
        this.injectAllPermission.length > 0 &&
        this.injectAllPermission.length < this.injectActionList.length
      )
    },
    injectAllPermission() {
      return this.getCurrentAllPermission()
    },
    injectActionList() {
      return this.getProvideActionList()
    },
    injectRoleTab() {
      return this.getCurrentRoleTab()
    },
    injectTreeData() {
      return this.getProvideTreeData()
    }
  },
  methods: {
    // 勾选具体的操作权限
    onCheck(value) {
      this.options.permissions = value
      this.$emit('setBasePrivilege', value, this.injectRoleTab + '')
    },
    // 点击配置片区地图数据
    handleSetMapTree() {
      this.visibleMapTree = true
      // this.$refs.MapTree && this.$refs.MapTree.handleSetMapTree()
    },
    // 点击全选
    handleCheckAll(e) {
      this.injectActionList.map((item) => {
        this.handleCheckbox(item, e)
      })
    },
    // 处理全选栏按钮
    handleCheckbox({ permission }, e) {
      const checked = e.target.checked
      const READ_PERMISSION = 'read'
      const EDIT_PERMISSION = 'edit'
      const EDIT_LOCK_PERMISSION = 'lock'
      // 调用limit-tree组件的递归方法赋值权限
      const handleCheckbox = this.$refs.tree.handleCheckbox
      // 遍历树结构
      this.injectTreeData.map((item) => {
        // 文件夹权限和菜单不一致, 分开处理
        if (item.fileType === 0) {
          const perm = this.changePermissionToFolder(permission)
          if (perm !== 'null') {
            handleCheckbox(perm, checked, item)
          }
          // 有子节点则继续遍历
          if (
            item.children &&
            item.children.length &&
            item.children.length > 0
          ) {
            item.children.map((node) => {
              handleCheckbox(permission, checked, node)
            })
          }
        } else if (item.fileType === 1) {
          handleCheckbox(permission, checked, item)
        }
      })

      // 处理全选栏的逻辑
      if (!checked) {
        if (this.injectAllPermission.includes(permission)) {
          if (permission === READ_PERMISSION) {
            this.injectAllPermission.splice(0)
          } else {
            const index = this.injectAllPermission.indexOf(permission)
            if (index > -1) {
              this.injectAllPermission.splice(index, 1)
            }
            // 数据模型取消勾选编辑权限, 同时要去掉编辑锁定权限
            if (this.injectRoleTab === 2 && permission === EDIT_PERMISSION) {
              const lockIndex = this.injectAllPermission.indexOf(EDIT_LOCK_PERMISSION)
              if (lockIndex > -1) {
                this.injectAllPermission.splice(lockIndex, 1)
              }
            }
          }
        }
      } else {
        if (!this.injectAllPermission.includes(permission)) {
          this.injectAllPermission.push(permission)
          if (
            permission !== READ_PERMISSION &&
            !this.injectAllPermission.includes(READ_PERMISSION)
          ) {
            this.injectAllPermission.push(READ_PERMISSION)
          }
          // 数据模型模块 勾选了编辑锁定权限同时要勾选编辑权限
          if (permission === EDIT_LOCK_PERMISSION && !this.injectAllPermission.includes(EDIT_PERMISSION)) {
            this.injectAllPermission.push(EDIT_PERMISSION)
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.checkbox-all {
  margin-top: 10px;
  margin-left:40px;
  padding: 0 5px;
}
</style>
