<template>
  <div class="scrollbar" style="position: relative;min-height:500px;">
    <a-empty v-if="!modelType" class="tab-empty">
      <span slot="description">请在左侧新建或选择数据接入</span>
    </a-empty>
    <template v-else>
      <upload v-if="isFileType" />
      <div v-else>
        <component :is="modelType" @on-set-table-name="handleSetName" @hook:mounted="handleMounted" ref="entryRef"></component>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MySql from './mysql'
import Oracle from './oracle'
import Upload from './upload'
export default {
  name: 'tabContentEntry',
  components: {
    mysql: MySql,
    oracle: Oracle,
    upload: Upload
  },
  data() {
    return {
      excel: false,
      rule: {
        Data: [
          {
            required: true,
            message: '请输入数据源名称'
          }
        ],
        File: [
          {
            required: true,
            message: '请选择文件'
          }
        ],
        Catalog: [
          {
            required: true,
            message: '请选择保存目录'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      modelType: state => state.dataAccess.modelType, // 数据类型
      isFileType(state) {
        // 数据类型是否是文件格式
        return ['excel', 'csv'].some(function(item) {
          return item === state.dataAccess.modelType
        })
      }// 是否完成第一部分
    })
  },
  methods: {
    handleSetName(name) {
      this.$emit('on-set-table-name', name)
    },
    handleMounted() {
      this.$refs.entryRef.handleSetFormData()
    }
  }
}
</script>
