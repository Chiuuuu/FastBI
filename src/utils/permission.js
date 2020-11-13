/**
 * @export checkPermission 权限校验
 * @param {Array} value 权限数组
 * @returns {Boolean} 是否有权限
 */
export default function checkPermission(value) {
    if (value && value instanceof Array && value.length > 0) {
        const permissionRoles = value

        const hasPermission = [1, 2].some(role => {
            return permissionRoles.includes(role)
        })

        return hasPermission
    } else {
        console.log(`need roles, like v-if="checkPerssion([1,2])"`)
        return false
    }
}