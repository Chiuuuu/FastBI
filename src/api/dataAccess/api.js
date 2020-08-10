import $axios, { requestGet, requestPost2, requestGetNoData } from '../api_request'

/**
 *  左边菜单栏
*/
export function fetchMenuList(options) {
    return requestGetNoData(options.url)
}

/**
 * 根据id获取对应表单信息
 */
export function fetchTableInfo(options) {
    return requestGetNoData(options.url)
}

/**
 * 写入数据库
 */
export function fetchWriteTable(options) {
    return requestGetNoData(options.url)
}

/**
 * 获取表结构
*/
export function fetchDatabaseInfo(opions) {
    return requestGet(opions.url, opions.data)
}

/**
 * 连接操作
 */
export function fetchConnect(opions) {
    return requestPost2(opions.url, opions.data)
}

/**
 * 获取默认数据库
*/
export function fetchGetDBList(options) {
    return requestGet(options.url, options.data)
}

/**
 * 保存数据表
*/
export function fetchSave(options) {
    return requestPost2(options.url, options.data)
}
