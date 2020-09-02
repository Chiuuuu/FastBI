<template>
  <div style="position: relative;min-height:500px;">
    <a-empty v-if="!modelType" class="tab-empty">
      <span slot="description">请在左侧新建或选择数据连接</span>
    </a-empty>
    <template v-else>
      <div v-if="isFileType">
        <div class="tab-excel">
          <a-form-model
            ref="fileForm"
            :model="form"
            :rules="rule"
            :label-col="labelCol"
          >
            <a-form-model-item label="数据源名称" prop="Data">
              <a-input style="width:528px;" />
            </a-form-model-item>
            <a-form-model-item label="Execl文件" prop="File">
              <a-button
                style="border-color:rgba(97, 123, 255, 1);"
                @click="select"
              >
                选择文件
              </a-button>
              <div class="excel-list" v-if="excel">
                <a-list item-layout="horizontal" :data-source="d">
                  <a-list-item slot="renderItem" style="margin-left:10px">
                    <a-list-item-meta description="XXX.xlsx">
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </div>
            </a-form-model-item>
            <a-form-model-item label="保存目录" prop="Catalog">
              <a-select default-value="数据连接目录" style="width: 535px">
                <a-select-option value="电视统计">
                  电视统计
                </a-select-option>
                <a-select-option value="用户统计">
                  用户统计
                </a-select-option>
                <a-select-option value="流失统计">
                  流失统计
                </a-select-option>
                <a-select-option value="收入统计">
                  收入统计
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <div v-else>
        <component :is="modelType" @on-set-table-name="handleSetName"></component>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MySql from './mysql'
import Oracle from './oracle'
export default {
  name: 'tabContentEntry',
  components: {
    mysql: MySql,
    oracle: Oracle
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
        return ['execl', 'csv'].some(function(item) {
          return item === state.dataAccess.modelType
        })
      }// 是否完成第一部分
    })
  },
  methods: {
    handleSetName(name) {
      this.$emit('on-set-table-name', name)
    }
  }
}
</script>
