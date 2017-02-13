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
                        <button class="btn btn-default btn-ghost btn-xs" @click.stop="edit();" :disabled="!categorySelected">
                            <template v-if="editMode">完了</template>
                            <template v-else>{{ trans('home.edit') }}</template>
                        </button>
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
                    <div v-for="(album, index) in albums" class="col-xs-6 col-sm-4 col-lg-3">
                        <div v-if="editMode" class="thumbnail">
                            <img v-if="!!album.thumbnail_path" :src="album.thumbnail_path" :alt="album.name">
                            <div class="input-group">
                                <input class="form-control" type="text" v-model="albums_local[index].name" :readonly="!albums_local[index].editable">
                                <span v-if="!albums_local[index].editable" class="input-group-btn">
                                    <button class="btn btn-primary" type="button" @click="editName(index)">
                                        <i class="glyphicon glyphicon-pencil"></i>
                                    </button>
                                    <button class="btn btn-danger" type="button" @click="confirmDestroy(index)">
                                        <i class="glyphicon glyphicon-trash"></i>
                                    </button>
                                </span>
                                <span v-else class="input-group-btn">
                                    <button class="btn btn-success" type="button" @click="update(index)">
                                        <i class="glyphicon glyphicon-ok"></i>
                                    </button>
                                    <button class="btn btn-danger" type="button" @click="cancel(index)">
                                        <i class="glyphicon glyphicon-remove"></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                        <a v-else class="thumbnail" :class="{ active: isCurrent(album.id) }"
                           @click="setAlbum(index)" style="cursor: pointer">
                            <img v-if="!!album.thumbnail_path" :src="album.thumbnail_path" :alt="album.name">
                            <div class="caption">
                                <p>{{ album.name }}</p>
                            </div>
                        </a>
                    </div>
                    </template>
                </div>
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
        <modal id="removeModal" title="削除確認" ref="removeModal"
               @ok="destroy(modal.delete.index)" :okHide="true" okColor="danger" :okText="trans('home.delete')"
               :cancelText="trans('home.cancel')">
            <div class="row">
                <div class="col-md-12">
                    <p>アルバム"{{ modal.delete.album.name }}"を削除してもよろしいですか？</p>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import { SET_ALBUM, FETCH_ALBUMS, STORE_ALBUM, UPDATE_ALBUM, DESTROY_ALBUM } from '../vuex/mutation-types';

    export default {
        data() {
            return {
                albums_local: [],
                modal: {
                    create: {
                        name: "",
                        category_id: null,
                    },
                    delete: {
                        index: null,
                        album: {}
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
                this.editMode = false;
                this.setAlbum(null);
                this.fetchAlbums();
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
            loadingEditor() {
                let albums = [];
                this.albums.map((album, index) => {
                    albums[index] = Object.assign({'editable': false}, album);
                });
                this.$set(this, 'albums_local', albums);
            },
            edit() {
                if(!this.editMode) this.loadingEditor();
                this.editMode = !this.editMode;
            },
            editName(index) {
                this.albums_local[index].editable = true;
            },
            update(index) {
                let album = Object.assign({}, this.albums_local[index]);
                this.$store.dispatch(UPDATE_ALBUM, album, index)
                    .then(() => {
                        this.albums_local[index].editable = false;
                    });
            },
            cancel(index) {
                this.albums_local[index].name = this.$store.state.album.items[index].name;
                this.albums_local[index].editable = false;
            },
            confirmDestroy(index) {
                this.$set(this.modal, 'delete', {
                    index: index,
                    album: Object.assign({}, this.albums_local[index])
                });
                this.$refs.removeModal.show();
            },
            destroy(index) {
                this.$store.dispatch(DESTROY_ALBUM, index)
                    .then(() => {
                        // TODO: 反映されない
                        this.loadingEditor();
                    });
            },
            create() {
                this.modal.create = {
                        name: "",
                        category_id: this.category.id,
                };
                this.$refs.createModal.show();
            },
            store() {
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
