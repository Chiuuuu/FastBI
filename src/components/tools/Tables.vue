<template>
  <div class="dv-tables" style="width: 100%;height:100%;" :style="backgroundStyle" ref="wrap">
    <div class="titles" ref="titles" v-if="config.title && config.title.show" :style="titleStyle">
      <span>{{ config.title.content }}</span>
    </div>
    <div class="tables">
      <a-table
              :columns="columns"
              :data-source="tableData"
              :showHeader="showHeader"
              :customRow="customRow"
              size="middle"
              >
        <span slot="index" slot-scope="text, record, index" v-if="config.index.show">
          {{index + 1}}
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
  import { addResizeListener, removeResizeListener } from 'bin-ui/src/utils/resize-event'
  import { formatData, convertData } from '../../utils/formatData'

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
      }
    },
    data () {
      return {
        width: '500px',
        height: '400px',
        tableData: [],
        columns: [],
        colors: [],
        showHeader: true
      }
    },
    watch: {
      config: {
        handler (val) {
          if (val) {
            this.showHeader = val.header.show
          }
          // let obj = {
          //   title: '序号',
          //   dataIndex: 'index',
          //   key: 'index',
          //   scopedSlots: { customRender: 'index' }
          // }
          // if (this.columns.length > 0) {
          //   let i = this.columns.indexOf(obj)
          //   console.log(val.index.show)
          //   if (val.index.show && i < 0) {
          //     this.columns.unshift(obj)
          //   } else {
          //     this.columns.shift()
          //   }
          // }
        },
        deep: true,
        immediate: true
      },
      apiData: {
        handler (val) {
          if (val) {
            if (val.column) {
              for (let item of val.column) {
                item.customHeaderCell = this.customHeaderRow
              }
            }
            this.columns = val.column
            this.tableData = val.source
          }
        },
        deep: true,
        immediate: true
      },
      background: {
        handler (val) {
          if (val) {
           this.backgroundStyle = {
             backgroundColor: val.backgroundColor,
             borderColor: val.borderColor,
             borderWidth: val.borderWidth + 'px',
             borderStyle: val.borderStyle,
             borderRadius: val.borderRadius + 'px'
            }
          }
          console.log(this.backgroundStyle)
        },
        deep: true,
        immediate: true
      }
    },
    mounted () {
      this._calcStyle()
      addResizeListener(this.$refs.wrap, this._calcStyle)
    },
    beforeDestroy () {
      removeResizeListener(this.$refs.wrap, this._calcStyle)
    },
    methods: {
      afterConfig (options) {
        if (this.typeName === 've-map') {
          let data = [...options.series[0].data]
          options.series[0].data = convertData(data)
        }
        return options
      },
      _calcStyle () {
        const wrap = this.$refs.wrap
        const title = this.$refs.titles
        if (!wrap) return
        let width = wrap.clientWidth
        let height = wrap.clientHeight
        if (this.config.title) {
          height -= title.clientHeight
        }
        this.width = width + 'px'
        this.height = height + 'px'
      },
      // 设置表头样式
      customHeaderRow() {
        return this.HeaderStyle
      },
      // 设置表体样式
      customRow(record, index) {
        if (index % 2 === 1) { // 奇行
          return {
            style: {
              backgroundColor: this.config.table.oddBackgroundColor
            }
          }
        } else {
          return {
            style: {
              backgroundColor: this.config.table.evenBackgroundColor
            }
          }
        }
      }
    },
    computed: {
      titleStyle () {
        return {
          padding: '0 10px',
          color: this.config.title.textStyle.color,
          fontSize: this.config.title.textStyle.fontSize + 'px',
          textAlign: this.config.title.textAlign
        }
      },
      HeaderStyle () {
        return {
          // 这个style就是我自定义的属性，也就是官方文档中的props
          style: {
            color: this.config.header.textStyle.color + '!important',
            'background-color': this.config.header.backgroundColor,
            'font-size': this.config.header.textStyle.fontSize + 'px',
            'font-weight': this.config.header.textStyle.fontWeight
          },
          on: {
            // 鼠标单击行
            click: event => {
              // do something
            }
          }
        }
      }
    }
  }
</script>
