<template>
  <div class="tab-excel">
    <a-form-model
      ref="fileForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item label="数据源名称" prop="name">
        <a-input style="width:536px;" v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item :label="fileType + '文件'" required>
        <a-upload
          name="file"
          :multiple="true"
          :headers="{ 'content-type': 'multipart/form-data' }"
          :showUploadList="false"
          :before-upload="beforeFileUpload"
          @change="handleFileChange"
        >
          <a-button style="border-color:rgba(97, 123, 255, 1);">
            添加文件
          </a-button>
        </a-upload>
        <div class="excel-list" v-if="excel">
          <a-list item-layout="horizontal" :data-source="fileList">
            <a-list-item
              slot="renderItem"
              slot-scope="item"
            >
              <div class="excel-list-item" :title="item.name">{{ item.name }}</div>
              <a-icon
                slot="actions"
                type="delete"
                @click="handleRemove(item)"
              ></a-icon>
            </a-list-item>
          </a-list>
        </div>
      </a-form-model-item>
      <!-- <a-form-model-item label="保存目录" prop="catalog">
        <a-select
          :default-value="form.catalog"
          v-model="form.catalog"
          style="width: 535px"
        >
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
      </a-form-model-item> -->
    </a-form-model>
    <a-row class="preview-list">
      <a-col :span="4">
        <div class="preview-tab">
          <div class="tab-title">预览表</div>
          <ul>
            <li
              class="preview-tab-item"
              :class="{ 'active': currentTabIndex === index }"
              v-for="(sheet, index) in sheetList"
              :key="sheet.name"
              @click="handleChangeTab(sheet, index)"
            >{{ sheet.name }}</li>
          </ul>
        </div>
      </a-col>
      <a-col :span="20">
        <div class="preview-controller">
          <span>从第</span>
          <div class="preview-line">
            <a-input style="width:60px" v-model="line" @keyup.enter.stop="handleEnterLine" />
            <div class="arrow-box" style="width:16px">
              <div class="arrow" @click="countLine('plus')">
                <i class="arrow-up"></i>
              </div>
              <div class="arrow" @click="countLine('minus')">
                <i class="arrow-down"></i>
              </div>
            </div>
          </div>
          <span>行开始获取数据</span>
          <a-checkbox style="margin-left: 50px" @change="handleCheckBox">自动生成列名</a-checkbox>
        </div>
        <a-table
          class="preview-table"
          bordered
          :columns="currentColumns"
          :data-source="currentFieldList"
          :loading="spinning"
          :pagination="false"
          :scroll="{ x: 780, y: 377 }"
        >
          <template #no="text, record, index">{{ index + 1 }}</template>
        </a-table>
      </a-col>
    </a-row>
    <a-button
      type="primary"
      class="btn_sub"
      @click="handleSaveForm"
      :loading="loading"
    >
      保存
    </a-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const sheetList = [
  { name: 'tab1' },
  { name: 'tab2' },
  { name: 'tab3' }
]

const columns = [
  {
    title: '序号',
    dataIndex: 'no',
    scopedSlots: {
      customRender: 'no'
    }
  },
  {
    title: '币种',
    dataIndex: 'type'
  },
  {
    title: '值',
    dataIndex: 'value'
  }
]

const data = []
for (let i = 0; i < 50; i++) {
  data.push({
    no: i,
    type: 'xx币',
    value: i * 100
  })
}

export default {
  data() {
    return {
      loading: false,
      spinning: false,
      form: {
        name: '',
        catalog: '数据接入目录'
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入数据源名称'
          },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '长度为1~20'
          }
        ],
        catalog: [
          {
            required: true,
            trigger: 'change'
          }
        ]
      },
      labelCol: {
        span: 4
      },
      fileList: [], // 文件列表
      sheetList, // 当前文件的sheet列表
      currentTabIndex: 0, // 当前选中sheet
      isSetTableHead: false, // 是否自动生成列名
      line: 1, // 当前显示的首行
      requestLine: 1, // 记录上次设置的首行
      columns: [], // 表头数据
      noTitleColumns: [], // 自动生成表头时的表头
      currentColumns: [], // 当前显示的表头
      fieldList: [], // 列表数据
      noTitleFieldList: [], // 自动生成表头时的列表
      currentFieldList: [] // 当前显示的列表
    }
  },
  computed: {
    ...mapState({
      excel: state => state.dataAccess.modelType === 'excel',
      fileType: state =>
        state.dataAccess.modelType === 'excel' ? 'Excel' : 'Csv'
    })
  },
  created () {
    this.handleGetData()
  },
  methods: {
    handleGetData() {
      this.spinning = true
      setTimeout(() => {
        this.spinning = false

        // 写入表头信息
        this.columns = columns
        this.currentColumns = this.columns
        this.noTitleColumns = this.columns.map((item, index) => {
          if (index === 0) {
            return item
          } else {
            return {
              title: 'F' + (index - 1),
              dataIndex: item.dataIndex
            }
          }
        })

        // 写入表信息
        this.fieldList = data
        const head = {}
        this.columns.map(item => {
          head[item.dataIndex] = item.title
        })
        this.noTitleFieldList = [].concat(this.fieldList)
        this.noTitleFieldList.unshift(head)
        this.currentFieldList = data
      }, 400)
    },
    handleChangeTab(sheet, index) {
      this.currentTabIndex = index
      this.handleGetData()
    },
    /**
     * 是否自动生成表头
     */
    handleCheckBox(e) {
      const checked = e.target.checked
      if (this.isSetTableHead === checked) return
      this.isSetTableHead = checked
      if (checked) {
        this.currentColumns = this.noTitleColumns
        this.currentFieldList = this.noTitleFieldList
      } else {
        this.currentColumns = this.columns
        this.currentFieldList = this.fieldList
      }
    },
    beforeFileUpload() {
      return false
    },
    // 删除文件
    handleRemove(file) {
      this.$confirm({
        title: '确认提示',
        content: '您确定要删除该文件吗',
        onOk: () => {
          const index = this.fileList.indexOf(file)
          this.fileList.splice(index, 1)
        }
      })
    },
    // 上传文件
    handleFileChange(e) {
      console.log(e)
      // 校验大小
      // if (e.file.size > 10 * 1024 * 1024) return this.$message.warning('文件过大, 无法上传')

      const name = e.file.name
      // 校验重名
      // if (this.fileList.some(file => file.name === name)) {
      //   return this.$message.warning('文件命名重复, 请重新添加')
      // }

      // 校验excel文件类型
      const fileType = name.slice(name.lastIndexOf('.') + 1, name.length)
      if (/xls|xlsx/.test(fileType)) {
        this.fileList.push(e.file)
      } else {
        this.$message.warning(name + '不是excel文件')
      }
    },
    // 箭头设置首行数
    countLine(type) {
      if (type === 'plus') {
        if (++this.line > 1000) {
          this.line = 1000
        } else {
          this.requestLine = this.line
          this.handleChangeFieldList()
        }
      } else if (type === 'minus') {
        if (--this.line < 1) {
          this.line = 1
        } else {
          this.requestLine = this.line
          this.handleChangeFieldList()
        }
      }
    },
    // 回车设置首行
    handleEnterLine(e) {
      const value = e.target.value
      if (!isNaN(value) && value >= 1 && value <= 1000) {
        this.line = value
        this.requestLine = value
      } else {
        this.line = this.requestLine
      }
    },
    handleChangeFieldList() {
      const currentFieldList = this.isSetTableHead ? this.noTitleFieldList : this.fieldList
      this.currentFieldList = currentFieldList.slice(this.requestLine - 1)
    },
    async handleSaveForm() {
      try {
        await this.$refs.fileForm.validate()
      } catch (error) {
        console.log(error)
        return
      }
      const formData = new FormData()
      this.fileList.map((file, index) => {
        formData.append('file[' + index + ']', file)
      })
      // 保存后清空列表
      this.fileList = []
    }
  }
}
</script>
