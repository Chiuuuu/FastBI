<template>
  <a-modal
    width="850px"
    title="筛选排序"
    :visible="isShow"
    :bodyStyle="bodyStyle"
    :footer="null"
    @cancel="handleClose"
  >
    <a-tabs default-active-key="1" @change="changeTab">
      <a-tab-pane key="1" tab="筛选">
        <FieldFilter
          ref="tab1"
          :dimensions="sourceDimensions"
          :measures="sourceMeasures"
          :table-list="filterList"
          @insert="item => filterList.push(item)"
          @delete="index => filterList.splice(index, 1)"
          @edit="(data, index) => filterList.splice(index, 1, data)"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="排序">
        <FieldSort
          ref="tab2"
          :dimensions="sourceDimensions"
          :measures="sourceMeasures"
          :table-list="sortList"
          @insert="item => sortList.push(item)"
          @delete="index => sortList.splice(index, 1)"
          @edit="handleEditSortList"
        />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex'
import { mixinModal } from './mixins'
import FieldFilter from './components/field-filter.vue'
import FieldSort from './components/field-sort.vue'
export default {
  name: 'fieldFilterSort',
  mixins: [mixinModal],
  components: {
    FieldFilter,
    FieldSort
  },
  mounted () {
    this.handleGetFilterSortList(1)
    this.handleGetFilterSortList(2)
  },
  data() {
    return {
      filterList: [],
      sortList: []
    }
  },
  computed: {
    ...mapState({
      modelId: state => state.dataModel.modelId, // 选中的菜单id
      addModelId: state => state.dataModel.addModelId // 新增的模型id()
    }),
    model() {
      return this.$route.query.type
    }
  },
  methods: {
    async handleGetFilterSortList(ruleType) {
      const res = await this.$server.dataModel.getFilterOrSortRules({
        datamodelId: this.model === 'add' ? this.addModelId : this.modelId,
        ruleType
      })
      if (res && res.code === 200) {
        if (ruleType === 1) {
          // 筛选
          this.filterList = res.data
        } else if (ruleType === 2) {
          // 排序
          this.sortList = res.data
        }
      } else {
        this.$message.error(res.msg || res.message || '获取筛选排序列表失败')
      }
    },
    changeTab(key) {
      const ref = this.$refs['tab' + key]
      ref && ref.handleTreeData()
    },
    handleClose() {
      // 关闭窗口时, 传递筛选排序的字段
      this.$emit('getFilterList', this.filterList)
      this.$emit('getSortList', this.sortList)
      this.$emit('close')
    },
    // 处理排序顺序
    handleEditSortList(index, type) {
      if (type === 'up') {
        this.sortList[index - 1].displayOrder++
        const record = this.sortList.splice(index, 1)[0]
        record.displayOrder--
        this.sortList.splice(index - 1, 0, record)
      } else if (type === 'down') {
        this.sortList[index + 1].displayOrder--
        const record = this.sortList.splice(index, 1)[0]
        record.displayOrder++
        this.sortList.splice(index + 1, 0, record)
      }
    }
  }
}
</script>

<style scoped></style>
