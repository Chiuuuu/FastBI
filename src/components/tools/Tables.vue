<template>
  <div
    class="dv-tables"
    style="width: 100%;height:100%;"
    :style="backgroundStyle"
    ref="wrap"
  >
    <div
      class="titles"
      ref="titles"
      v-if="config.title && config.title.show"
      :style="titleStyle"
    >
      <span>{{ config.title.content }}</span>
    </div>
    <div class="tables">
      <div
        class="chart-table xscroll"
        ref="charttable"
        @scroll="getScrollLeft"
        :style="{
          width: showTableSize.tableX + 'px',
          height: showTableSize.tableY + 'px'
        }"
      >
        <table
          v-show="showHeader"
          class="table-content table-header"
          ref="tableheader"
          :style="{ width: tableWidth + 'px' }"
        >
          <colgroup>
            <col
              v-for="(value, index) in colWidths"
              :key="index"
              :style="{ width: value + 'px' }"
            />
          </colgroup>
          <thead>
            <tr>
              <th
                :style="HeaderStyle"
                class="data"
                v-for="(column, index) in columns"
                :key="index"
              >
                {{ column.title }}
              </th>
            </tr>
          </thead>
        </table>
        <div
          class="tbody"
          :style="{
            width: bodyWidth + 'px',
            height: bodyHeight + 'px'
          }"
          @scroll="handleScroll"
        >
          <table
            class="table-content table-body yscroll"
            ref="tablebody"
            :style="{ width: tableWidth + 'px' }"
          >
            <colgroup>
              <col
                v-for="(value, index) in colWidths"
                :key="index"
                :style="{ width: value + 'px' }"
              />
            </colgroup>
            <tr
              v-for="(row, index) in tableData"
              :key="index"
              class="js-table-tr"
            >
              <td
                :style="customRow(index)"
                class="data data-body"
                v-for="(value, index) in row"
                :key="index"
              >
                {{ value }}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <!-- <span slot="index" slot-scope="text, record, index" v-if="config.index.show">
          {{index + 1}}
      </span>-->
      <!-- </a-table> -->
    </div>
  </div>
</template>

<script>
import {
  addResizeListener,
  removeResizeListener
} from 'bin-ui/src/utils/resize-event'
import { formatData, convertData } from '../../utils/formatData'
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils/deepClone'
export default {
  name: 'ChartsTables',
  props: {
    config: {
      type: Object,
      required: true
    },
    apiData: {
      type: Object,
      required: true
    },
    background: {
      type: Object,
      required: true
    },
    chartSize: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      width: '500px',
      height: '400px',
      chartData: [],
      columns: [],
      colors: [],
      showHeader: true,
      backgroundStyle: {},
      showTableSize: {},
      tableWidth: '',
      bodyHeight: '',
      bodyWidth: '',
      colWidths: [],
      tableData: [], // 展示的表格数据slice(headIndex * pageSize, footIndex * pageSize)
      // 展示500行数据
      pagination: {
        lastScrollTop: 0, // 记录上次滚动位置
        totalIndex: 0, // 最大页数
        headIndex: 0, // 头部截取下标
        footIndex: 4, // 脚部截取下标
        pageSize: 25 // 每次加载数
      }
    }
  },
  watch: {
    config: {
      handler(val, oldval) {
        if (val) {
          this.showHeader = val.header.show
          //   for (let item of this.columns) {
          //     // 是否自动换行
          //     item.ellipsis = val.table.ellipsis
          //   }
          this._calcStyle()
        }
      },
      deep: true,
      immediate: true
    },
    apiData: {
      handler(val) {
        if (val) {
          if (val.tableList.length > 0 && val.source && val.source.columns) {
            this.columns = val.source.columns
            let rows = val.source.rows
            let newRows = []
            // 给列数据key重新排序
            for (let row of rows) {
              let newList = []
              for (let col of this.columns) {
                newList.push(row[col.key])
              }
              newRows.push(newList)
            }
            this.chartData = newRows
            this._calcStyle()
            return
          }
          this.columns = val.columns || []
          this.chartData = val.rows || []
          this._calcStyle()
        }
      },
      deep: true,
      immediate: true
    },
    background: {
      handler(val) {
        if (val) {
          this.backgroundStyle = {
            background:
              val.backgroundType === '1'
                ? val.backgroundColor
                : `url(${val.backgroundSrc}) 0% 0% / 100% 100% no-repeat`,
            borderColor: val.borderColor,
            borderWidth: val.borderWidth + 'px',
            borderStyle: val.borderStyle,
            borderRadius: val.borderRadius + 'px'
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this._calcStyle()
    addResizeListener(this.$refs.wrap, this._calcStyle)
  },
  beforeDestroy() {
    removeResizeListener(this.$refs.wrap, this._calcStyle)
  },
  methods: {
    /**
     * @description 每次数据变化, 初始化滚动数据
     */
    initScrollData() {
      const len = this.chartData.length
      // 初始化分页信息
      this.pagination = {
        lastScrollTop: 0, // 记录上次滚动位置
        totalIndex: 0, // 最大页数
        headIndex: 0, // 头部截取下标
        footIndex: 4, // 脚部截取下标
        pageSize: 25 // 每次加载数
      }
      const { headIndex, footIndex, pageSize } = this.pagination
      if (len > (footIndex + 1) * pageSize) {
        this.pagination.totalIndex = Math.ceil(len / pageSize)
      }
      this.tableData = this.chartData.slice(
        headIndex * pageSize,
        footIndex * pageSize
      )
    },
    /**
     * @description 监听滚动事件处理分页
     */
    handleScroll(e) {
      const area = e.target
      const { scrollTop, scrollHeight, scrollWidth } = area
      const clientHeight = area.clientHeight
      let {
        totalIndex,
        headIndex,
        footIndex,
        pageSize,
        lastScrollTop
      } = this.pagination
      const cell = area.querySelector('.js-table-tr')
      if (!cell) return
      const cellHeight = cell.clientHeight
      // 临界距离取当前高度的1/5或者5个单元格的高
      const distance = Math.min(clientHeight / 5, cellHeight * 5)
      // 向上滚动到顶部临界值
      if (lastScrollTop >= scrollTop && scrollTop < distance) {
        if (--headIndex < 0) {
          headIndex = 0
          footIndex = 4
        } else {
          footIndex--
          this.tableData = this.chartData.slice(
            headIndex * pageSize,
            footIndex * pageSize
          )
          // 滚动条回滚
          area.scrollTo(scrollWidth, scrollTop + cellHeight * pageSize)
        }
      } else if (
        lastScrollTop <= scrollTop &&
        scrollHeight - clientHeight - scrollTop < distance
      ) {
        // 向下滚动到底部临界值
        if (++footIndex > totalIndex) {
          footIndex = totalIndex
          headIndex = totalIndex - 4
        } else {
          headIndex++
          this.tableData = this.chartData.slice(
            headIndex * pageSize,
            footIndex * pageSize
          )
          // 滚动条回滚
          area.scrollTo(scrollWidth, scrollTop - cellHeight * pageSize)
        }
      }
      Object.assign(this.pagination, {
        headIndex,
        footIndex,
        lastScrollTop: scrollTop
      })
    },
    afterConfig(options) {
      if (this.typeName === 've-map') {
        let data = [...options.series[0].data]
        options.series[0].data = convertData(data)
      }
      return options
    },
    async _calcStyle() {
      // 计算表格每列宽度
      await this.getColWidths()

      const wrap = this.$refs.wrap
      const title = this.$refs.titles
      if (!wrap) return
      let width = wrap.clientWidth
      let height = wrap.clientHeight
      if (this.config.title.show && title) {
        height -= title.clientHeight
      }
      this.width = width + 'px'
      this.height = height + 'px'

      // 计算表宽(单元格宽度求和)
      this.tableWidth = this.colWidths.reduce((total, value) => {
        return total + value
      }, 0)

      // 计算显示尺寸(比较表格内容的尺寸和缩放框的大小)
      let currentChartSize = this.chartSize.height
      if (this.config.title.show && title) {
        currentChartSize -= title.offsetHeight
      }
      // 处理完宽度, 初始化表格
      this.initScrollData()
      // 获取表格内容高度
      this.$nextTick(() => {
        this.showTableSize = {
          tableX: Math.min(this.tableWidth, this.chartSize.width),
          // tableX: this.chartSize.width,
          tableY:
            Math.min(
              this.$refs.tablebody.clientHeight +
                this.$refs.tableheader.clientHeight,
              currentChartSize
            ) - 10 // 去掉滚动轴占高
        }
        this.bodyHeight =
          this.showTableSize.tableY - this.$refs.tableheader.clientHeight
        console.log(this.bodyHeight)
      })
    },
    // 计算单元格宽度
    async getColWidths() {
      this.colWidths = []
      for (let row of this.chartData) {
        this.columns.forEach((col, index) => {
          if (col.ellipsis && this.config.table.columnWidth) {
            this.colWidths[index] = this.config.table.columnWidth
            return
          }
          // 计算每个单元格的大小（取每一列最长的宽度作为单位格宽度）
          if (!this.colWidths[index]) {
            // 默认取表头宽度
            this.colWidths[index] =
              this.getActaulLen(col.title) *
                this.config.header.textStyle.fontSize *
                0.6 +
              30
          }
          let colWidth =
            this.getActaulLen(row[index]) *
              this.config.table.textStyle.fontSize *
              0.6 +
            30
          if (colWidth > this.colWidths[index]) {
            this.colWidths[index] = colWidth
          }
        })
      }
      return true
    },
    // 汉字转换成两个字符长度
    getActaulLen(value) {
      if (!value) {
        return 0
      }
      let str = value
      if (typeof str === 'number') {
        str = str.toString()
      }
      return str.replace(/[\u0391-\uFFE5]/g, 'aa').length
    },
    getScrollLeft(e) {
      this.bodyWidth = e.target.scrollLeft + this.showTableSize.tableX
    },
    // // 设置表头样式
    // customHeaderRow() {
    //   return this.HeaderStyle
    // },
    // 设置表体样式
    customRow(index) {
      if (index % 2 === 1) {
        // 奇行
        return {
          //   style: {
          color: this.config.table.textStyle.color,
          'text-align': this.config.table.textStyle.textAlign,
          'font-size': this.config.table.textStyle.fontSize + 'px',
          'font-weight': this.config.table.textStyle.fontWeight,
          backgroundColor: this.config.table.oddBackgroundColor,
          //   'white-space': this.config.table.ellipsis ? 'normal' : 'nowrap'
          'white-space': 'nowrap'
          //   }
        }
      } else {
        return {
          //   style: {
          color: this.config.table.textStyle.color,
          'text-align': this.config.table.textStyle.textAlign,
          'font-size': this.config.table.textStyle.fontSize + 'px',
          'font-weight': this.config.table.textStyle.fontWeight,
          backgroundColor: this.config.table.evenBackgroundColor,
          //   'white-space': this.config.table.ellipsis ? 'normal' : 'nowrap'
          'white-space': 'nowrap'
          //   }
        }
      }
    }
  },
  computed: {
    titleEle() {
      return this.$refs.titles
    },
    titleStyle() {
      return {
        padding: '20px 10px',
        color: this.config.title.textStyle.color,
        fontSize: this.config.title.textStyle.fontSize + 'px',
        textAlign: this.config.title.textAlign,
        fontFamily: this.config.title.textStyle.fontFamily,
        fontWeight: this.config.title.textStyle.fontWeight
      }
    },
    HeaderStyle() {
      return {
        // 这个style就是我自定义的属性，也就是官方文档中的props
        // style: {
        color: this.config.header.textStyle.color,
        'text-align': this.config.header.textStyle.textAlign,
        'background-color': this.config.header.backgroundColor,
        'font-size': this.config.header.textStyle.fontSize + 'px',
        'font-weight': this.config.header.textStyle.fontWeight
        // },
        // on: {
        //   // 鼠标单击行
        //   click: event => {
        //     // do something
        //   }
        // }
      }
    }
  }
}
</script>
