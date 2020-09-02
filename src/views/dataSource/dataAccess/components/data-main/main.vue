<template>
  <div class="main">
    <div class="right">
      <div class="header">
        <span class="data_con">{{
          modelType ? (formInfo.name ? formInfo.name : '未命名连接') : "请连接数据"
        }}</span>
        <span class="data_category" v-if="modelType"
          >（类型：{{ modelType }}）</span
        >
      </div>
      <div class="tab">
        <a-tabs default-active-key="1" v-model="defaultTab" :wrapper-col="wrapperCol" @change="handleChangeTab">
          <a-tab-pane key="1" tab="连接信息">
            <tab-content-entry
              ref="entry"
              @on-set-table-name="handleSetTableName"
              ></tab-content-entry>
          </a-tab-pane>
          <a-tab-pane key="2" tab="库表结构" force-render :disabled="!tabChangeAble">
            <tab-content-structure v-on="$listeners" ref="structure" @hook:mounted="handleTT"></tab-content-structure>
          </a-tab-pane>
          <a-tab-pane key="3" tab="操作记录" :disabled="!tabChangeAble">
            <tab-content-record ref='record'></tab-content-record>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TabContentEntry from './tab-content/entry'
import TabContentStructure from './tab-content/structure'
import TabContentRecord from './tab-content/record'
import { fetchReadeTable } from '../../../../../api/dataAccess/api'
export default {
  name: 'dataAccessMain',
  components: {
    TabContentEntry,
    TabContentStructure,
    TabContentRecord
  },
  props: ['tabindex'],
  data() {
    return {
      excel: false,
      visible: false,
      wrapperCol: { span: 14 },
      defaultTab: this.tabindex,
      formName: ''
    }
  },
  computed: {
    ...mapState({
      formInfo: state => state.dataAccess.modelInfo,
      modelType: state => state.dataAccess.modelType, // 数据类型
      isFileType(state) { // 数据类型是否是文件格式
        return ['execl', 'csv'].some(function(item) {
          return item === state.dataAccess.modelType
        })
      },
      tabChangeAble: state => state.dataAccess.firstFinished // 是否完成第一部分
    })
  },
  created() {
    this.$EventBus.$on('set-tab-index', this.handleSetTab)
  },
  beforeDestroy() {
    this.$EventBus.$off('set-tab-index', this.handleSetTab)
  },
  methods: {
    /**
     * 设置表名称
    */
    handleSetTableName(name) {
      this.$set(this.formInfo, 'name', name)
      this.$store.dispatch('dataAccess/setModelInfo', Object.assign(this.formInfo, {
        name
      }))
    },
    handleSetTab(key) {
      this.defaultTab = key
    },
    handleTT() {
      if (this.defaultTab === '2') {
        console.log('去刷新')
        this.$refs.structure.handleGetData()
      }
    },
    /**
     * 选项卡
    */
    handleChangeTab(activeKey) {
      console.log('tab', activeKey)
      // this.$emit('on-change-componet')
      if (activeKey === '2') {
        console.log('数据结构请求')
        this.$nextTick(() => {
          this.$refs.structure.handleGetData()
        })
      } else if (activeKey === '3') {
        console.log('操作记录请求')
      }
    },
    /**
     * 展示弹出
    */
    showModal() {
      this.visible = true
    }
  }
}
</script>

<style lang="styl" scope>
@import "./main.styl";
</style>
