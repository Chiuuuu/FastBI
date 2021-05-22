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
      <template #updateTime="text, record, index">
        <span v-html="text"></span>
      </template>
      <template #modelName="text, record, index">
        <span v-html="text"></span>
      </template>
      <template #condition="text, record, index">
        <span v-html="text"></span>
      </template>
      <template #description="text, record, index">
        <span v-html="text"></span>
      </template>
      <template #modUserName="text, record, index">
        <span v-html="text"></span>
      </template>
      <template #reason="text, record, index">
        <span>{{ text || '/' }}</span>
      </template>
    </a-table>
    <div v-html="compare"></div>
  </div>
</template>

<script>
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
      this.underLine('name')
      this.underLine('updateTime')
      this.underLine('description')
      this.underLine('modUserName')
    }
  },
  methods: {
    textCompare(prev, next) {
      const prevLen = prev.length
      const nextLen = next.length
      let shortStr = prevLen <= nextLen ? prev : next
      let longStr = prevLen <= nextLen ? next : prev
      let shortHead = 0
      let longHead = 0
      let same = false
      let shortIndex = []
      let longIndex = []

      function setIndex(i) {
        const distance = i - shortHead + 1
        shortIndex.push([shortHead, i + 1])
        longIndex.push([longHead, longHead + distance])
        // 重新从下一个坐标开始寻找相同元素
        shortHead = i + 1
        longHead += distance
      }
      // 以短的字符串为指针参照对象
      let i = 0
      while (i <= shortStr.length) {
        // 已有相同元素
        if (same) {
          if (shortStr[i] !== longStr[longHead + (i - shortHead)]) {
            // 当前指针发现元素不对, 则输出目前为止的字符
            same = false
            setIndex(i - 1)
            // 继续从long中寻找相同元素
            for (let j = longHead + 1; j <= longStr.length; j++) {
              // 发现相等, 记录指针位置并退出当前循环
              if (shortStr[i] === longStr[j]) {
                same = true
                longHead = j
                break
              }
            }
            if (!same) shortHead++
          }
        } else { // 重新开始寻找相同元素
          for (let j = longHead; j <= longStr.length; j++) {
            // 发现相等, 记录指针位置并退出当前循环
            if (shortStr[i] === longStr[j]) {
              same = true
              longHead = j
              break
            }
          }
          if (!same) shortHead++
        }
        i++
        if (i === shortStr.length && same) {
          setIndex(i - 1)
          break
        }
      }
      shortIndex.map(([start, end], index) => {
        // 47是span标签的总长度
        start += index * 47
        end += index * 47
        const cut = shortStr.slice(start, end)
        const arr = shortStr.split('')
        arr.splice(start, end - start, `<span style="text-decoration:underline">${cut}</span>`)
        shortStr = arr.join('')
      })
      longIndex.map(([start, end], index) => {
        // 47是span标签的总长度
        start += index * 47
        end += index * 47
        const cut = longStr.slice(start, end)
        const arr = longStr.split('')
        arr.splice(start, end - start, `<span style="text-decoration:underline">${cut}</span>`)
        longStr = arr.join('')
      })
      if (prevLen <= nextLen) {
        return [shortStr, longStr]
      } else {
        return [longStr, shortStr]
      }
    },
    underLine(key) {
      const result = this.textCompare(this.listData[0][key], this.listData[1][key])
      this.listData[0][key] = result[0]
      this.listData[1][key] = result[1]
    }
  }
}
</script>

<style scoped>

</style>
