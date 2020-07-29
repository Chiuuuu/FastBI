<template>
  <div class="data-access-setting">
    <Menu></Menu>
    <div class="set-main">
      <div class="header">
        <span class="data_con">fine_authority</span>
        <a-button class="data_btn" v-on:click="back">返回</a-button>
      </div>
      <div class="setting">
        <div class="search_bar">
          <a-input placeholder="请输入关键词" class="search_input">
            <a-icon slot="prefix" type="search" />
          </a-input>
        </div>
        <div class="table">
          <a-table
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="data"
            bordered
          >
            <template v-for="col in ['other_name', 'description']" :slot="col">
              <div :key="col">
                <a-input style="width:206px;height:32px" />
              </div>
            </template>
            <template v-for="cols in ['type']" :slot="cols">
              <div :key="cols">
                <a-select default-value="数字" style="width:150px;">
                  <a-select-option value="int">
                    整数
                  </a-select-option>
                  <a-select-option value="date">
                    日期时间
                  </a-select-option>
                  <a-select-option value="string">
                    字符串
                  </a-select-option>
                  <a-select-option value="double">
                    小数
                  </a-select-option>
                </a-select>
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <div class="set_btn">
        <a-button style="width:88px;height:30px;">
          取消
        </a-button>
        <a-button type="primary" style="width:88px;height:30px;">
          保存
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../dataAccess/components/data-main/data-menu/menu'
const columns = [
  {
    title: '原名',
    dataIndex: 'last_name'
  },
  {
    title: '别名',
    dataIndex: 'other_name',
    scopedSlots: { customRender: 'other_name' }
  },
  {
    title: '字段类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '字段说明',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  }
]

const data = [
  {
    key: '1',
    last_name: 'authorityEntityType'
  }
]

export default {
  components: {
    Menu
  },
  data() {
    return {
      data,
      columns,
      current: ['mail'],
      openKeys: ['sub1'],
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  computed: {
    rowSelection() {
      return {}
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.visible = false
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="styl" scope>
@import "./dataAccess-setting.styl";
</style>
