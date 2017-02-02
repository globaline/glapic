import Vuex from 'vuex';
import Vue from 'vue';
import { SET_ALBUM, FETCH_ALBUMS, SET_ALBUM_THUMBNAILS, STORE_ALBUM, UPDATE_ALBUM, DESTROY_ALBUM } from './mutation-types';
import thumbnailGenerator from './thumbnail';

Vue.use(Vuex);

const vm = new Vue;
const tg = new thumbnailGenerator({
    size: {
        width: 348,
        height: 261
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
        [UPDATE_ALBUM]({commit}, album, index) {
            vm.$http.put('api/album/' + album.id, album)
                .then(response => {
                    commit(UPDATE_ALBUM, album, index);
                });
        },
        [DESTROY_ALBUM]({commit, state, dispatch}, index) {
            vm.$http.delete('api/album/' + state.items[index].id)
                .then(response => {
                    commit(DESTROY_ALBUM, index);
                });
        },
        [FETCH_ALBUMS]({commit, getters}) {
            vm.$http.get('api/album?category=' + getters.currentCategory.id)
                .then(response => {
                    if (!Object.keys(getters.currentCategory).length) return;
                    let albums = JSON.parse(response.data);
                    if (!Object.keys(albums).length) commit(FETCH_ALBUMS, []);
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
        [UPDATE_ALBUM](state, album, index) {
            state.items[index] = album;
        },
        [DESTROY_ALBUM](state, index) {
            state.items.splice(index, 1);
        }
    }
}