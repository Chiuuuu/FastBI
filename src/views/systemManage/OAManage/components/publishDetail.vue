<template>
  <!-- 查看模式 -->
  <a-modal v-if="type === 'check'" :visible="visible" title="查看分享" :footer="null" @cancel="handleClose">
    <a-form-model :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
      <a-form-model-item label="分享链接">
        <span>{{ detail.url }}</span><br>
        <a @click="handleCopy(detail.url)">复制链接</a>
        <VueQr style="width:20px;cursor:pointer;" :text="detail.url || ''" @click.native="showCode = true" />
        <!-- 二维码放大预览 -->
        <a-modal :footer="null" v-model="showCode">
          <VueQr style="width:100%" :text="detail.url || ''" />
        </a-modal>
      </a-form-model-item>
      <a-form-model-item label="分享密码">
        <span>{{ detail.password }}</span>
      </a-form-model-item>
      <a-form-model-item label="分享时效">
        <span>{{ formateExpired(detail.expired) }}</span>
      </a-form-model-item>
    </a-form-model>
  </a-modal>

  <!-- 编辑模式 -->
  <a-modal v-else-if="type === 'edit'" :visible="visible" title="发布分享" okText="发布" @cancel="handleClose" @ok="handleOk">
    <a-form-model :model="form" :rules="rules" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
      <!-- 分享链接 -->
      <a-form-model-item label="分享链接" prop="url">
        <span>{{ form.url }}</span><br>
        <a @click="handleCopy(form.url)">复制链接</a>
        <VueQr style="width:20px;cursor:pointer;" :text="detail.url || ''" @click.native="showCode = true" />
        <!-- 二维码放大预览 -->
        <a-modal :footer="null" v-model="showCode">
          <VueQr style="width:100%" :text="detail.url || ''" />
        </a-modal>
      </a-form-model-item>

      <!-- 分享密码 -->
      <a-form-model-item label="分享密码" prop="password">
        <a-input v-model="form.password" :disabled="$parent.publishType === 'republish'" :maxLength="6" placeholder="请输入6位分享密码（数字+字母）"></a-input>
      </a-form-model-item>

      <!-- 分享时效 -->
      <a-form-model-item label="分享时效" prop="expired">
        <a-radio-group v-model="form.expired" :disabled="$parent.publishType === 'republish'" :default-value="7">
          <a-radio :value="7">7天</a-radio>
          <a-radio :value="30">30天</a-radio>
          <a-radio :value="0">永久</a-radio>
        </a-radio-group>
      </a-form-model-item>

      <!-- 功能 -->
      <!-- <a-form-model-item label="功能" prop="condition">
        <a-checkbox-group :options="['查看图表数据', '导出']"></a-checkbox-group>
      </a-form-model-item> -->

      <!-- 发布 -->
      <!-- <a-form-model-item label="发布" prop="sync">
        <a-checkbox v-model="form.isSync">同步发布至OA</a-checkbox>
      </a-form-model-item> -->
    </a-form-model>
  </a-modal>
</template>

<script>
import VueQr from 'vue-qr'
export default {
  name: '',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    detail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showCode: false,
      form: {},
      rules: {
        password: [{ length: 6 }],
        expired: [{ required: true, message: '请勾选分享时效' }]
      }
    }
  },
  components: {
    VueQr
  },
  watch: {
    visible(newValue) {
      if (newValue && Object.keys(this.detail).length) {
        this.form = { ...this.detail }
      }
    }
  },
  methods: {
    // 复制链接
    handleCopy(url) {
      let input = document.createElement('input') // 直接构建input
      input.value = url // 设置内容
      document.body.appendChild(input) // 添加临时实例
      input.select() // 选择实例内容
      const textResult = document.execCommand('Copy') // 执行复制
      document.body.removeChild(input) // 删除临时实例
      if (textResult) {
        this.$message.info('复制成功')
      } else {
        this.$message.err('复制失败')
      }
    },
    // 格式化时效
    formateExpired(expired) {
      switch (expired) {
        case 7:
        case '7':
          return '7天'
        case 30:
        case '30':
          return '30天'
        case 0:
        case '0':
          return '永久'
        default:
          return ''
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleOk() {
      this.$emit('ok', this.form)
    }
  }
}
</script>

<style scoped></style>
