<template>
  <a-modal
    :visible="isShow"
    title="查看宽表"
    width="854px"
    okText="导出宽表"
    @ok="handleExport"
    @cancel="handleClose"
  >
    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 1000, y: 300 }"
      rowKey="id"
    >
      <a slot="action">action</a>
    </a-table>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: '序号',
    width: 20,
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: '产品ID',
    width: 25,
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    key: 'name',
    width: 40
  },
  {
    title: '发货日期',
    dataIndex: 'date',
    key: 'date',
    width: 40
  },
  {
    title: '国家',
    dataIndex: 'country',
    key: 'country',
    width: 20
  },
  {
    title: '地区',
    dataIndex: 'address',
    key: 'address',
    width: 20
  }
]

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    number: i + 1,
    id: '技术0203030' + i,
    name: 'Hewlett 工业技术,书包...',
    date: '2018-10-23  12:12:22',
    country: '中国',
    address: '广东'
  })
}
export default {
  props: {
    isShow: Boolean
  },
  data() {
    return {
      columns,
      data
    }
  },
  methods: {
    handleExport() {
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
