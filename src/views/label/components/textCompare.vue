<template>
  <div>
    <a-table
      rowKey="version"
      :columns="listColumn"
      :data-source="listData"
      :pagination="false"
      :scroll="{ x: 'calc(70vw - 50px)', y: 'calc(100vh - 430px)' }"
    >
      <template #name="text, record, index">
        <span v-html="text"></span>
      </template>
      <template #description="text, record, index">
        <span v-html="text"></span>
      </template>
    </a-table>
    <div v-html="compare"></div>
  </div>
</template>

<script>
import { MenuItem } from 'element-ui'
export default {
  name: 'textCompare',
  props: {
    listColumn: {
      type: Array,
      default() {
        return []
      }
    },
    diffData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      listData: [],
      compare: ''
    }
  },
  created () {
    if (this.diffData.length > 0) {
      this.listData = [].concat(this.diffData)
      const sameName = this.meizz(this.listData[0].name, this.listData[1].name)
      const sameDesc = this.meizz(this.listData[0].description, this.listData[1].description)
      console.log(sameName, sameDesc)
      this.underLine(sameName, sameDesc)
    }
  },
  methods: {
    meizz(pre, next) {
      const c = pre.length > next.length ? next : pre
      if (next === c) next = pre
      pre = c // 少做些循环
      const mm = []
      let isEnd = false
      for (let i = 0; i < pre.length; i++) {
        if (isEnd) break
        for (let j = i + 1; j <= pre.length; j++) {
          let s = pre.substring(i, j)
          let index = next.indexOf(s)
          if (index === -1) {
            if (s.length > 1) {
              mm.push(pre.substring(i, j - 1))
              console.log('相同值写入数组', pre.substring(i, j - 1), i, j - 1)
              i = j - 2
            }
            break
          } else {
            if (j === pre.length) {
              mm.push(s)
              console.log('相同值写入数组', s, i, j)
            }
          }
          if (j === pre.length) isEnd = true
        }
      }
      return [...new Set(mm)]
    },
    underLine(nameList, descList) {
      if (nameList.length > 0) {
        nameList.map(item => {
          const reg = new RegExp(item)
          this.listData[0].name = this.listData[0].name.replace(reg, `<span style="text-decoration: underline">${item}</span>`)
          this.listData[1].name = this.listData[1].name.replace(reg, `<span style="text-decoration: underline">${item}</span>`)
        })
      }
      if (descList.length > 0) {
        descList.map(item => {
          const reg = new RegExp(item)
          this.listData[0].description = this.listData[0].description.replace(reg, `<span style="text-decoration: underline">${item}</span>`)
          this.listData[1].description = this.listData[1].description.replace(reg, `<span style="text-decoration: underline">${item}</span>`)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
