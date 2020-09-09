import screenManage from './screenManage/api'
import login from './login/api'
import common from '@/api/modules/common'
import dataAccess from '@/api/modules/dataAccess'
import dataModel from '@/api/modules/dataModel'

const server = {
  screenManage,
  login,
  common,
  dataAccess,
  dataModel
}

export default server
