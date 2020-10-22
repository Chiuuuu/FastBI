<template>
  <div>
    <div class="search_bar">
      <a-input placeholder="请输入关键词" class="search_input" style="width:100%">
        <a-icon slot="prefix" type="search" />
      </a-input>
    </div>
    <div class="table">
      <a-table :columns="column" :data-source="datas">
        <span slot="type">
          <span>-</span>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
const column = [
  {
    title: '操作时间',
    dataIndex: 'work_time',
    key: 'work_time'
  },
  {
    title: '操作者',
    dataIndex: 'operator',
    key: 'operator'
  },
  {
    title: '账号',
    dataIndex: 'account',
    key: 'account'
  },
  {
    title: '操作类型',
    key: 'type',
    dataIndex: 'type'
  }
]

const datas = [
  {
    key: '1',
    work_time: '2020-07-12  12:00:00',
    operator: '钟大勇',
    account: 'vfg123456'
  }
]
export default {
  name: 'tabContentRecord',
  data() {
    return {
      column,
      datas
    }
  },
  mounted() {
    console.log('tab-mounted')
  }
}
</script>
