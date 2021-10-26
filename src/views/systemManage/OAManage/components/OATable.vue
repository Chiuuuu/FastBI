<template>
<div>
  <a-table
    :data-source="list"
    :columns="columns"
    :loading="$parent.spinning"
    :pagination="false" :scroll="{ y: 'calc(100vh - 340px)', x: 1200}"
    rowKey="id"
    >
    <template #screenName="text, record, index">
      <div class="oa-item-name">
        <span class="oa-item-text" :title="text">{{ text }}</span>
        <span v-if="record.no > 0" class="oa-item-is-top">置顶</span>
      </div>
    </template>
    <template #valid="text, record, index">
      <span class="oa-valid-dot primary" v-if="text === 1">发布中</span>
      <span class="oa-valid-dot overdate" v-else-if="text === 0">已过期</span>
      <span class="oa-valid-dot cancel" v-else-if="text === 2">已撤销</span>
    </template>
    <template #config="text, record, index">
      <a type="primary" @click="checkDetail(record)">查看</a>
      <a-divider type="vertical" />

      <!-- 发布状态 -->
      <a v-if="record.valid === 2" @click="handlePublish(record)">发布</a>
      <a v-else-if="record.valid === 0" @click="handlePublish(record)">重新发布</a>
      <a-popconfirm v-else-if="record.valid === 1" title="是否确认撤销发布?" @confirm="handlePublish(record)">
        <a type="primary">撤销发布</a>
      </a-popconfirm>
      <a-divider type="vertical" />

      <!-- 是否置顶 -->
      <a-popconfirm style="margin-right:10px" v-if="record.no > 0" title="是否确认取消置顶?" @confirm="handleTop(record, false)">
        <a type="primary">取消置顶</a>
      </a-popconfirm>
      <a v-else @click="handleTop(record, true)">置顶</a>
      <a-button icon="arrow-up" v-if="record.no > 0 && showArrow(index, 'up')" @click="changePlace(record, index, 'up')"></a-button>
      <a-button icon="arrow-down" v-if="record.no > 0 && showArrow(index, 'down')" @click="changePlace(record, index, 'down')"></a-button>
    </template>
  </a-table>
  <PublishDetail :visible.sync="visible" :type="checkType" :detail="publishDetail" @ok="handleOk" />
</div>
</template>

<script>
import PublishDetail from './publishDetail.vue'
export default {
  name: 'OATable',
  components: {
    PublishDetail
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      columns: [
        {
          title: '大屏名称',
          dataIndex: 'screenName',
          ellipsis: true,
          width: 300,
          scopedSlots: { customRender: 'screenName' }
        },
        {
          title: '发布项目',
          dataIndex: 'projectName',
          ellipsis: true,
          width: 200
        },
        {
          title: '发布者',
          dataIndex: 'operator',
          ellipsis: true,
          width: 100
        },
        {
          title: '发布时间',
          dataIndex: 'gmtCreate',
          ellipsis: true,
          width: 200
        },
        {
          title: '当前状态',
          dataIndex: 'valid',
          width: 100,
          scopedSlots: { customRender: 'valid' }
        },
        {
          title: '操作',
          dataIndex: 'config',
          width: 300,
          scopedSlots: { customRender: 'config' }
        }
      ],
      visible: false,
      checkType: 'check', // 弹窗模式 check | edit
      publishType: '', // 发布类型 republish | publish
      publishDetail: {}, // 弹窗信息
      nextPageFirst: null // 下一页第一个(用于置顶的上移下移)
    }
  },
  methods: {
    // 是否显示箭头按钮(第一个无法向上, 最后一个无法向下)
    showArrow(index, type) {
      const { current, pageSize, total } = this.$parent.pagination
      if (type === 'up') {
        return current !== 1 || index !== 0
      } else if (type === 'down') {
        // 最后一页
        if (Math.ceil(total / pageSize) === current) {
          return ++index !== (total % pageSize) && this.list[index].no > 0
        } else {
          // 假如当前页最后一个也是置顶, 则点击时需判断下一页第一个是否有置顶
          return ++index === pageSize || this.list[index].no > 0
        }
      }
    },
    // 查看发布信息
    checkDetail(record) {
      this.visible = true
      this.checkType = 'check'
      this.publishDetail = record
    },
    // 处理发布
    handlePublish(record) {
      const valid = +record.valid
      if (valid === 1) {
        // 发布中撤销发布
        this.handleCancelShare(record)
      } else if (valid === 0) {
        // 过期重新发布
        this.publishDetail = record
        this.publishType = 'republish'
        this.visible = true
        this.checkType = 'edit'
      } else if (valid === 2) {
        // 已撤销重新发布
        this.publishDetail = {}
        this.publishType = 'publish'
        this.visible = true
        this.checkType = 'edit'
      }
    },
    // 点击发布
    handleOk(form) {
      if (this.publishType === 'publish') {
        this.visible = false
        this.publishType = ''
        this.handleShare(form)
      } else if (this.publishType === 'republish') {
        this.visible = false
        this.publishType = ''
        this.handleReshare(form)
      }
    },
    // 撤销发布
    handleCancelShare(record) {
      this.$server.screenManage.delShareScreen({
        screenId: record.screenId,
        id: record.id
      })
      .then(res => {
        if (res && res.code === 200) {
          this.$message.success('撤销成功')
          this.$emit('refresh')
        } else {
          this.$message.error(res.msg || '请求错误')
        }
      })
    },
    // 重新发布
    handleReshare(record) {
      const url = record.url
      const params = {
        id: record.id,
        url: url.substring(url.lastIndexOf('/') + 1, url.length),
        screenId: record.screenId,
        password: record.password,
        expired: record.expired,
        publishOa: true,
        valid: 1
      }
      this.$server.screenManage.reShareScreen(params).then(res => {
        if (res && res.code === 200) {
          this.$message.success('发布成功')
          this.$emit('refresh')
        } else {
          this.$message.error(res.msg || '请求错误')
        }
      })
    },
    // 正常发布
    handleShare(record) {
      const url = record.url
      const params = {
        id: record.id,
        url: url.substring(url.lastIndexOf('/') + 1, url.length),
        screenId: record.screenId,
        password: record.password,
        expired: record.expired,
        publishOa: true,
        valid: 1
      }
      this.$server.screenManage.releaseScreen(params).then(res => {
        if (res && res.code === 200) {
          this.$message.success('发布成功')
          this.$emit('refresh')
        } else {
          this.$message.error(res.msg || '请求错误')
        }
      })
    },
    // 取消置顶
    async handleTop(record, isTop) {
      let res = null
      let message = '置顶成功'
      if (isTop) {
        res = await this.$server.screenManage.actionTopOAScreen(record.id)
      } else {
        res = await this.$server.screenManage.deleTopOAScreen(record)
        message = '取消置顶成功'
      }
      if (res && res.code === 200) {
        this.$message.success(message)
        this.$emit('refresh')
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 置顶位置变化
    async changePlace(record, index, place) {
      if (place === 'up') {
        // 如果是当前页第一项点击向上, 则获取上一页的最后一项
        const other = index === 0 ? await this.getNextPageOne('pre') : this.list[index - 1]
        const res = await this.$server.screenManage.actionUpOAScreen({
          currentNode: {
            id: record.id,
            no: record.no
          },
          betweenNode: {
            id: other.id,
            no: other.no
          }
        })
        if (res && res.code === 200) {
          this.$emit('refresh')
        } else {
          this.$message.error(res.msg || '请求错误')
        }
      } else if (place === 'down') {
        // 如果是当前页最后一项点击向下, 则获取下一页的第一项
        const other = ++index === this.list.length ? (this.nextPageFirst || await this.getNextPageOne('next')) : this.list[index]
        if (other.no > 0) {
          const res = await this.$server.screenManage.actionDownOAScreen({
            currentNode: {
              id: record.id,
              no: record.no
            },
            betweenNode: {
              id: other.id,
              no: other.no
            }
          })
          if (res && res.code === 200) {
            this.$emit('refresh')
          } else {
            this.$message.error(res.msg || '请求错误')
          }
        } else {
          this.$message.error('下一项未置顶')
        }
      }
    },
    // 获取前一页最后一个或者下一页第一个对象
    async getNextPageOne(type) {
      let result = null
      const { pagination: { current, pageSize }, projectId, searchForm } = this.$parent
      const params = {
        ...searchForm,
        projectId: projectId,
        current: type === 'pre' ? current - 1 : current + 1,
        pageSize: pageSize
      }
      const res = await this.$server.screenManage.getOAScreenList(params)
      if (res && res.code === 200) {
        result = res.rows[type === 'pre' ? pageSize - 1 : 0]
      }
      return result
    }
  }
}
</script>

<style scoped>
.oa-config-button {
  margin-right: 8px;
}
.oa-config-button.oa-icon {
  cursor: pointer;
  font-size: 22px;
}
.oa-item-name {
  display: flex;
}
.oa-item-text {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
}
.oa-item-is-top {
  display: inline-block;
  padding: 0 5px;
  margin-left: 4px;
  border: 1px solid #8198ff;
  border-radius: 4px;
  color: #8198ff;
  line-height: normal;
}
.oa-valid-dot {
  padding-left: 10px;
  position: relative;
}
.oa-valid-dot::before {
  content: "";
  position: absolute;
  top: 7px;
  left: 0;
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 6px;
}
.oa-valid-dot.primary::before {
  background: #8198ff;
}
.oa-valid-dot.overdate::before {
  background: #d2d2d5;
}
.oa-valid-dot.cancel::before {
  background: #f00;
}
</style>
