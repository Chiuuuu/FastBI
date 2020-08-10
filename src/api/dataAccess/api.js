import $axios, { requestGet,requestPost2, requestGetNoData } from '../api_request';

/** 
 *  左边菜单栏 
*/
export function fetchMenuList(options){
    return requestGetNoData(options.url)
}

// export function fetchDeleteMenu(options){
//     return req
// }

/**
 * 连接操作
 */
export function fetchConnect(opions){
    return requestPost2(opions.url, opions.data);
}

/** 
 * 获取默认数据库
*/
export function fetchGetDBList(options){
    return requestGet(options.url, options.data);
}

/** 
 * 保存数据表
*/
export function fetchSave(options){
    return requestPost2(options.url, options.data)
}