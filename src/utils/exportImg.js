import html2canvas from 'html2canvas'

// 导出图片
export function exportImg(chartId, chart, pageSettings, canvasRange) {
  let domObj = document.getElementById(chartId)
  let width = domObj.clientWidth * canvasRange
  let height = domObj.clientHeight * canvasRange
  // 表格控件复制节点
  if (chart.setting.chartType === 'v-tables') {
    domObj = domObj.cloneNode(true)
    if (!domObj.style.backgroundColor) {
      domObj.style.backgroundColor = pageSettings.backgroundColor // 如果图表背景透明，按大屏背景色作为背景
    }
    document.body.appendChild(domObj)
    width = domObj.clientWidth
    height = domObj.clientHeight
  }

  html2canvas(domObj, {
    width,
    height,
    scale: 1,
    dpi: 300,
    letterRendering: true,
    scrollY: 0,
    scrollX: 0,
    useCORS: true, // 【重要】开启跨域配置
    onclone: documentClone => {
      const cloneDom = documentClone.getElementById(chartId)
      if (!cloneDom.style.backgroundColor) {
        cloneDom.style.backgroundColor = pageSettings.backgroundColor // 如果图表背景透明，按大屏背景色作为背景
        if (chart.setting.chartType !== 'v-tables') {
          let fontSize =
            chart.setting.config.title.textStyle.fontSize * canvasRange
          cloneDom.childNodes[0].style.letterSpacing =
            fontSize * canvasRange + 'px'
          cloneDom.childNodes[0].childNodes[0].style.fontSize =
            Math.floor(fontSize) + 'px'
        }
      }
    }
  }).then(canvas => {
    if (chart.setting.chartType === 'v-tables') {
      document.body.removeChild(domObj)
    }
    downloadImg(canvas, chart.name)
  })
}

export function exportForFull(chartId, chart, pageSettings) {
  let domObj = document.getElementById(chartId)
  let width = domObj.clientWidth
  let height = domObj.clientHeight
  html2canvas(domObj, {
    width,
    height,
    scale: 1,
    dpi: 300,
    letterRendering: true,
    scrollY: 0,
    scrollX: 0,
    useCORS: true, // 【重要】开启跨域配置
    onclone: documentClone => {
      const cloneDom = documentClone.getElementById(chartId)
      if (!cloneDom.style.backgroundColor) {
        cloneDom.style.backgroundColor = pageSettings.backgroundColor // 如果图表背景透明，按大屏背景色作为背景
      }
      //   cloneDom.style.removeProperty('transform')
      //   cloneDom.parentNode.style.removeProperty('transform')
    }
  }).then(canvas => {
    downloadImg(canvas, chart.name)
  })
}

export function exportScreen(screenId, name) {
  debugger
  let domObj = document.getElementById(screenId)
  let width = domObj.clientWidth
  let height = domObj.clientHeight
  html2canvas(domObj, {
    width,
    height,
    scale: 1,
    dpi: 300,
    letterRendering: true,
    scrollY: 0,
    scrollX: 0,
    useCORS: true, // 【重要】开启跨域配置
    onclone: documentClone => {}
  }).then(canvas => {
    downloadImg(canvas, name)
  })
}

// 下载图片
function downloadImg(canvas, name) {
  let a = document.createElement('a')
  a.style.display = 'none'
  let blob = dataURLToBlob(canvas.toDataURL('image/png'))
  a.setAttribute('href', URL.createObjectURL(blob))
  // 这块是保存图片操作  可以设置保存的图片的信息
  a.setAttribute('download', name + '.png')
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(blob)
  document.body.removeChild(a)
}
// 图片格式转换方法
function dataURLToBlob(dataurl) {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
