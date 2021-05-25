<template>
  <a-row :gutter="16" class="screen-manage">
    <a-col class="gutter-row screen-manage" :span="24">
      <a-spin :spinning="loading">
        <a-form-model
          class="form-label"
          labelAlign="left"
          ref="form"
          layout="inline"
          :model="form"
          :rules="rules"
        >
          <div class="form-area">
            <!-- 头部 -->
            <header class>
              <span>{{ isNew ? '新建标签' : '编辑标签' }}</span>
              <div>
                <a-button
                  class="main-button"
                  type="primary"
                  :loading="loading"
                  @click="handleSave"
                  >保 存</a-button
                >
                <a-button
                  class="main-button"
                  @click="$router.push({ name: 'labelList' })"
                  >退 出</a-button
                >
              </div>
            </header>

            <!-- 基本信息模块 -->
            <div class="form-section section-1">
              <div class="title">基本信息</div>
              <a-form-model-item label="标签名称" prop="name">
                <a-input
                  style="width: 300px"
                  v-model="form.name"
                  placeholder="请输入标签名称"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item label="版本号" prop="userVersion">
                <a-input
                  v-model="form.userVersion"
                  placeholder="请输入版本号"
                ></a-input>
                <!-- <span>{{ form.version }}</span> -->
              </a-form-model-item>
              <a-form-model-item label="标签描述" prop="description">
                <a-input
                  style="width: 600px"
                  v-model="form.description"
                  placeholder="请输入标签描述"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item label="更新时间" prop="updateTime">
                <a-radio-group v-model="form.updateTime">
                  <a-radio :value="0">每天</a-radio>
                  <a-radio :value="1">每周</a-radio>
                  <a-radio :value="2">每月</a-radio>
                  <a-radio :value="3">不更新</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </div>

            <!-- 标签规则模块 高度自适应 -->
            <div class="form-section section-2 scrollbar">
              <div class="title">标签规则</div>
              <a-form-model-item
                class="block-model-item"
                label="达标模型"
                prop="modelId"
              >
                <div style="width: 500px">
                  <a-tree-select
                    v-model="form.modelId"
                    style="width: 100%"
                    show-search
                    treeNodeFilterProp="title"
                    :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                    placeholder="请选择模型"
                    allow-clear
                    tree-default-expand-all
                    @change="handleChangeModel"
                  >
                    <a-tree-select-node
                      v-for="model in modelList"
                      :key="model.id"
                      :value="model.id"
                      :title="model.name"
                      :selectable="model.fileType === 1"
                    >
                      <template
                        v-if="
                          model.children &&
                            model.children.length &&
                            model.children.length > 0
                        "
                      >
                        <a-tree-select-node
                          v-for="item in model.children"
                          :key="item.id"
                          :value="item.id"
                          :title="item.name"
                        ></a-tree-select-node>
                      </template>
                    </a-tree-select-node>
                  </a-tree-select>
                </div>
              </a-form-model-item>
              <a-form-model-item label="达标条件" prop="pivotType">
                <a-select
                  v-model="form.pivotType"
                  style="width: 134px"
                  placeholder="请选择维度度量"
                  @change="handleResetField"
                >
                  <a-select-option :value="1">维度</a-select-option>
                  <a-select-option :value="2">度量</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item prop="field">
                <a-select
                  v-model="form.field"
                  style="width: 350px"
                  placeholder="请选择字段"
                  @change="handleFieldSelect"
                >
                  <a-select-option
                    v-for="item in fieldList"
                    :key="item.id"
                    :value="item.alias"
                    >{{ item.alias }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                class="block-model-item"
                label="满足条件"
                prop="conditionType"
              >
                <!-- 选择维度时的条件筛选 -->
                <template v-if="form.pivotType === 1">
                  <a-radio-group v-model="form.conditionType">
                    <a-radio :value="0">包含</a-radio>
                    <a-radio :value="1">不包含</a-radio>
                  </a-radio-group>
                </template>

                <!-- 选择度量时的条件筛选 -->
                <template v-else-if="form.pivotType === 2">
                  <a-select
                    style="width: 134px;margin-right: 16px"
                    v-model="form.conditionType"
                  >
                    <a-select-option :value="2">范围</a-select-option>
                    <a-select-option :value="3">大于</a-select-option>
                    <a-select-option :value="4">小于</a-select-option>
                    <a-select-option :value="5">大于等于</a-select-option>
                    <a-select-option :value="6">小于等于</a-select-option>
                    <a-select-option :value="7">等于</a-select-option>
                    <a-select-option :value="8">不等于</a-select-option>
                  </a-select>
                </template>
              </a-form-model-item>
              <a-form-model-item
                class="block-model-item"
                label="达标范围"
                prop="conditionValue"
              >
                <template v-if="form.pivotType === 1">
                  <a-tree-select
                    v-model="form.conditionValue"
                    style="width: 500px"
                    :tree-data="fieldData"
                    :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                    placeholder="请输入搜索内容"
                    allow-clear
                    tree-checkable
                    tree-default-expand-all
                    show-search
                    @search="handleSearchFieldData"
                  />
                </template>
                <template v-if="form.pivotType === 2">
                  <!-- 选择范围时的输入框 -->
                  <template v-if="form.conditionType === 2">
                    <a-input
                      v-model="conditionValueMin"
                      style="width: 134px"
                      placeholder="请输入数值"
                    ></a-input>
                    <div class="cut-line">——</div>
                    <a-input
                      v-model="conditionValueMax"
                      style="width: 134px"
                      placeholder="请输入数值"
                    ></a-input>
                  </template>

                  <!-- 选择其他选项时的输入框 -->
                  <template v-else>
                    <a-input
                      v-model="form.conditionValue"
                      style="width: 134px"
                      placeholder="请输入数值"
                    ></a-input>
                  </template>
                </template>
              </a-form-model-item>
            </div>

            <div v-if="!isNew" class="form-section section-3">
              <div class="title">修改备注</div>
              <a-form-model-item
                class="form-not-required block-model-item"
                label="修改原因"
                prop="reason"
              >
                <a-input v-model="form.reason" placeholder="选填"></a-input>
              </a-form-model-item>
            </div>
          </div>
        </a-form-model>
      </a-spin>
    </a-col>
  </a-row>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  name: 'labelEdit',
  created() {
    this.handleGetModelList()
  },
  data() {
    return {
      loading: false,
      form: {
        name: '', // 标签名
        description: '', // 标签描述
        userVersion: 1, // 版本号
        version: 1, // 后台版本
        reason: '', // 修改原因
        updateTime: 0, // 更新周期
        modelId: undefined, // 模型id
        pivotType: 1, // 维度or度量
        field: undefined, // 字段名
        conditionType: 0, // 达标条件类型
        conditionValue: [] // 达标条件值
      },
      // 达标范围值
      conditionValueMin: '',
      conditionValueMax: '',
      rules: {
        name: [
          { required: true, message: '请输入标签名称' },
          { max: 10, message: '请输入小于10字的标签名称' }
        ],
        description: [
          { required: true, message: '请输入标签描述' },
          { max: 50, message: '请输入小于50字的标签描述' }
        ],
        userVersion: [
          { required: true, message: '请输入版本号' },
          { pattern: /^\d{1,8}$/, message: '请输入8位有效数字' }
        ],
        reason: [{ max: 50, message: '请输入小于50字的修改原因' }],
        updateTime: [{ required: true, message: '请选择更新时间' }],
        modelId: [{ required: true, message: '请选择达标模型' }],
        pivotType: [{ required: true, message: '请选择类型' }],
        field: [{ required: true, message: '请选择字段' }],
        conditionType: [{ required: true, message: '请选择满足条件' }],
        conditionValue: [
          { required: true, message: '请确认达标范围' },
          { validator: this.validateConditionValue, trigger: 'change' }
        ]
      },
      labelData: {}, // 标签详情
      modelList: [], // 模型列表
      dimensions: [], // 当前维度列表
      measures: [], // 当前度量列表
      fieldId: '', // 记录当前选中的维度id, 获取数据接口需要
      fieldSearchWord: '', // 搜索当前维度下的数据
      fieldData: [], // 搜索结果
      visible: false
    }
  },
  computed: {
    isNew() {
      // 是否新增
      return !this.$route.query.id
    },
    // 字段列表(维度 or 度量)
    fieldList() {
      return this.form.pivotType === 1 ? this.dimensions : this.measures
    }
  },
  watch: {
    // 初始化维度度量选项改变后的值
    'form.pivotType'(newValue) {
      if (newValue === 1) {
        if (this.form.conditionType >= 2) {
          this.form.conditionType = 0
        }
        this.form.conditionValue = []
      } else if (newValue === 2) {
        if (this.form.conditionType < 2) {
          this.form.conditionType = 2
        }
        this.form.conditionValue = ''
      }
    },
    conditionValueMin(newValue, oldValue) {
      if (this.form.conditionType === 2) {
        this.form.conditionValue =
          (newValue || '') + ',' + (this.conditionValueMax || '')
      }
    },
    conditionValueMax(newValue, oldValue) {
      if (this.form.conditionType === 2) {
        this.form.conditionValue =
          (this.conditionValueMin || '') + ',' + (newValue || '')
      }
    }
  },
  methods: {
    // 获取标签详情
    async handleGetData() {
      const res = await this.$server.label.getLabel(this.$route.query.id)
      if (res.code === 200) {
        this.labelData = res.data
        this.labelData.userVersion++ // 版本号默认自增1

        // 赋值
        for (const key in this.form) {
          this.form[key] = this.labelData[key]
        }

        // 先获取维度度量字段
        await this.handleGetPivotSchema()

        // 处理特殊字段
        if (this.labelData.pivotType === 1) {
          // 维度时, 将范围值处理成数组
          this.form.conditionValue = this.labelData.conditionValue.split(',')
        } else if (this.labelData.pivotType === 2) {
          if (this.form.conditionType === 2) {
            // 度量且为范围值时, 处理成2段
            const value = this.labelData.conditionValue.split(',')
            this.conditionValueMin = value[0]
            this.conditionValueMax = value[1]
          }
        }
        if (!this.modelList.find(item => {
          const id = this.labelData.modelId
          if (item.fileType === 1) {
            return item.id === id
          } else if (item.fileType === 0) {
            return item.children.find(child => child.id === id)
          }
        })) {
          this.form.modelId = undefined
          this.dimensions = []
          this.measures = []
          this.handleResetField()
        } else {
          // 遍历列表找到id, 调用获取数据的接口
          const target = this.fieldList.find(
            item => item.alias === this.form.field
          )
          this.fieldId = target ? target.id : ''
          this.handleGetFieldData()
        }
      } else {
        this.$message.error(res.msg || '获取详情失败')
      }
    },
    // 获取模型列表
    async handleGetModelList() {
      const res = await this.$server.common.getMenuList('/model/catalog/list/2')
      if (res.code === 200) {
        this.modelList = res.data
        if (!this.isNew) {
          this.$nextTick(() => {
            this.handleGetData()
          })
        }
      } else {
        this.$message.error(res.msg || '获取模型列表错误')
      }
    },
    // 获取模型下维度度量
    async handleGetPivotSchema() {
      const result = await this.$server.dataModel.getDataModelDetailInfo(
        this.form.modelId
      )
      if (result.code === 200) {
        // 过滤自定义维度度量
        this.dimensions = result.data.pivotSchema.dimensions.filter(
          item => item.produceType === 0
        )
        this.measures = result.data.pivotSchema.measures.filter(
          item => item.produceType === 0
        )
      } else {
        this.$message.error(result.msg || '获取维度度量失败')
        this.dimensions = []
        this.measures = []
      }
    },
    // 获取维度下的数据列表
    async handleGetFieldData() {
      // 只在维度时调用
      if (!this.form.modelId || this.form.pivotType === 2) return
      const res = await this.$server.label.getFieldData({
        modelId: this.form.modelId,
        dimisionId: this.fieldId,
        searchWord: this.fieldSearchWord
      })
      if (res.code === 200) {
        const children = []
        res.data.map((item, index) => {
          if (item) {
            const name = Object.values(item)[0]
            children.push({
              title: name,
              value: name,
              key: index + 1
            })
          }
        })
        this.fieldData = [
          {
            title: '全选',
            value: '',
            key: '0',
            children
          }
        ]
      } else {
        this.$message.error(res.msg || '获取数据失败')
        this.fieldData = []
      }
    },
    handleSearchFieldData: debounce(function(value) {
      this.fieldSearchWord = value
      this.handleGetFieldData()
    }, 400),
    // 达标值校验
    validateConditionValue(rule, value, callback) {
      if (this.form.conditionType === 2) {
        if (this.conditionValueMin >= this.conditionValueMax) {
          callback(new Error('范围两端数值须从小到大'))
          return
        }
      }
      if (value !== undefined && value[0] === '') {
        callback(new Error('请确认达标范围'))
        return
      }
      let invalid = false
      if (this.form.conditionType === 2) {
        value.split(',').map(item => {
          if (isNaN(item)) {
            invalid = true
          }
        })
      }
      invalid ? callback(new Error('请输入数值')) : callback()
    },
    // 选各种模型事件
    handleChangeModel() {
      this.handleResetField()
      this.handleGetPivotSchema()
    },
    // 重置字段数据
    handleResetField() {
      this.form = Object.assign({}, this.form, {
        field: undefined, // 字段名
        conditionValue: this.form.pivotType === 1 ? [] : '' // 达标条件值
      })
      this.fieldId = ''
      this.fieldSearchWord = ''
      this.fieldData = []
      this.conditionValueMin = ''
      this.conditionValueMax = ''
    },
    // 选择字段事件
    handleFieldSelect(value, option) {
      this.fieldId = option.data.key
      this.form.conditionValue = this.form.pivotType === 1 ? [] : ''
      this.handleGetFieldData()
    },
    // 重置表单
    handleResetForm() {
      this.form = this.$options.data().form
      this.reason = ''
      this.$refs.form && this.$refs.form.resetFields()
    },
    // 保存表单
    handleSave() {
      this.$refs.form.validate(async (ok, obj) => {
        if (ok) {
          this.loading = true
          const params = {
            ...this.form,
            conditionValue: this.form.conditionValue.join
              ? this.form.conditionValue.join(',')
              : this.form.conditionValue
          }

          let res = null
          if (!this.isNew) {
            params.id = this.$route.query.id
            res = await this.$server.label.putLabel(params).finally(() => {
              this.loading = false
            })
          } else {
            res = await this.$server.label.addLabel(params).finally(() => {
              this.loading = false
            })
          }

          if (res.code === 200) {
            this.$message.success(this.isNew ? '新建标签成功' : '修改标签成功')
            this.$router.push({ name: 'labelList' })
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./common');
@deep: ~'>>>';
.form-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  @{deep} .ant-form-item-with-help {
    margin-bottom: 0;
  }
  @{deep} .ant-form-item-children {
    display: block;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;
    padding: 0 16px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #e8e8e8;
  }

  .form-section {
    margin: 0 15px 15px;
    background: #f2f2f2;
    padding: 10px 15px;

    &.section-1,
    &.section-3 {
      height: auto;
    }
    &.section-2 {
      flex: 1;
      overflow-y: auto;
    }
    .block-model-item {
      display: block;
    }

    .title {
      font-size: 16px;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
    }
  }
  .cut-line {
    display: inline-block;
    width: 16px;
    text-align: center;
  }
}
</style>
