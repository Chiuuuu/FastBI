import common from '@/api/modules/common'
import dataAccess from '@/api/modules/dataAccess'
import dataModel from '@/api/modules/dataModel'
import screenManage from '@/api/modules/screenManage'
import login from '@/api/modules/login'
import projectCenter from '@/api/modules/projectCenter'
import corporateDomain from '@/api/modules/corporateDomain'
import user from '@/api/modules/user'
import log from '@/api/modules/log'
import systemMonitoring from '@/api/modules/systemMonitoring'
import label from '@/api/modules/label'
import dataDictionary from '@/api/modules/dataDictionary'

const server = {
  user,
  screenManage,
  login,
  common,
  dataAccess,
  dataModel,
  projectCenter,
  corporateDomain,
  log,
  systemMonitoring,
  label,
  dataDictionary
}

export default server
