<template>
  <div class="monitoringtab">
    <div class="search">
      <div class="searchbar">
        用户名：
        <a-input class="inp" placeholder="请输入用户名" v-model="username" />
        姓名：
        <a-input class="inp" placeholder="请输入姓名" v-model="name" />
        <div class="btn">
          <a-button
            style="margin-right:20px"
            type="primary"
            icon="search"
            @click="getData"
          >
            查询
          </a-button>
          <a-button icon="sync" @click="reset">
            重置
          </a-button>
        </div>
      </div>
    </div>
    <div class="tablebox">
      <table class="table header">
        <tr>
          <th class="span" v-for="tit in tableHeader" :key="tit">
            {{ tit }}
          </th>
        </tr>
      </table>

      <table class="table body">
        <tr class="tr" v-for="(line, index) in dataList" :key="line.No">
          <td class="span" v-for="val in line" :key="val">{{ val }}</td>
          <td class="span del" @click="del(index)">剔除</td>
        </tr>
      </table>
    </div>
    <div class="pagination">
      <a-pagination
        show-quick-jumper
        :total="totalList.length"
        :pageSize="pageSize"
        @change="onChange"
      />
      <span class="pagesize"
        >每页显示<a-input-number
          class="pagesizeinp"
          v-model="pageSize"
          :min="1"
          :max="10"
          @change="pagesizeChange"
        />条</span
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'SystemMonitoring',
  data() {
    return {
      username: '',
      name: '',
      tableHeader: ['序号', '用户名', '姓名', '登录时间', '操作'],
      totalList: [],
      dataList: [],
      total: 500,
      pageSize: 10
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.totalList = [
        {
          No: 1,
          userName: '爪子',
          users: 'ttt',
          dateTime: '2021/01/01'
        },
        {
          No: 2,
          userName: '蹄子',
          users: 'ddd',
          dateTime: '2021/01/02'
        }
      ]
      if (this.username) {
        if (this.name) {
          this.totalList = this.totalList.filter(
            item => item.userName === this.username && item.name === this.name
          )
          return
        }
        this.totalList = this.totalList.filter(
          item => item.userName === this.username
        )
      }
      if (this.name) {
        this.totalList = this.totalList.filter(item => item.name === this.name)
      }
      this.dataList = this.totalList.filter(
        (item, index) => index >= 0 && index < this.pageSize
      )
    },
    reset() {
      this.username = ''
      this.name = ''
      this.getData()
    },
    del(index) {
      this.dataList.splice(index, 1)
    },
    onChange(pageNumber) {
      let listIndex = this.pageSize * (pageNumber - 1)
      this.dataList = this.totalList.filter(
        (item, index) => index >= listIndex && index < listIndex + this.pageSize
      )
    },
    pagesizeChange() {
      this.dataList = this.totalList.filter(
        (item, index) => index >= 0 && index < this.pageSize
      )
    }
  }
}
</script>
