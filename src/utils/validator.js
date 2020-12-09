/**
 * @description 公共表单校验
 * @param {Object} [params={}] 请求参数
 */
function commonValidateField(params = {}) {
  return {
    noChinese: {
      pattern: /^[a-zA-Z0-9]*$/g,
      message: params.title + '仅支持字母大小写加数字的格式'
    },
    chinese: {
      pattern: /^[\u4e00-\u9fa5\uF900-\uFA2D]*$/g,
      message: params.title + '仅支持中文'
    },
    noSign: {
      pattern: /^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z\d]*$/g,
      message: params.title + '仅支持中英文和数字的格式'
    },
    noEmoji: {
      pattern: /^[\u4e00-\u9fa5\uF900-\uFA2Da-zA-Z\d`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]*$/g,
      message: params.title + '仅支持中英文数字和符号的格式'
    },
    length: {
      min: params.min || 0,
      max: params.max,
      message: `请输入${params.min}-${params.max}个字符的${params.title}`
    }
  }
}

export default commonValidateField
