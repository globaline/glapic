<template>
    <div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-md-6">{{ trans('home.pictures')  }}</div>
                    <div class="col-xs-6 text-right">
                        <button type="button" class="btn btn-xs btn-default btn-ghost" @click="showUploader" :disabled="album==null">
                            <i class="glyphicon glyphicon-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div v-if="album==null" class="col-md-12">
                        {{ trans('home.no_picture') }}
                    </div>
                    <template v-else>
                        <div v-for="(picture, index) in pictures" class="col-xs-12 col-sm-6 col-md-3">
                            <div class="thumbnail">
                                <img v-if="!!picture.storage_path" :src="picture.storage_path" :alt="picture.filename">
                                <div class="caption">
                                    <p>{{ picture.filename }}</p>
                                    <div class="btn-group btn-group-justified" role="group" :aria-label="picture.id">
                                        <div class="btn-group btn-group-sm" role="group">
                                            <button type="button" class="btn btn-danger" @click="confirmDestroy(index)">
                                                <i class="glyphicon glyphicon-trash"></i>&nbsp;
                                                {{ trans('home.delete') }}
                                            </button>
                                        </div>
                                        <div class="btn-group btn-group-sm" role="group">
                                            <button type="button" class="btn btn-primary"
                                                @click="editPictureInfo(index)">
                                                <i class="glyphicon glyphicon-edit"></i>&nbsp;
                                                {{ trans('home.edit') }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <modal id="deleteModal" :title="modal.delete.title" ref="deleteModal"
               @ok="destroy(modal.delete.currentIndex)" :okHide="true" okColor="danger" :okText="trans('home.delete')"
                :cancelText="trans('home.cancel')">
            <p>
                {{ modal.delete.message }}
            </p>
        </modal>

        <modal id="editModal" :title="modal.edit.title" ref="editModal"
            @ok="update(modal.edit.currentIndex)" :okHide="true" okColor="success" :okText="trans('home.update')"
               :cancelText="trans('home.cancel')">
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label>{{ trans('home.file_name') }}</label>
                        <div class="input-group">
                            <input type="text" class="form-control" v-model="modal.edit.file_name">
                            <div class="input-group-addon">{{ modal.edit.extension }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </modal>

        <uploader ref="uploader" :album="album" @success="uploaded"></uploader>
    </div>
</template>

<script>
    import UploaderComponent from './Uploader.vue'

    export default {
        props: ['album'],
        data() {
            return {
                pictures: {},
                modal: {
                    delete: {
                        title: "",
                        message: "",
                        currentIndex: null,
                    },
                    edit: {
                        title: "",
                        currentIndex: null,
                        file_name: "",
                        extension: ""
                    }
                }
            }
        },
        watch: {
            album() {
                this.fetchPictures();
            }
        },
        mounted() {
            this.fetchPictures();
        },
        methods: {
            sort() {
                this.pictures.sort(function(a, b){
                    var numA = parseInt(a.filename.match(/([\d]+)[^\d]+$/)[1]);
                    var numB = parseInt(b.filename.match(/([\d]+)[^\d]+$/)[1]);

                    if(numA<numB) return -1;
                    if(numA>numB) return 1;
                    return 0;
                });
            },
            fetchPictures(){
                this.$http.get('api/picture?album=' + this.album)
                .then(response => {
                    this.pictures = JSON.parse(response.data);
                    this.sort();
                });
            },
            destroy(index) {
                this.$http.delete('api/picture/' + this.pictures[index].id)
                .then(response => {
                    this.fetchPictures();
                });
            },
            confirmDestroy(index) {
                var picture = this.pictures[index];
                this.modal.delete = {
                    title: "削除の確認",
                    message: picture.filename + "を削除してもよろしいですか？",
                    currentIndex: index
                }
                this.$refs.deleteModal.show();
            },
            update(index) {
                var picture = $.extend({}, this.pictures[index]);
                var newFileName = this.modal.edit.file_name + this.modal.edit.extension;
                var regExp = new RegExp(picture.filename, "g" );

                picture.storage_path = picture.storage_path.replace(regExp, newFileName);
                picture.filename = newFileName;

                this.$http.put('api/picture/' + picture.id, picture)
                .then(response => {
                    this.fetchPictures();
                });
            },
            editPictureInfo(index) {
                var picture = this.pictures[index];
                var reg = /(.+)(\.[^.]+$)/;
                this.modal.edit = {
                    title: picture.filename + "の情報を編集",
                    currentIndex: index,
                    file_name: picture.filename.match(reg)[1],
                    extension: picture.filename.match(reg)[2]
                }
                this.$refs.editModal.show();
            },
            showUploader() {
                this.$refs.uploader.show();
            },
            uploaded() {
                this.fetchPictures();
            }

        },
        components:{
            'uploader': UploaderComponent
        },

    }
</script>
