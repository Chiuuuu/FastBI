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
          :before-upload="beforeUpload"
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
              style="margin-left:10px"
            >
              {{ item.name }}
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
            <li class="preview-tab-item" :class="{ 'active': currentTab === index }" v-for="(item, index) in tabList" :key="item.name">{{ item.name }}</li>
          </ul>
        </div>
      </a-col>
      <a-col :span="20">
        <div class="preview-controller">
          <span>从第</span>
          <div class="preview-line">
            <a-input style="width:60px" v-model="lineCnt" />
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
          <a-checkbox style="margin-left: 50px">自动生成列名</a-checkbox>
        </div>
        <a-table
          class="preview-table"
          bordered
          :columns="columns"
          :data-source="data"
          :pagination="false"
          :scroll="{ x: 780, y: 377 }"
        ></a-table>
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

const tabList = [
  { name: 'tab1' },
  { name: 'tab2' },
  { name: 'tab3' }
]

const columns = [
  {
    title: '序号',
    dataIndex: 'no',
    key: 'no'
  },
  {
    title: '币种',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '值',
    dataIndex: 'value',
    key: 'value'
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
      form: {
        // 连接信息表单
        name: '',
        catalog: '数据连接目录'
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
      fileList: [],
      tabList,
      currentTab: 0,
      line: 1,
      columns,
      data
    }
  },
  computed: {
    ...mapState({
      excel: state => state.dataAccess.modelType === 'excel',
      fileType: state =>
        state.dataAccess.modelType === 'excel' ? 'Excel' : 'Csv'
    }),
    lineCnt: {
      get() {
        return this.line
      },
      set(v) {
        this.line = v
      }
    }
  },
  methods: {
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
    beforeUpload() {
      return false
    },
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
    },
    countLine(type) {
      if (type === 'plus' && ++this.lineCnt > 1000) {
        this.lineCnt = 1000
      } else if (type === 'minus' && --this.lineCnt < 0) {
        this.lineCnt = 0
      }
    }
  }
}
</script>
