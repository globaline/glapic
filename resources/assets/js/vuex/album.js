import Vuex from 'vuex';
import Vue from 'vue';
import { SET_ALBUM, FETCH_ALBUMS } from './mutation-types';

Vue.use(Vuex);

const vm = new Vue;

export default {
    state: {
        current: null,
        items: []
    },
    getters: {
        currentAlbum(state) {
            return state.current != null ? state.items[state.current] : {}
        }
    },
    actions: {
        [SET_ALBUM]({commit}, index) {
            commit(SET_ALBUM, index);
        },
        [FETCH_ALBUMS]({commit, getters}) {
            vm.$http.get('api/album?category=' + getters.currentCategory.id)
                .then(response => commit(FETCH_ALBUMS, JSON.parse(response.data)))
                .catch(error => console.error(error));
        },
    },
    mutations: {
        [SET_ALBUM](state, index) {
            state.current = index;
        },
        [FETCH_ALBUMS](state, albums) {
            state.items = albums;
        },
    }
}