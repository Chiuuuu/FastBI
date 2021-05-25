<template>
  <div class="tree-map">
    <div v-for="(item, index) in 64" :key="index" class="tree-item" :class="{'bg': list[index]}">
      <span class="over-text" :title="list[index]">{{ list[index] ? list[index] : '' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'systemSchedule',
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.handleGetdata()
  },
  methods: {
    async handleGetdata() {
      const res = await this.$server.systemSchedule.getRunningSchedules()
      if (res.code === 200) {
        this.list = res.data
      } else {
        this.$message.error(res.msg || '获取列表失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tree-map {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  border-top: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;

  .tree-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12.5%;
    height: 12.5%;
    color: rgba(0, 0, 0, 0.85);
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    .over-text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &.bg {
      background: #d7d7d7;
    }
  }
}
</style>
