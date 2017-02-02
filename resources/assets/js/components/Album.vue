<template>
    <div>
        <div class="panel panel-default">
            <div class="panel-heading" @click="toggleWindow()">
                <div class="row">
                    <div class="col-xs-8">
                        <i class="glyphicon glyphicon hidden-lg" :class="{'glyphicon-menu-up': expand,  'glyphicon-menu-down': !expand}" style="margin-right: 0.5rem;"></i>
                        {{ trans('home.albums') }}<span v-if="albumSelected"> - {{ current.name }}</span>
                    </div>
                    <div class="col-xs-4 text-right">
                        <button type="button" class="btn btn-xs btn-default btn-ghost visible-lg-inline-block" :class="{active: fixed}" name="fixed_panel"
                                @click.stop="fixedPanel">
                            <i class="glyphicon glyphicon-pushpin"></i>
                        </button>
                        <button type="button" class="btn btn-xs btn-default btn-ghost" name="add_album"
                                @click.stop="create" :disabled="!categorySelected">
                            <i class="glyphicon glyphicon-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="panel-body" v-if="expand">
                <div class="row">
                    <div v-if="!categorySelected" class="col-md-12">
                        {{ trans('home.no_album') }}
                    </div>
    　              <template v-else>
                    <div v-for="(album, index) in albums" class="col-xs-6 col-sm-4 col-md-2">
                        <div v-if="editMode" class="thumbnail">
                            <img v-if="!!thumbnails[index]" :src="thumbnails[index]" :alt="album.name">
                            <input class="form-control" type="text" v-model="album.name">
                        </div>
                        <a v-else class="thumbnail" :class="{ active: isCurrent(album.id) }"
                           @click="setAlbum(index)" style="cursor: pointer">
                            <img v-if="!!thumbnails[index]" :src="thumbnails[index]" :alt="album.name">
                            <div class="caption">
                                <p>{{ album.name }}</p>
                            </div>
                        </a>
                    </div>
                    </template>
                </div>
            </div>
            <div class="panel-footer text-right" v-if="expand">
                <button class="btn btn-default btn-ghost btn-sm" @click="edit();">
                    <template v-if="editMode">完了</template>
                    <template v-else>{{ trans('home.edit') }}</template>
                </button>
            </div>
        </div>
        <modal id="createModal" title="アルバムの新規作成" ref="createModal"
               @ok="store()" :okHide="true" okColor="primary" :okText="trans('home.add')"
               :cancelText="trans('home.cancel')">
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label>アルバム名</label>
                        <input type="text" class="form-control" v-model="modal.create.name">
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import { SET_ALBUM, FETCH_ALBUMS, STORE_ALBUM } from '../vuex/mutation-types';

    export default {
        data() {
            return {
                modal: {
                    create: {
                        name: "",
                        category_id: null,
                    }
                },
                expand: true,
                fixed: false,
                editMode: false,
            }
        },
        computed: {
            albums() {
                return this.$store.state.album.items;
            },
            thumbnails() {
                return this.$store.state.album.thumbnails;
            },
            current() {
                return this.$store.getters.currentAlbum;
            },
            category() {
                return this.$store.getters.currentCategory;
            },
            categorySelected() {
                return !!Object.keys(this.category).length;
            },
            albumSelected() {
                return !!Object.keys(this.current).length;
            }
        },
        watch: {
            category() {
                this.fetchAlbums();
                this.setAlbum(null);
                this.expandWindow(true);
            },
            expand() {
                if (this.fixed) this.expand = true;
            }
        },
        mounted() {
            this.fetchAlbums();
        },
        methods: {
            fetchAlbums() {
                this.$store.dispatch(FETCH_ALBUMS);
            },
            setAlbum(index) {
                this.$store.dispatch(SET_ALBUM, index);
                this.expandWindow(false);
            },
            edit() {
                this.editMode = !this.editMode;
            },
            create() {
                this.modal.create = {
                        name: "",
                        category_id: this.category.id,
                };
                this.$refs.createModal.show();
            },
            store() {
                /*this.$http.post('api/album', this.modal.create)
                .then(response => {
                    this.fetchAlbums();
                });*/
                this.$store.dispatch(STORE_ALBUM, this.modal.create);
            },
            isCurrent(id) {
                return this.current.id == id;
            },
            expandWindow(expand) {
                this.expand = expand;
            },
            toggleWindow() {
                this.expandWindow(!this.expand);
            },
            fixedPanel() {
                this.fixed = !this.fixed;
                if(this.fixed) this.expand = true;
            },
        }
    }
</script>
