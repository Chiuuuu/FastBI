<template>
  <div class="table-area scrollbar">
    <div class="area-searchbar">
      <a-form-model :model="form" layout="inline">
        <a-form-model-item label="标准地址编号" prop="addressCode">
          <a-input :maxLength="20" placeholder="请输入标准地址编号" v-model="form.addressCode" />
        </a-form-model-item>
        <a-form-model-item label="标准地址名称" prop="address">
          <a-input :maxLength="100" placeholder="请输入标准地址名称" v-model="form.address" />
        </a-form-model-item>
        <a-form-model-item label="楼盘编号" prop="householdNumber">
          <a-input :maxLength="20" placeholder="请输入楼盘编号" v-model="form.householdNumber" />
        </a-form-model-item>
        <a-form-model-item label="楼盘名称" prop="communityName">
          <a-input :maxLength="50" placeholder="请输入楼盘名称" v-model="form.communityName" />
        </a-form-model-item>
        <a-form-model-item label="楼盘信息提供方" prop="provider">
          <a-input :maxLength="50" placeholder="请输入楼盘信息提供方" v-model="form.provider" />
        </a-form-model-item>
        <a-form-model-item label="楼盘信息与标准地址关系是否有效" prop="match">
          <a-input :maxLength="20" placeholder="请输入有效信息" v-model="form.match" />
        </a-form-model-item>
        <a-form-model-item label="标准地址归属分公司" prop="headOffice">
          <a-input :maxLength="50" placeholder="请输入归属分公司" v-model="form.headOffice" />
        </a-form-model-item>
        <a-form-model-item label="片区" prop="section">
          <a-input :maxLength="50" placeholder="请输入片区" v-model="form.section" />
        </a-form-model-item>
        <a-form-model-item label="网格" prop="grid">
          <a-input :maxLength="50" placeholder="请输入网格" v-model="form.grid" />
        </a-form-model-item>
        <a-form-model-item label="运维片区" prop="serviceSection">
          <a-input :maxLength="50" placeholder="请输入运维片区" v-model="form.serviceSection" />
        </a-form-model-item>
        <a-form-model-item label="地市" prop="city">
          <a-input :maxLength="50" placeholder="请输入地市" v-model="form.city" />
        </a-form-model-item>
        <a-form-model-item label="区县" prop="district">
          <a-input :maxLength="10" placeholder="请输入区县" v-model="form.district" />
        </a-form-model-item>
        <a-form-model-item label="街道" prop="street">
          <a-input :maxLength="10" placeholder="请输入街道" v-model="form.street" />
        </a-form-model-item>
        <a-form-model-item label="详细地址" prop="detailAddress">
          <a-input :maxLength="100" placeholder="请输入详细地址" v-model="form.detailAddress" />
        </a-form-model-item>
        <a-form-model-item label="是否人工修改" prop="hasEdit">
          <a-select style="width: 120px" placeholder="是否修改" v-model="form.hasEdit" allowClear>
            <a-select-option :value="1">是</a-select-option>
            <a-select-option :value="0">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="最后一次修改时间" prop="gmtModified">
          <a-range-picker style="width:320px" valueFormat="YYYY-MM-DD HH:mm:ss" show-time :placeholder="['开始时间', '结束时间']" v-model="form.gmtModified" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
        </a-form-model-item>
        <a-form-model-item>
          <a-button @click="handleReset">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>

    <a-table
      class="area-table scrollbar"
      rowKey="id"
      :loading="loading"
      :data-source="dataList"
      :columns="dataColumns.concat(configColumns)"
      :pagination="false"
      :scroll="{ x: 3500, y: 'calc(100vh - 450px)' }"
    >
      <!-- 除了操作之外的数据展示列 -->
      <template
        v-for="(col, i) in dataColumns"
        :slot="'custom_' + i"
        slot-scope="text, record, index"
      >
        <a-input :maxLength="handleMaxLength(col.dataIndex)" v-model="editRow[col.dataIndex]" v-if="activeIndex === index" :key="i"></a-input>
        <span v-else :key="i" :title="text">{{ text }}</span>
      </template>

      <!-- 是否修改过 -->
      <template #hasEdit="text, record">{{ record.gmtModified ? '是' : '否' }}</template>

      <!-- 操作列 -->
      <template #config="text, record, index">
        <div v-if="activeIndex === index">
          <a @click="handleSaveRow">保存</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleCancelEdit">取消</a>
        </div>
        <a v-else @click="handleEditRow(record, index)">修改</a>
      </template>
    </a-table>

    <a-pagination
      class="area-pagination"
      showQuickJumper
      showSizeChanger
      :current="pagination.current"
      :pageSize="pagination.pageSize"
      :total="pagination.total"
      :show-total="total => `共${total}条记录`"
      @change="handlePageChange"
      @showSizeChange="handleSizeChange"
    ></a-pagination>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination'
import { trimFormData } from '@/utils/form-utils'
export default {
  name: 'areaRows',
  mixins: [paginationMixin],
  data() {
    return {
      loading: false,
      activeIndex: -1,
      form: {
        addressCode: '',
        address: '',
        householdNumber: '',
        communityName: '',
        match: '',
        serviceSection: '',
        headOffice: '',
        section: '',
        grid: '',
        provider: '',
        city: '',
        district: '',
        street: '',
        detailAddress: '',
        longitude: '',
        latitude: '',
        hasEdit: undefined,
        gmtModified: []
      },
      editRow: {},
      backupRow: {},
      dataList: [],
      dataColumns: [
        {
          title: '标准地址编号',
          dataIndex: 'addressCode',
          ellipsis: true,
          width: 120
          // scopedSlots: { customRender: 'custom_0' }
        },
        {
          title: '标准地址名称',
          dataIndex: 'address',
          ellipsis: true,
          width: 300,
          scopedSlots: { customRender: 'custom_1' }
        },
        {
          title: '楼盘编号',
          dataIndex: 'householdNumber',
          ellipsis: true,
          width: 120
          // scopedSlots: { customRender: 'custom_2' }
        },
        {
          title: '楼盘名称',
          dataIndex: 'communityName',
          ellipsis: true,
          width: 200,
          scopedSlots: { customRender: 'custom_3' }
        },
        {
          title: '楼盘信息提供方',
          dataIndex: 'provider',
          ellipsis: true,
          width: 200
          // scopedSlots: { customRender: 'custom_9' }
        },
        {
          title: '楼盘信息与标准地址关系是否有效',
          dataIndex: 'match',
          ellipsis: true,
          width: 250,
          scopedSlots: { customRender: 'custom_4' }
        },
        {
          title: '标准地址归属分公司',
          dataIndex: 'headOffice',
          ellipsis: true,
          width: 200
          // scopedSlots: { customRender: 'custom_6' }
        },
        {
          title: '片区',
          dataIndex: 'section',
          ellipsis: true,
          width: 100
          // scopedSlots: { customRender: 'custom_7' }
        },
        {
          title: '网格',
          dataIndex: 'grid',
          ellipsis: true,
          width: 300
          // scopedSlots: { customRender: 'custom_8' }
        },
        {
          title: '运维片区',
          dataIndex: 'serviceSection',
          ellipsis: true,
          width: 150
          // scopedSlots: { customRender: 'custom_5' }
        },
        {
          title: '地市',
          dataIndex: 'city',
          ellipsis: true,
          width: 150
          // scopedSlots: { customRender: 'custom_10' }
        },
        {
          title: '区县',
          dataIndex: 'district',
          ellipsis: true,
          width: 150,
          scopedSlots: { customRender: 'custom_11' }
        },
        {
          title: '街道',
          dataIndex: 'street',
          ellipsis: true,
          width: 200,
          scopedSlots: { customRender: 'custom_12' }
        },
        {
          title: '详细地址',
          dataIndex: 'detailAddress',
          ellipsis: true,
          width: 300,
          scopedSlots: { customRender: 'custom_13' }
        },
        {
          title: '经度',
          dataIndex: 'longitude',
          ellipsis: true,
          width: 150
          // scopedSlots: { customRender: 'custom_14' }
        },
        {
          title: '纬度',
          dataIndex: 'latitude',
          ellipsis: true,
          width: 150
          // scopedSlots: { customRender: 'custom_15' }
        }
      ],
      configColumns: [
        {
          title: '是否人工修改',
          dataIndex: 'hasEdit',
          ellipsis: true,
          width: 150,
          scopedSlots: { customRender: 'hasEdit' }
        },
        {
          title: '最后一次修改时间',
          dataIndex: 'gmtModified',
          ellipsis: true,
          width: 200
        },
        {
          title: '操作',
          dataIndex: 'config',
          ellipsis: true,
          width: 110,
          fixed: 'right',
          scopedSlots: { customRender: 'config' }
        }
      ]
    }
  },
  created() {
    this.handleGetData()
  },
  methods: {
    async handleGetData() {
      if (this.activeIndex > -1) {
        return this.$message.error('请先保存当前编辑行')
      }
      this.loading = true
      const params = {
        ...trimFormData(this.form),
        startTime: this.form.gmtModified[0],
        endTime: this.form.gmtModified[1],
        current: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      delete params.gmtModified
      const result = await this.$server.mapArea
        .getFieldList(params)
        .finally(() => {
          this.loading = false
        })
      if (result.code === 200) {
        this.dataList = result.data.list
        this.pagination.total = result.data.total
      } else {
        this.$message.error(result.msg || '查询失败')
      }
    },
    handleSearch() {
      if (this.activeIndex > -1) {
        return this.$message.error('请先保存当前编辑行')
      }
      this.pagination = this.$options.data().pagination
      this.handleGetData()
    },
    handleReset() {
      if (this.activeIndex > -1) {
        return this.$message.error('请先保存当前编辑行')
      }
      this.form = this.$options.data().form
      this.handleGetData()
    },
    // 编辑时字段的最大长度
    handleMaxLength(key) {
      const enumField = {
        address: 100,
        communityName: 50,
        match: 20,
        district: 10,
        street: 10,
        detailAddress: 100
      }
      return enumField[key]
    },
    // 对比并拼接修改过的字段
    findChangeField() {
      const enumField = {
        address: '标准地址名称',
        communityName: '楼盘名称',
        match: '楼盘信息与标准地址关系是否有效',
        district: '区县',
        street: '街道',
        detailAddress: '详细地址'
      }
      const result = []
      for (const key in this.editRow) {
        if (this.editRow[key] !== this.backupRow[key]) {
          result.push(enumField[key])
        }
      }
      return result.toString()
    },
    // 保存当前编辑行
    async handleSaveRow() {
      if (this.disabledConfig) {
        return
      }
      this.disabledConfig = true
      const result = await this.$server.mapArea
        .updateFields({
          ...this.editRow,
          editInfo: this.findChangeField()
        })
        .finally(() => {
          this.disabledConfig = false
        })
      if (result.code === 200) {
        this.editRow = {}
        this.activeIndex = -1
        this.$message.success('编辑成功')
        this.handleGetData()
      } else {
        this.$message.error(result.msg || '保存失败')
      }
    },
    // 取消编辑行
    handleCancelEdit() {
      if (this.disabledConfig) {
        return
      }
      this.editRow = {}
      this.backupRow = {}
      this.activeIndex = -1
    },
    // 编辑当前行
    handleEditRow(record, index) {
      if (this.activeIndex > -1) {
        return this.$message.error('请先保存当前编辑行')
      }
      if (this.disabledConfig) {
        return
      }
      this.editRow = Object.assign({}, record)
      this.backupRow = Object.assign({}, record)
      this.activeIndex = index
    }
  }
}
</script>

<style lang="less" scoped>
@import '../main.less';
</style>
