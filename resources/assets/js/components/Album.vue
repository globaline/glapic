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
                        <button type="button" class="btn btn-xs btn-default btn-ghost visible-lg-inline-block" :class="{active: fix}" name="fix_panel"
                                @click.stop="fixPanel">
                            <i class="glyphicon glyphicon-pushpin"></i>
                        </button>
                        <button type="button" class="btn btn-xs btn-default btn-ghost" name="add_album"
                                @click.stop="newAlbum" :disabled="!categorySelected">
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
                        <a class="thumbnail" :class="{ active: isCurrent(album.id) }"
                           @click="setAlbum(index)" style="cursor: pointer">
                            <img v-if="!!album.thumbnail" :src="album.thumbnail" :alt="album.name">
                            <div class="caption">
                                <p>{{ album.name }}</p>
　                          </div>
                        </a>
                    </div>
                    </template>
                </div>
            </div>
            <div class="panel-footer text-right" v-if="expand">
                <button class="btn btn-default btn-ghost btn-sm" @click="setMode('edit')">{{ trans('home.edit') }}</button>
            </div>
        </div>
        <modal id="addNewAlbumModal" title="アルバムの新規作成" ref="addNewAlbumModal"
               @ok="store()" :okHide="true" okColor="primary" :okText="trans('home.add')"
               :cancelText="trans('home.cancel')">
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label>アルバム名</label>
                        <input type="text" class="form-control" v-model="modal.add.name">
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    export default {
        props: ['category', 'current'],
        data() {
            return {
                albums: {},
                modal: {
                    add: {
                        name: "",
                        category_id: this.category.id,
                    }
                },
                expand: true,
                fix: false,
                mode: 'default',
            }
        },
        computed: {
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
                var album = {};
                this.$emit('set', album);
                this.expandWindow(true);
            },
            expand() {
                if (this.fix) this.expand = true;
            }
        },
        mounted() {
            this.fetchAlbums();
        },
        methods: {
            fetchAlbums() {
                this.$http.get('api/album?category=' + this.category.id)
                .then(response => {
                    this.albums = JSON.parse(response.data);
                });
            },
            setAlbum(index) {
                var album = this.albums[index];
                this.$emit('set', album);
                this.expandWindow(false);
            },
            isCurrent(id) {
                return this.current.id == id;
            },
            newAlbum() {
                this.modal.add = {
                        name: "",
                        category_id: this.category.id,
                };
                this.$refs.addNewAlbumModal.show();
            },
            store() {
                this.$http.post('api/album', this.modal.add)
                .then(response => {
                    this.fetchAlbums();
                });
            },
            expandWindow(expand) {
                this.expand = expand;
            },
            toggleWindow() {
                this.expandWindow(!this.expand);
            },
            fixPanel() {
                this.fix = !this.fix;
                if(this.fix) this.expand = true;
            },
            setMode(mode) {
                this.mode = mode;
            }
        }
    }
</script>
