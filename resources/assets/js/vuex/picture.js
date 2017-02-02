import Vuex from 'vuex';
import Vue from 'vue';
import { FETCH_PICTURES, SET_PICTURE_THUMBNAILS, SET_PICTURE_LOADER } from './mutation-types';
import thumbnailGenerator from './thumbnail';

Vue.use(Vuex);

const vm = new Vue;
const tg = new thumbnailGenerator({
    size: {
        width: 678,
        height: 542
    }
});

export default {
    state : {
        items: [],
        thumbnails: [],
        loading: false
    },
    actions : {
        [FETCH_PICTURES]({ commit, getters }) {
            if (!Object.keys(getters.currentAlbum).length) return;
            vm.$http.get('api/picture?album=' + getters.currentAlbum.id)
                .then(response => {
                    let pictures = JSON.parse(response.data);
                    if (Object.keys(pictures).length) commit(SET_PICTURE_LOADER, true);
                    tg.setPictures(pictures);
                    tg.generate()
                        .then((thumbnails) => {
                            commit(SET_PICTURE_THUMBNAILS, thumbnails);
                            commit(FETCH_PICTURES, pictures);
                            commit(SET_PICTURE_LOADER, false);
                        })
                        .catch(error => console.error(error))
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