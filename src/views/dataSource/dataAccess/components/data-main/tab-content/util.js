export let validateIP = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入服务器ip地址'))
    } else {
        var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        var bl = re.test(value)
        if (!bl) {
        callback(new Error('ip地址格式错误'))
        }
        callback()
    }
}
