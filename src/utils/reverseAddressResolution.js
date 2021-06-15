// 逆地址解析
import { message } from 'ant-design-vue'
import { reject } from 'core-js/fn/promise'
export default function(position, citycode = '010', radius = 1000) {
  let promise = new Promise((resolve, reject) => {
    // position:[经度，纬度]
    AMap.plugin('AMap.Geocoder', function() {
      const geocoder = new AMap.Geocoder({
        city: citycode, //城市设为北京，默认：“全国”
        radius //范围，默认：500
      })
      geocoder.getAddress(position, function(status, result) {
        if (status === 'complete' && result.regeocode) {
          resolve(result.regeocode.addressComponent)
          // var address = result.regeocode.formattedAddress
        } else {
          message.error('根据经纬度查询地址失败')
          reject()
        }
      })
    })
  })
  return promise
}
