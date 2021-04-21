<!-- 大屏数据列表 -->
<template>
  <div class="model-main scrollbar">
    <a-collapse v-model="modelKey" :bordered="false">
      <template #expandIcon="props">
        <a-icon
          type="folder"
          :rotate="props.isActive ? 0 : 0"
          style="font-size:16px"
        />
      </template>
      <template v-for="(item, index) in menuList">
        <a-collapse-panel
          :showArrow="Boolean(item.fileType === 0)"
          :key="String(index)"
          :header="item.name"
          :style="customStyle"
          :class="disableList.includes(item.id) ? 'disable' : ''"
          @click.native="fileHandle(item)"
        >
          <!--数据接入类型的有三级数据-->
          <a-collapse v-if="type === 3" v-model="secModelKey" :bordered="false">
            <template v-for="item2 in item.children">
              <a-collapse-panel
                :showArrow="false"
                :key="item2.id"
                :header="item2.name"
                :style="customStyle"
                :class="disableList.includes(item2.id) ? 'disable' : ''"
                @click.native="getTableList(item2)"
              >
                <div style="margin-left:25px;cursor: pointer;">
                  <p
                    @click="fileHandle(item3)"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    :class="disableList.includes(item3.id) ? 'disable' : ''"
                  >
                    {{ item3.name }}
                  </p>
                </div>
              </a-collapse-panel>
            </template>
          </a-collapse>
          <!--模型的只有两层数据-->
          <div v-else style="margin-left:25px;cursor: pointer;">
            <p
              @click="fileHandle(item2)"
              v-for="item2 in item.children"
              :key="item2.id"
              :class="disableList.includes(item2.id) ? 'disable' : ''"
            >
              {{ item2.name }}
            </p>
          </div>
        </a-collapse-panel>
      </template>
    </a-collapse>
  </div>
</template>
<script>
export default {
  props: {
    dataList: {
      type: Array
    },
    disableList: {
      type: Array
    },
    // 数据类型（接入:3|模型:8）
    type: {
      type: Number,
      require: true,
      default: 8
    }
  },
  data() {
    return {
      customStyle:
        'background: #ffffff;border-radius: 4px;border: 0;overflow: hidden;color:red !important;',
      modelKey: [],
      secModelKey: [],
      menuList: []
    }
  },
  mounted() {
    this.menuList = this.dataList
    this.modelKey = []
    this.menuList.forEach((item, index) => {
      if (item.fileType === 0) {
        this.modelKey.push(String(index))
      }
    })
  },
  methods: {
    fileHandle(item) {
      // 数据接入没有一级目录的时候获取三级
      if (this.type === 3 && item.fileType === 1) {
        this.getTableList(item)
        return
      }
      if (item.fileType !== 0 && !this.disableList.includes(item.id)) {
        item.resourceType = this.type
        this.$emit('fileHandle', item)
      }
    },
    // 获取数据接入表格列表
    async getTableList(item) {
      // 表列表已经存在的不用再请求一次
      if (item.children.length > 0) {
        return
      }
      // 根据数据源获取已抽取的库组
      const res = await this.$server.dataModel.getDataBaseDataInfoList(
        item.id,
        ''
      )
      if (res.code === 500) {
        this.$message.error(res.msg)
        return
      }
      // 根据库组id查询已抽取的表
      const tableList = await this.$server.dataModel.getTableListById(
        res.data[0].id
      )
      let list = tableList.data
      item.children = list
    }
  }
}
</script>
<style lang="less" scoped>
.model-main {
  height: 100%;
  overflow-y: scroll;
}
.model-main .ant-collapse-content > .ant-collapse-content-box {
  padding-bottom: 0;
}
</style>
