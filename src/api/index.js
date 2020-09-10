import common from '@/api/modules/common'
import dataAccess from '@/api/modules/dataAccess'
import dataModel from '@/api/modules/dataModel'
import screenManage from '@/api/modules/screenManage'
import login from '@/api/modules/login'

const server = {
  screenManage,
  login,
  common,
  dataAccess,
  dataModel
}

export default server
