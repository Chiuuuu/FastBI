<template>
  <a-modal
    :visible="visible"
    title="模型对比"
    @cancel="handleClose"
    :bodyStyle="{
      height: `300px`,
      overflowY: 'auto',
      padding: isResult ? '' : '10px 10px 24px 10px'
    }">
      <div class="menu-wrap" v-show="!isResult">
        <div
          class="group"
          :class="handleIsFolder(folder) ? 'is-folder' : ''"
          v-for="(folder, index) in list"
          :key="folder.id"
        >
          <template v-if="handleIsFolder(folder)">
            <menu-folder
              :folder="folder"
              :index="index"
            >
              <template v-slot:file="slotProps">
                <menu-file
                  icon="dataModel"
                  checkbox
                  :checked="handleGetChecked(slotProps.file)"
                  :file="slotProps.file"
                  :index="slotProps.index"
                  :parent="folder"
                  @fileCheckbox="handleCheckbox"
                ></menu-file>
              </template>
            </menu-folder>
          </template>
          <template v-else>
            <ul class="items">
              <menu-file
                icon="dataModel"
                checkbox
                :checked="handleGetChecked(folder)"
                :file="folder"
                :index="index"
                @fileCheckbox="handleCheckbox"
              ></menu-file>
            </ul>
          </template>
        </div>
      </div>
      <div class="compare-result" v-show="isResult">
        <a-row>
          <a-col :span="11">
            <div class="compare-wrap">
              <div class="compare-name">
                <span>{{ left_model_info.left_model_name }}</span>
              </div>
              <div class="compare-time">
                <span>运行时间：</span>
                <span>{{ left_model_info.left_excute_time }}</span>
              </div>
            </div>
          </a-col>
          <a-col :span="11" :offset="2">
            <div class="compare-wrap">
              <div class="compare-name">
                <span>{{ right_model_info.right_model_name }}</span>
              </div>
              <div class="compare-time">
                <span>运行时间：</span>
                <span>{{ right_model_info.right_excute_time }}</span>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <template #footer>
        <a-button v-show="!isResult" @click="handleClose">取消</a-button>
        <a-button type="primary" v-show="!isResult" @click="handleOk" :loading="loading">确定</a-button>
        <a-button type="primary" v-show="isResult" @click="handleBack">返回</a-button>
      </template>
    </a-modal>
</template>
<script>
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'
export default {
  name: 'modelCompare',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MenuFolder,
    MenuFile
  },
  data() {
    return {
      isResult: false,
      compareList: [],
      loading: false,
      left_model_info: {},
      right_model_info: {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.isResult = false
        this.compareList = this.$options.data().compareList
        this.left_model_info = this.$options.data().left_model_info
        this.right_model_info = this.$options.data().right_model_info
      }
    }
  },
  methods: {
    /**
     * 是否为文件夹
     */
    handleIsFolder(item) {
      return item.fileType === 0
    },
    async handleOk() {
      const count = this.compareList.length
      if (count < 2) {
        this.$message.error('请勾选2个选项')
      } else if (count > 2) {
        this.$message.error('只能勾选2个选项')
      } else {
        const params = {
          left_modelId: this.compareList[0].id,
          left_modelName: this.compareList[0].name,
          right_modelId: this.compareList[1].id,
          right_modelName: this.compareList[1].name
        }
        this.loading = true
        const result = await this.$server.dataModel.actionModelCompare(params).finally(() => {
          this.loading = false
        })
        if (result.code === 200) {
          this.isResult = true
          this.$nextTick(() => {
            this.left_model_info = result.data.left_model_info
            this.right_model_info = result.data.right_model_info
          })
        } else {
          this.$message.error(result.msg || '请求错误')
        }
      }
    },
    handleCheckbox(e, file) {
      const checked = e.target.checked
      if (checked) {
        this.compareList.push(file)
      } else {
        const index = this.compareList.findIndex(item => item.id === file.id)
        this.compareList.splice(index, 1)
      }
    },
    handleGetChecked(file) {
      return this.compareList.includes(file)
    },
    handleBack() {
      this.isResult = false
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.compare-wrap {
  padding: 10px;
  height: 252px;
  background-color: #ccc;
  text-align: center;
  .compare-name {
    font-size: 18px;
    color: black;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .compare-time {
    span:last-child {
      text-align: center;
    }
  }
}
</style>
