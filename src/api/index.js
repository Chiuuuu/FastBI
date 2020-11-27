import common from '@/api/modules/common'
import dataAccess from '@/api/modules/dataAccess'
import dataModel from '@/api/modules/dataModel'
import screenManage from '@/api/modules/screenManage'
import login from '@/api/modules/login'
import projectCenter from '@/api/modules/projectCenter'

const server = {
  screenManage,
  login,
  common,
  dataAccess,
  dataModel,
  projectCenter
}

export default server
