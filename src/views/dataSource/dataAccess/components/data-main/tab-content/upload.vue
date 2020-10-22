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
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item :label="fileType + '文件'" required>
        <a-upload
          name="file"
          :headers="{ 'content-type': 'multipart/form-data' }"
          :showUploadList="false"
          :before-upload="beforeFileUpload"
          @change="handleFileChange"
        >
          <a-button style="border-color:rgba(97, 123, 255, 1);">
            添加文件
          </a-button>
        </a-upload>
        <div
          class="excel-list"
          ref="files"
          @dragenter.stop="fileDragEnter"
        >
          <div
            class="mask"
            v-show="isDragenter"
            @dragleave.stop="fileDragLeave"
            @dragover.stop.prevent
            @drop.stop="fileDrop"
          ></div>
          <template v-if="fileList.length > 0">
            <div
              class="excel-list-item"
              :class="{ active: currentFileIndex === index }"
              v-for="(item, index) in fileList"
              :key="item.uid"
              :title="item.name"
              @click="handleGetDataBase(index)"
            >
              <div class="text">{{ item.name }}</div>
              <a-icon
                slot="actions"
                type="delete"
                @click.stop="handleRemove(item)"
              ></a-icon>
            </div>
          </template>
          <a-empty style="margin-top:35px" v-else>
            <span slot="description">点击添加或将文件拖拽至此上传</span>
          </a-empty>
        </div>
      </a-form-model-item>
    </a-form-model>
    <a-row class="preview-list">
      <a-col :span="4">
        <div class="preview-tab">
          <div class="tab-title">预览表</div>
          <ul>
            <li
              class="preview-tab-item"
              :class="{ 'active': currentSheetIndex === index }"
              v-for="(sheet, index) in sheetList"
              :key="index"
              @click="handleChangeTab(sheet, index)"
            >{{ sheet }}</li>
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
          size="small"
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

export default {
  data() {
    return {
      loading: false,
      spinning: false,
      isDragenter: false,
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
      databaseList: [], // 文件对应数据库列表
      sheetList: [], // 当前文件的sheet列表
      sheetTable: [], // sheet表格数据
      currentSheetIndex: 0, // 当前选中sheet
      currentFileIndex: 0, // 当前选中sheet
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
    // this.handleGetData()
  },
  methods: {
    handleChangeTab(sheet, index) {
      this.currentSheetIndex = index
      this.getCurrentTable(index)
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
      this.$nextTick(() => {
        this.handleChangeFieldList()
      })
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
          this.databaseList.splice(index, 1)
          this.handleGetDataBase(this.databaseList.length - 1)
        }
      })
    },
    fileDragEnter(e) {
      const classList = this.$refs.files.classList
      if (!classList.contains('drag')) {
        this.isDragenter = true
        classList.add('drag')
      }
    },
    fileDragLeave(e) {
      const classList = this.$refs.files.classList
      if (classList.contains('drag')) {
        this.isDragenter = false
        classList.remove('drag')
      }
    },
    fileDrop(e) {
      this.isDragenter = false
      this.$refs.files.classList.remove('drag')
      const fileList = [...e.dataTransfer.files]
      if (fileList.length > 1) {
        return this.$message.error('一次只能上传一个文件')
      }
      fileList.map(file => {
        this.fileValidate(file)
      })
      e.preventDefault()
    },
    // 上传文件
    handleFileChange(e) {
      this.fileValidate(e.file)
    },
    // 校验文件
    fileValidate(file) {
      console.log(file)
      // 校验大小
      // if (e.file.size > 10 * 1024 * 1024) return this.$message.warning('文件过大, 无法上传')

      const name = file.name
      // 校验重名
      // if (this.fileList.some(file => file.name === name)) {
      //   return this.$message.warning('文件命名重复, 请重新添加')
      // }

      // 校验excel文件类型
      const fileType = name.slice(name.lastIndexOf('.') + 1, name.length)
      if (/xls|xlsx/.test(fileType)) {
        if (!file.uid) file.uid = 'vc-upload-' + (+new Date())
        this.actionUploadFile(file)
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
        this.handleChangeFieldList()
      } else {
        this.line = this.requestLine
      }
    },
    // 处理表头
    handleChangeFieldList() {
      const currentFieldList = this.isSetTableHead ? this.noTitleFieldList : this.fieldList
      this.currentColumns = this.isSetTableHead ? this.noTitleColumns : this.columns
      this.currentFieldList = currentFieldList.slice(this.requestLine - 1)
    },
    // 获取当前文件对应的数据库信息
    handleGetDataBase(index) {
      if (index < 0) {
        this.clearAll()
      } else {
        this.currentFileIndex = index
        const database = this.databaseList[index]
        this.formatMapSheet(database)
      }
    },
    // 上传文件
    async actionUploadFile(file) {
      const formData = new FormData()
      formData.append('file', file)
      const result = await this.$server.dataAccess.actionUploadFile(formData)
      console.log('解析成功', result)
      if (result.code === 200) {
        this.$message.success('解析成功')
        this.fileList.push(file)
        const database = result.rows[0].mapSheet
        this.databaseList.push(database)
        this.handleGetDataBase(this.databaseList.length - 1)
      } else {
        this.$message.error(result.msg)
      }
    },
    getCurrentTable(index) {
      // 写入表头信息
      const table = this.sheetTable[index]
      const columns = new Array({
          title: '序号',
          dataIndex: 'no',
          scopedSlots: {
            customRender: 'no'
          }
        }).concat(table[0].map((col, index) => {
          return {
            title: col,
            dataIndex: index + ''
          }
        }))

      this.columns = columns
      this.currentColumns = columns
      this.noTitleColumns = columns.map((item, index) => {
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
      const tableData = table.slice(1).map((item, index) => {
        const data = { key: index }
        item.map((value, key) => {
          data[key + ''] = value
        })
        return data
      })
      this.fieldList = tableData
      const head = {}
      columns.map(item => {
        head[item.dataIndex] = item.title
      })
      this.noTitleFieldList = new Array(head).concat(tableData)
      this.currentFieldList = tableData

      this.$nextTick(() => {
        this.handleChangeFieldList()
      })
    },
    // 处理解析后的表格
    formatMapSheet(mapSheet) {
      const sheetList = []
      const sheetTable = []
      Object.entries(mapSheet).map(([key, value]) => {
        sheetList.push(key)
        sheetTable.push(value)
      })
      this.sheetList = sheetList
      this.currentSheetIndex = 0
      this.sheetTable = sheetTable
      this.getCurrentTable(0)
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
      this.$server.dataAccess.saveExcelInfo()
      // 保存后清空列表
      this.fileList = []
    },
    clearAll() {
      this.sheetList = []
      this.sheetTable = []
      this.currentColumns = []
      this.currentFieldList = []
    }
  }
}
</script>
