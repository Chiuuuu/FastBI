/**
* 全局管理权限code编码
* PAGE 表示页面路由菜单， 必须为数字类型
* OBJECT 表示模块的对象, 必须为字符串类型
* OPERATOR 表示模块的对象的操作，必须为数字类型
*/
const PERMISSION_CODE = {
    PAGE: {
        all: 0, // 所有页面
        datasource: 1, // 数据接入
        datamodel: 2, // 数据模型
        screen: 3, // 数据大屏
        user: 4, // 用户管理
        role: 5, // 角色管理
        dataPermission: 6, // 数据权限管理
        personnel: 7, // 人员管理
        project: 8 // 项目管理
    },
    OBJECT: {
        all: '0', // 该模块下所有对象
        datasource: '1', // 数据源 即数据接入
        database: '2', // 数据库
        table: '3', // 数据表
        customTable: '4', // 自定义表
        field: '5', // 数据字段
        scheduler: '6', // 定时任务
        operateLog: '7', // 操作日志
        datamodel: '8', // 数据模型
        dimension: '9', // 维度
        measure: '10', // 度量
        widetable: '11', // 宽表
        screen: '12', // 大屏
        catalog: '13' // 目录菜单
    },
    OPERATOR: {
        all: 0, // 所有以下操作
        list: 1, // 查看
        query: 2, // 详情
        add: 3, // 新增
        edit: 4, // 编辑
        remove: 5, // 删除
        schedule: 6, // 定时
        extract: 7, // 抽取
        export: 8, // 导出
        duplicate: 9, // 复制
        publish: 10 // 发布
    }
}

export default PERMISSION_CODE
