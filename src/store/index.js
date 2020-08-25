import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import canvasMaps from './modules/canvasMaps'
import common from './modules/common'
import getters from './getters'
import dataAccess from './modules/dataAccess'
import options from './modules/options'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app,
        canvasMaps,
        common,
        dataAccess,
        options
    },
    getters
})
