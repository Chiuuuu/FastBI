<template>
  <div>
    <div class="search_bar">
      <a-input placeholder="请输入关键词" class="search_input">
        <a-icon slot="prefix" type="search" />
      </a-input>
      <a-select default-value="全部" class="search_select">
        <a-select-option value="aaa">
          aaa
        </a-select-option>
      </a-select>
      <a-button type="primary" class="select_button">全部抽取</a-button>
    </div>
    <div class="table">
      <a-table :columns="columns" :data-source="data">
        <span slot="field">
          <a-switch default-checked />
        </span>
        <span slot="extract">
          <a-switch default-checked />
        </span>
        <span slot="config">
          <a v-on:click="setting">设置</a>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: '表名',
    dataIndex: 'file_name',
    key: 'file_name'
  },
  {
    title: '是否设置字段',
    dataIndex: 'field',
    key: 'field',
    slots: { title: 'field' },
    scopedSlots: { customRender: 'field' }
  },
  {
    title: '是否抽取',
    dataIndex: 'extract',
    key: 'extract',
    slots: { title: 'extract' },
    scopedSlots: { customRender: 'extract' }
  },
  {
    title: '修改时间',
    key: 'time',
    dataIndex: 'time'
  },
  {
    title: '字段配置',
    key: 'config',
    scopedSlots: { customRender: 'config' }
  }
]

const data = [
  {
    key: '1',
    file_name: 'fine_authority',
    time: '2020-10-12  12:23:00'
  }
]
export default {
  name: 'tabContentStructure',
  data() {
    return {
      columns,
      data
    }
  },
  methods: {
    handleGetData() {
        console.log('获取数据')
    },
    setting() {
    //   this.$router.push("/dataSource/dataAccess-setting");
      this.$emit('on-change-componet', 'Setting')
    }
  }
}
</script>
