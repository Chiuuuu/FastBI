function checkPermission(el, binding) {
    const { value } = binding

    if (value && value instanceof Array && value.length > 0) {
        const permissionRoles = value

        // 【1,2】是根据登录的用户获取到权限
        const hasPermission = [1, 2].some(role => {
            return permissionRoles.includes(role)
        })

        if (!hasPermission) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    } else {
        throw new Error(`need roles, like v-perssion=[1,2]`)
    }
}

export default {
    inserted(el, binding) {
        checkPermission(el, binding)
    },
    update(el, binding) {
        checkPermission(el, binding)
    }
}