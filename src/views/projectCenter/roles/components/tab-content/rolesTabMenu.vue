<template>
  <div class="menuWrap" :class="status === 'show' ? 'show' : '' ">
    <div class="title">菜单权限{{status === 'show' ? '' : `(至少勾选一个菜单项)`}}</div>
    <div class="menu-content scrollbar">
      <a-spin :spinning="spinning">
        <a-tree
          class="limitTree"
          :tree-data="treeData"
          :selectable="false"
          :blockNode="true"
        >
          <template slot="custom" slot-scope="item" style="color: #f00;width: 100%">
            <a-row>
              <a-col span="4">
                <span>{{item.title}}</span>
              </a-col>
              <a-col span="2">
                <a-checkbox
                  class="custom-checkbox"
                  :checked="handleGetChecked(item)"
                  :disabled="isDisabled"
                  @change="(e) => handleChange(e, item)"
                ></a-checkbox>
              </a-col>
            </a-row>
          </template>
        </a-tree>
      </a-spin>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'rolesTabMenu',
  props: {
    status: {
        type: String,
        requried: true,
        default: 'show'
    }
  },
  computed: {
    ...mapState({
      roleId: state => state.projectRoles.roleId
    }),
    isDisabled() {
      return this.status === 'show'
    }
  },
  data() {
    return {
      spinning: false,
      checkedKeys: [],
      treeData: [
        {
          title: '数据管理',
          key: 'page-1',
          children: [
            {
              title: '数据接入',
              scopedSlots: { title: 'custom' },
              key: '01'
            },
            {
              title: '数据建模',
              scopedSlots: { title: 'custom' },
              key: '02'
            }
          ]
        },
        {
          title: '大屏管理',
          key: 'page-2',
          children: [
            {
              title: '数据大屏',
              scopedSlots: { title: 'custom' },
              key: '03'
            }
          ]
        },
        {
          title: '平台管理',
          key: 'page-3',
          children: [
            {
              title: '日志管理',
              scopedSlots: { title: 'custom' },
              key: '07'
            },
            {
              title: '系统监控',
              scopedSlots: { title: 'custom' },
              key: '06'
            }
          ]
        },
        {
          title: '标签管理',
          key: 'page-4',
          children: [
            {
              title: '标签列表',
              scopedSlots: { title: 'custom' },
              key: '08'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    if (this.$route.params.id) {
        this.handleGetData()
    }
    this.$EventBus.$on('roleFileSelect', this.handleGetData)
  },
  beforeDestroy() {
    this.$EventBus.$off('roleFileSelect', this.handleGetData)
  },
  methods: {
    async handleGetData() {
      this.spinning = true
      const result = await this.$server.projectCenter.getRoleMenuPermission(this.roleId || this.$route.params.id).finally(() => {
        this.spinning = false
      })

      if (result.code === 200) {
        this.checkedKeys = [].concat(result.data)
      } else {
        this.$message.error(result.msg || '请求错误')
      }
    },
    handleChange(event, item) {
      const checked = event.target.checked
      if (checked) {
        this.checkedKeys.push(item.key)
      } else {
        const index = this.checkedKeys.findIndex(key => key === item.key)
        this.checkedKeys.splice(index, 1)
      }
      this.$emit('getCheckedkeys', this.checkedKeys)
    },
    handleGetChecked(item) {
      return this.checkedKeys.includes(item.key)
    }
  }
}
</script>
