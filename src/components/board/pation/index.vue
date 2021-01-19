<template>
  <div class="pagination">
    <div
      v-for="(page, index) in pages"
      :key="page.name"
      @click="toOtherPage(page.id)"
    >
      <a-dropdown :trigger="['contextmenu']" v-model="page.showDropDown">
        <div
          :class="[
            'page',
            {
              'current-select': $route.query.did === page.id
            }
          ]"
          draggable
          @dragstart="handleDragStart($event, page)"
          @dragover.prevent="handleDragOver($event, page)"
          @dragenter="handleDragEnter($event, page)"
          @dragend="handleDragEnd($event, page)"
        >
          {{ page.name
          }}<input
            ref="input"
            @blur="onBlur(page)"
            @dblclick="renameTab(page, index)"
            :class="['page-input', { 'not-show': !page.isFocus }]"
            v-model="showName"
          />
        </div>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="copyTab(page)">复制</a-menu-item>
          <a-menu-item key="2" @click="renameTab(page, index)"
            >重命名</a-menu-item
          >
          <a-menu-item
            key="3"
            @click="deleteTab(page, index)"
            :disabled="pages.length === 1"
            >删除</a-menu-item
          >
        </a-menu>
      </a-dropdown>
    </div>
    <a-icon class="page-icon" @click="addPage" type="plus-square" />
  </div>
</template>

<script>
import {
  addResizeListener,
  removeResizeListener
} from 'bin-ui/src/utils/resize-event'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      pages: [],
      showName: '',
      dragItem: null
    }
  },
  created() {
    this.getTabsData()
  },
  beforeDestroy() {},
  methods: {
    ...mapActions(['SetCanvasRange']),
    // 页签跳转
    toOtherPage(id) {
      this.$router.replace({
        name: 'screenEdit',
        query: {
          id: this.screenId,
          did: id
        }
      })
    },
    getTabsData() {
      this.$server.screenManage.getScreenTabs(this.screenId).then(res => {
        if (res.code === 200) {
          this.pages = res.rows.map(item =>
            Object.assign(item, { showDropDown: false, isFocus: false })
          ) // 从目录页进来取默认选中第一页
          if (this.$route.query.did === 0) {
            this.toOtherPage(this.pages[0].id)
          }
        } else {
          res.msg && this.$message.error(res.msg)
        }
      })
    },
    addPage() {
      // 页面最多10个
      if (this.pages.length < 10) {
        // 获取新页签名称，如果页面上有页面X的格式，新建页面名字默认是页面x+1
        let noList = this.pages.map(item => {
          if (/页面\d/.test(item.name)) {
            return parseInt(item.name.replace(/[^0-9]/gi, ''))
          }
        })
        let no = noList.length === 0 ? 1 : Math.max(...noList) + 1
        let name = `页面${no}`
        let params = {
          name: name,
          orderNo: this.pages.length + 1,
          screenId: this.screenId
        }
        this.$server.screenManage.addScreenTab(params).then(res => {
          if (res.code === 200) {
            this.toOtherPage(res.data)
            this.getTabsData()
          }
        })
      } else {
        this.$message.error('最多只能添加10个页签')
      }
    },
    copyTab(page) {
      let params = {
        name: `page.name${1}`,
        orderNo: page.orderNo,
        screenId: this.screenId,
        id: page.id
      }
    },
    renameTab(page, index) {
      this.showName = page.name
      page.isFocus = true
      page.showDropDown = false
      this.$refs.input[index].select()
    },
    onBlur(page) {
      if (!this.showName) {
        page.isFocus = false
        return
      }
      let params = {
        name: this.showName,
        orderNo: page.orderNo,
        screenId: this.screenId,
        id: page.id
      }
      this.$server.screenManage.renameScreenTab(params).then(res => {
        if (res.code === 200) {
          page.isFocus = false
          page.name = this.showName
        } else {
          res.msg && this.$message.error(res.msg)
          page.isFocus = false
        }
      })
    },
    deleteTab(page, index) {
      this.$confirm({
        title: '确认提示',
        content: `是否确认删除页签${page.name}?`,
        onOk: async () => {
          const res = await this.$server.screenManage.deleteScreenTab(page.id)
          if (res.code === 200) {
            // 如果删除的是当前选中的页签，跳转到上一个页签,如果是第一页就跳转到第二页
            if (this.$route.query.did === page.id) {
              this.toOtherPage(
                index === 0 ? this.pages[1].id : this.pages[index - 1].id
              )
              this.getTabsData()
              return
            }
            this.pages.splice(index, 1)
          } else {
            res.msg && this.$message.error(result.msg)
          }
        }
      })
    },
    // 开始拖拽
    handleDragStart(e, item) {
      this.dragItem = item
    },
    //  结束拖拽清空数据
    handleDragEnd(e, item) {
      this.dragItem = null
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = 'move'
    },
    handleDragEnter(e, item) {
      //为需要移动的元素设置dragstart事件
      e.dataTransfer.effectAllowed = 'move'
      if (item === this.dragItem) {
        return
      }
      // 交换位置
      const newItems = [...this.pages]
      const src = newItems.indexOf(this.dragItem)
      const dst = newItems.indexOf(item)
      newItems.splice(dst, 0, ...newItems.splice(src, 1))
      this.pages = newItems
      // 修改页签的orderNo
      this.pages.forEach((item, index) => {
        item.orderNo = index + 1
      })

      console.log(JSON.stringify(this.pages))
      this.$server.screenManage.orderScreenTab(this.pages).then(res => {
        if (res.code != 200) {
          res.msg && this.$message.error(res.msg)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'pageSettings',
      'canvasRange',
      'contextMenuInfo',
      'screenId'
    ])
  }
}
</script>
