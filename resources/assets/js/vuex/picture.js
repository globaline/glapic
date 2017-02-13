import Vuex from 'vuex';
import Vue from 'vue';
import { FETCH_PICTURES, SET_PICTURE_THUMBNAILS, SET_PICTURE_LOADER } from './mutation-types';

Vue.use(Vuex);

const vm = new Vue;

export default {
    state : {
        items: [],
        thumbnails: [],
        loading: false
    },
    actions : {
        [FETCH_PICTURES]({ commit, getters }) {
            if (!Object.keys(getters.currentAlbum).length) return commit(FETCH_PICTURES, []);
            else vm.$http.get('api/picture?album=' + getters.currentAlbum.id)
                .then(response => {
                    let pictures = response.data;
                    commit(SET_PICTURE_LOADER, true);
                    commit(FETCH_PICTURES, pictures);
                    commit(SET_PICTURE_LOADER, false);
                })
                .catch(error => console.error(error));
        },
    },
    mutations : {
        [FETCH_PICTURES](state, pictures) {
            state.items = pictures;
        },
        [SET_PICTURE_THUMBNAILS](state, thumbnails) {
            state.thumbnails = thumbnails;
        },
        [SET_PICTURE_LOADER](state, status) {
            state.loading = status;
        }
    },
}