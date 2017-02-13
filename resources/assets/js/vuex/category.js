import Vuex from 'vuex';
import Vue from 'vue';
import { SET_CATEGORY, FETCH_CATEGORIES } from './mutation-types';

Vue.use(Vuex);

const vm = new Vue;

export default {
    state: {
        current: null,
        items: [],
    },
    getters: {
        currentCategory(state) {
            return state.current != null ? state.items[state.current] : {}
        }
    },
    actions: {
        [SET_CATEGORY]({ commit }, index) {
            commit(SET_CATEGORY, index);
        },
        [FETCH_CATEGORIES]({ commit }) {
            vm.$http.get('api/category')
                .then(response => commit(FETCH_CATEGORIES, response.data))
                .catch(error => console.error(error));
        },
    },
    mutations: {
        [SET_CATEGORY](state, index) {
            state.current = index;
        },
        [FETCH_CATEGORIES](state, categories) {
            state.items = categories;
        },
    },
}