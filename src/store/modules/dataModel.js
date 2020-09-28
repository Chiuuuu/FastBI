import dataAccessApi from '../../api/modules/common'
const state = {
	parentId: '',
	modelId: -1, // 选中的菜单id
	menuList: [],
	databaseId: '', // 数据库id
	datasource: null, // 数据源
	datasourceId: ''
}

const mutations = {
	SET_PARENTID(state, id) {
		state.parentId = id
	},
	SET_MODELID(state, id) {
		state.modelId = id
	},
	SET_DATABASEID(state, id) {
		state.databaseId = id
	},
	SET_MENULIST(state, list) {
		state.menuList = list
	},
	SET_DATASOURCE(state, datasource) {
		state.datasource = datasource
	},
	SET_DATASOURCEID(state, id) {
		state.datasourceId = id
	}
}

const actions = {
	async getMenuList({ commit }, vm) {
		const result = await dataAccessApi.getMenuList('/model/catalog/list/2')
		if (result.code === 200) {
			commit('SET_MENULIST', result.data)
		} else {
			vm.$message.error(result.msg)
		}
	},
	setParentId({ commit }, id) {
		commit('SET_PARENTID', id)
	},
	setModelId({ commit }, id) {
		commit('SET_MODELID', id)
	},
	setDatabaseId({ commit }, id) {
		commit('SET_DATABASEID', id)
	},
	setDatasource({ commit }, datasource) {
		commit('SET_DATASOURCE', datasource)
	},
	setDatasourceId({ commit }, id) {
		commit('SET_DATASOURCEID', id)
	}
}

export default {
	namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
	state,
	mutations,
	actions
}
