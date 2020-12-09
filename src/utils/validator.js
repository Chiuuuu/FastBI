/**
 * @description 公共表单校验
 */
const commonValidateField = {
  length: function(config) {
    return {
      min: config.min || 0,
      max: config.max,
      message: `请输入${config.min}-${config.max}个字符的${config.title}`
    }
  },
  noChinese: function(config) {
    return {
      pattern: /^[a-zA-Z0-9]*$/g,
      message: config.title + '仅支持字母大小写加数字的格式'
    }
  },
  chinese: function(config) {
    return {
      pattern: /^[\u4e00-\u9fa5\uF900-\uFA2D]*$/g,
      message: config.title + '仅支持中文'
    }
  },
  noSign: function(config) {
    return {
      pattern: /^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z\d]*$/g,
      message: config.title + '仅支持中英文和数字的格式'
    }
  },
  noEmoji: function(config) {
    return {
      pattern: /^[\u4e00-\u9fa5\uF900-\uFA2Da-zA-Z\d`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]*$/g,
      message: config.title + '仅支持中英文数字和符号的格式'
    }
  }
}

export default commonValidateField
