// 环境的切换
let baseURL
if (process.env.NODE_ENV === 'development') {
  baseURL = `http://localhost:8080${process.env.VUE_APP_BASE_API}`
} else if (process.env.NODE_ENV === 'production') {
  baseURL = '/'
}
export default `${baseURL}`
