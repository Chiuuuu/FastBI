<template>
<div>
  <a-table
    :data-source="list"
    :columns="columns"
    :loading="$parent.spinning"
    :pagination="false" :scroll="{ y: 'calc(100vh - 340px)', x: 1200}"
    rowKey="id"
    >
    <template #name="text, record, index">
      <div class="oa-item-name">
        <span class="oa-item-text" :title="text">{{ text }}</span>
        <span v-if="record.isTop" class="oa-item-is-top">置顶</span>
      </div>
    </template>
    <template #status="text, record, index">
      <span class="oa-status-dot primary" v-if="text === 1">发布中</span>
      <span class="oa-status-dot overdate" v-else-if="text === 2">已过期</span>
      <span class="oa-status-dot cancel" v-else-if="text === 3">已撤销</span>
    </template>
    <template #config="text, record, index">
      <a class="oa-config-button" type="primary" @click="checkDetail(record)">查看</a>
      <a-divider type="vertical" />
      <a v-if="record.status === 3" @click="handlePublish(record)">发布</a>
      <a v-else-if="record.status === 2" @click="handlePublish(record)">重新发布</a>
      <a-popconfirm v-else-if="record.status === 1" title="是否确认撤销发布?" @confirm="handlePublish(record)">
        <a class="oa-config-button" type="primary">撤销发布</a>
      </a-popconfirm>
      <a-divider type="vertical" />
      <a-popconfirm title="是否确认取消置顶?" @confirm="cancelTop(record)">
        <a class="oa-config-button" type="primary">取消置顶</a>
      </a-popconfirm>
      <template v-if="record.isTop">
        <a-button icon="arrow-up" @click="changePlace('up')"></a-button>
        <a-button icon="arrow-down" @click="changePlace('down')"></a-button>
      </template>
    </template>
  </a-table>
  <PublishDetail :visible.sync="visible" :type="checkType" :detail="publishDetail" />
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
          dataIndex: 'name',
          ellipsis: true,
          width: 300,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '发布项目',
          dataIndex: 'project',
          ellipsis: true,
          width: 200
        },
        {
          title: '发布者',
          dataIndex: 'createBy',
          ellipsis: true,
          width: 100
        },
        {
          title: '发布时间',
          dataIndex: 'createTime',
          ellipsis: true,
          width: 200
        },
        {
          title: '当前状态',
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
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
      publishDetail: {} // 弹窗信息
    }
  },
  methods: {
    // 查看发布信息
    checkDetail(record) {
      this.visible = true
      this.checkType = 'check'
      this.publishDetail = record
    },
    // 处理发布
    handlePublish(record) {
      const status = +record.status
      if (status === 1) {
        // 发布中撤销发布

      } else if (status === 2) {
        // 过期重新发布
        this.publishDetail = record
        this.visible = true
        this.checkType = 'edit'
      } else if (status === 3) {
        // 已撤销重新发布
        this.publishDetail = {}
        this.visible = true
        this.checkType = 'edit'
      }
    },
    // 取消置顶
    cancelTop(record) {

    },
    // 置顶位置变化
    changePlace(place) {
      if (place === 'up') {

      } else if (place === 'down') {

      }
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
.oa-status-dot {
  padding-left: 10px;
  position: relative;
}
.oa-status-dot::before {
  content: "";
  position: absolute;
  top: 7px;
  left: 0;
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 6px;
}
.oa-status-dot.primary::before {
  background: #8198ff;
}
.oa-status-dot.overdate::before {
  background: #d2d2d5;
}
.oa-status-dot.cancel::before {
  background: #f00;
}
</style>
