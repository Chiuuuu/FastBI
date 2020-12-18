<template>
  <a-tree
    class="limitTree"
    :tree-data="injectTreeData"
    :replace-fields="replaceFields"
    :selectable="false"
    :blockNode="true"
  >
    <template slot="custom" slot-scope="item" style="color: #f00;width: 100%">
      <a-row>
        <a-col span="14">{{item.title}}</a-col>
        <a-col :span="injectActionList.length * 2" v-if="item.fileType === 1">
          <a-checkbox-group :value="item.permissions" style="width:100%">
            <a-row>
              <a-col span="5" v-for="(subitem,subindex) in injectActionList" :key="subitem.permission" :style="{
                width: `${100 / injectActionList.length}%`
              }">
                <a-checkbox
                  :class="`custom-checkbox-${subindex+1}`"
                  :value="subitem.permission"
                  @change="(e) => onChange(subitem, e, item)"
                  :disabled="isDisabled"></a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </template>
  </a-tree>
</template>

<script>
export default {
  name: 'limitTree',
  inject: ['status', 'getProvideActionList', 'getProvideTreeData', 'getCurrentRoleTab'],
  data() {
    return {
      replaceFields: {
        key: 'id'
      }
    }
  },
  computed: {
    isDisabled() {
      return this.status === 'show'
    },
    injectActionList() {
      return this.getProvideActionList()
    },
    injectTreeData() {
      return this.getProvideTreeData()
    },
    injectRoleTab() {
      return this.getCurrentRoleTab()
    },
    currentRole() {
      switch (this.injectRoleTab) {
        case '1':
          return 'screen'
        case '2':
          return 'dataModel'
        case '3':
          return 'dataSource'
        default:
          return ''
      }
    }
  },
  methods: {
    onChange(data, e, item) {
      const { permission } = data
      const checked = e.target.checked
      if (permission === 'read' && !checked) {
        // 取消查看则清空
        item.permissions.splice(0)
      }

      if (checked) {
        if (item.permissions.length === 0 || (!item.permissions.includes('read') && !item.permissions.includes(permission))) {
          item.permissions.push('read')
          if (permission !== 'read') item.permissions.push(permission)
        } else if (item.permissions.includes('read') && !item.permissions.includes(permission)) {
          item.permissions.push(permission)
        }
      } else {
        const index = item.permissions.indexOf(permission)
        item.permissions.splice(index, 1)
      }
      this.$emit('getChangeItem', this.currentRole, item)
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~">>>";
.limitTree {
  @{deep} li ul {
    padding: 0;
  }
  @{deep} .custom-checkbox{
    &-1 {
      .ant-checkbox {
        margin-left: 12%;
      }
    }
    &-2 {
      .ant-checkbox {
        margin-left: 42%;
      }
    }
    &-3 {
      .ant-checkbox {
        margin-left: 62%;
      }
    }
    &-4 {
      .ant-checkbox {
        margin-left: 65%;
      }
    }
    &-5 {
      .ant-checkbox {
        margin-left: 90%;
      }
    }
  }
}
</style>
