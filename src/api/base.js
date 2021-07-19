// 环境的切换
let baseURL
if (process.env.NODE_ENV === 'development') {
  baseURL = `http://10.10.20.31:8080${process.env.VUE_APP_BASE_API}`
} else if (process.env.NODE_ENV === 'production') {
  baseURL = `${process.env.VUE_APP_SERVICE_URL}${process.env.VUE_APP_BASE_API}`
}
export default `${baseURL}`
