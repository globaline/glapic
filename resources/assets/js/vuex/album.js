import Vuex from 'vuex';
import Vue from 'vue';
import { SET_ALBUM, FETCH_ALBUMS, SET_ALBUM_THUMBNAILS, STORE_ALBUM } from './mutation-types';
import thumbnailGenerator from './thumbnail';

Vue.use(Vuex);

const vm = new Vue;
const tg = new thumbnailGenerator({
    size: {
        width: 320,
        height: 240
    }
});

export default {
    state: {
        current: null,
        thumbnails: [],
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
        [STORE_ALBUM]({dispatch}, album){
            vm.$http.post('api/album', album)
                .then(response => {
                    dispatch(FETCH_ALBUMS);
                });
        },
        [FETCH_ALBUMS]({commit, getters}) {
            vm.$http.get('api/album?category=' + getters.currentCategory.id)
                .then(response => {
                    if (!Object.keys(getters.currentCategory).length) return;
                    let albums = JSON.parse(response.data);
                    tg.setPictures(albums, 'thumbnail');
                    tg.generate()
                        .then(thumbnails => {
                            commit(SET_ALBUM_THUMBNAILS, thumbnails);
                            commit(FETCH_ALBUMS, albums)
                        });
                })
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
        [SET_ALBUM_THUMBNAILS](state, thumbnails) {
            state.thumbnails = thumbnails;
        },
    }
}