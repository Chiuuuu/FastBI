<template>
  <a-tree
    class="limitTree"
    :tree-data="treeData"
    :selectable="false"
    :blockNode="true"
  >
    <template slot="custom" slot-scope="item" style="color: #f00;width: 100%">
      <a-row>
        <a-col span="14">{{item.title}}</a-col>
        <a-col span="10" v-if="item.fileType === 1">
          <a-checkbox-group :value="item.permissions" style="width:100%">
            <a-row>
              <a-col span="5" v-for="(subitem,subindex) in checkboxList" :key="subitem.key" :style="{
                width: `${100 / checkboxList.length}%`
              }">
                <a-checkbox
                  :class="`custom-checkbox-${subindex+1}`"
                  :value="subitem.key"
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
const checkboxList = [
  {
    key: 'read'
  },
  {
    key: 'edit'
  },
  {
    key: 'copy'
  },
  {
    key: 'delete'
  },
  {
    key: 'push'
  }
]
const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    scopedSlots: { title: 'custom' },
    permissions: ['Apple'],
    fileType: 0,
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        fileType: 1,
        scopedSlots: { title: 'custom' },
        permissions: []
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        fileType: 1,
        scopedSlots: { title: 'custom' },
        permissions: []
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        fileType: 1,
        scopedSlots: { title: 'custom' },
        permissions: []
      },
      {
        title: 'parent 1-3',
        key: '0-0-3',
        fileType: 1,
        scopedSlots: { title: 'custom' },
        permissions: []
      },
      {
        title: 'parent 1-4',
        key: '0-0-4',
        fileType: 1,
        scopedSlots: { title: 'custom' },
        permissions: []
      },
            {
        title: 'parent 1-5',
        key: '0-0-5',
        fileType: 1,
        scopedSlots: { title: 'custom' },
        permissions: []
      },
            {
        title: 'parent 1-6',
        key: '0-0-6',
        fileType: 1,
        scopedSlots: { title: 'custom' },
        permissions: []
      },
            {
        title: 'parent 1-7',
        key: '0-0-7',
        fileType: 1,
        scopedSlots: { title: 'custom' },
        permissions: []
      }
    ]
  },
  {
    title: 'parent 2',
    key: '0-1',
    scopedSlots: { title: 'custom' },
    fileType: 1,
    permissions: ['read','copy']
  }
]
export default {
  name: 'limitTree',
  data() {
    return {
      treeData,
      checkboxList
    }
  },
  props: {
    status: {
      type: String,
      default: 'show'
    }
  },
  computed: {
    isDisabled() {
      return this.status === 'show'
    }
  },
  methods: {
    onChange(data, e, item) {
      const { key } = data
      const checked = e.target.checked
      if (key === 'read' && !checked) {
        // 取消查看则清空
        item.permissions.splice(0)
      }

      if (checked) {
        if (item.permissions.length === 0 || (!item.permissions.includes('read') && !item.permissions.includes(key))) {
          item.permissions.push('read')
          item.permissions.push(key)
        } else if (item.permissions.includes('read') && !item.permissions.includes(key)){
          item.permissions.push(key)
        }
      } else {
        const index = item.permissions.indexOf(key)
        item.permissions.splice(index, 1)
      }
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
