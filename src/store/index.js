import createPersistedState from "vuex-persistedstate"

import Vue from 'vue';
import Vuex from 'vuex';
import common from './modules/common';

Vue.use(Vuex);
const store = new Vuex.Store({
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })],
    modules: {
        common
    },
});

export default store;