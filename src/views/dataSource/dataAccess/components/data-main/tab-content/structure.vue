<template>
  <div>
    <a-spin tip="加载中..." :spinning="spinning">
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
      <a-table :columns="columns" :data-source="data"  rowKey='id'>
        <span slot="setBy" slot-scope="setBy">
          {{ handleChangeType(setBy) ? '是' : '否' }}
        </span>
        <span slot="extactBy" slot-scope="extactBy">
          {{ handleChangeType(extactBy) ? '是' : '否' }}
        </span>
        <span slot="config">
          <a v-on:click="setting">设置</a>
        </span>
      </a-table>
    </div>
    </a-spin>
  </div>
</template>
<script>
import { fetchDatabaseInfo } from '../../../../../../api/dataAccess/api'
import { mapState } from 'vuex'
const columns = [
  {
    title: '表名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '是否设置过字段',
    dataIndex: 'setBy',
    key: 'setBy',
    slots: { title: 'setBy' },
    scopedSlots: { customRender: 'setBy' }
  },
  {
    title: '是否抽取',
    dataIndex: 'extactBy',
    key: 'extactBy',
    slots: { title: 'extactBy' },
    scopedSlots: { customRender: 'extactBy' }
  },
  {
    title: '修改时间',
    key: 'updateTime',
    dataIndex: 'updateTime'
  },
  {
    title: '字段配置',
    key: 'config',
    scopedSlots: { customRender: 'config' }
  }
]

export default {
  name: 'tabContentStructure',
  data() {
    return {
      columns,
      data: [],
      spinning: true
    }
  },
  computed: {
    ...mapState({
      databaseid: state => state.dataAccess.databaseid
    })
  },
  methods: {
    handleChangeType(stringBoolean) {
      return stringBoolean === 1
    },
    async handleGetData(databaseid) {
      this.spinning = true
      const dabaseInfoResult = await fetchDatabaseInfo({
        url: '/admin/dev-api/system/sourceTbale/list/bydatabaseid',
        data: {
          databaseId: this.databaseid
        }
      }).finally(() => {
        this.spinning = false
      })

      if (dabaseInfoResult.data.code === 200) {
        this.data = [].concat(dabaseInfoResult.data.rows)
      } else {
        this.$message.error(dabaseInfoResult.data.msg)
      }
      console.log('获取数据', dabaseInfoResult.data)
    },
    setting() {
    //   this.$router.push("/dataSource/dataAccess-setting");
      this.$emit('on-change-componet', 'Setting')
    }
  }
}
</script>
