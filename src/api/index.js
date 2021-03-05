import common from '@/api/modules/common'
import dataAccess from '@/api/modules/dataAccess'
import dataModel from '@/api/modules/dataModel'
import screenManage from '@/api/modules/screenManage'
import login from '@/api/modules/login'
import projectCenter from '@/api/modules/projectCenter'
import corporateDomain from '@/api/modules/corporateDomain'
import user from '@/api/modules/user'
import label from '@/api/modules/label'

const server = {
  user,
  screenManage,
  login,
  common,
  dataAccess,
  dataModel,
  projectCenter,
  corporateDomain,
  label
}

export default server
