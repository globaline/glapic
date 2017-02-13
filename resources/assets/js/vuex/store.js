import Vue from 'vue';
import Vuex from 'vuex';
import Category from './category';
import Album from './album';
import Picture from './picture';

Vue.use(Vuex);



const modules = {
    category: Category,
    album: Album,
    picture: Picture
};

export default new Vuex.Store({
    modules,
});
