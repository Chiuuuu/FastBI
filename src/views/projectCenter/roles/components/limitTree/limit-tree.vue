<template>
  <a-tree
    :tree-data="treeData"
    :selectable="false"
  >
    <template slot="custom" slot-scope="item" style="color: #f00;width: 100%">
      <a-row>
        <a-col span="14">{{item.title}}</a-col>
        <a-checkbox-group :value="item.permissions">
          <a-row>
            <a-col span="5" v-for="subitem in [
              { value: 'Apple', name: 'Apple' },
              { value: 'Pear', name: 'Pear' }
              ]" :key="subitem.value">
                  <a-checkbox :value="subitem.value" @change="(e) => onChange(subitem, e, item)"></a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-row>
    </template>
  </a-tree>
</template>

<script>
const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    scopedSlots: { title: 'custom' },
    permissions: ['Apple'],
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        scopedSlots: { title: 'custom' },
        permissions: []
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        scopedSlots: { title: 'custom' },
        permissions: []
      }
    ]
  }
]
export default {
  name: 'limitTree',
  data() {
    return {
      treeData
    }
  },
  methods: {
    onChange(data, e, item) {
      if (e.target.checked) {
        if (item.permissions.length === 0 || !item.permissions.includes(data.value)) {
          item.permissions.push(data.value)
        }
      } else {
        const index = item.permissions.indexOf(data.value)
        item.permissions.splice(index, 1)
      }
    }
  }
}
</script>

<style>

</style>