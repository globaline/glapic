<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <div class="row">
                <div class="col-xs-6">{{ trans('home.albums') }}</div>
                <div class="col-xs-6 text-right">
                    <button type="button" class="btn btn-xs btn-default btn-ghost" name="add_album"
                            @click="newAlbum" :disabled="category == null">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="panel-body">
            <div class="row">
                <div v-if="category == null" class="col-md-12">
                    {{ trans('home.no_album') }}
                </div>
                <template v-else>
                <div v-for="album in albums" class="col-xs-6 col-sm-4 col-md-2">
                    <a class="thumbnail" :class="{ active: isCurrent(album.id) }"
                       @click="setAlbum(album.id)" style="cursor: pointer">
                        <img :src="album.thumbnail" :alt="album.name">
                        <div class="caption">
                            {{ album.name }}
                        </div>
                    </a>
                </div>
                </template>
            </div>
        </div>
        <div class="panel-footer text-right">
            <a href="">{{ trans('home.edit') }}</a>
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
                        category_id: this.category,
                    }
                }
            }
        },
        watch: {
            category() {
                this.fetchAlbums();
            }
        },
        mounted() {
            this.fetchAlbums();
        },
        methods: {
            fetchAlbums() {
                this.$http.get('api/album?category=' + this.category)
                .then(response => {
                    this.albums = JSON.parse(response.data);
                });
            },
            setAlbum(id) {
                this.$emit('set', id);
            },
            isCurrent(id) {
                return this.current == id;
            },
            newAlbum() {
                this.modal.add = {
                        name: "",
                        category_id: this.category,
                };
                this.$refs.addNewAlbumModal.show();
            },
            store() {
                console.log(this.modal.add);
                this.$http.post('api/album', this.modal.add)
                .then(response => {
                    this.fetchAlbums();
                });
            }
        }
    }
</script>
