<template>
    <div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-6">{{ trans('home.pictures')  }}</div>
                    <div class="col-xs-6 text-right">
                        <button type="button" class="btn btn-xs btn-default btn-ghost" @click="showUploader" :disabled="albumSelected">
                            <i class="glyphicon glyphicon-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div v-if="loading" class="loader"></div>
                    <div v-else-if="albumSelected" class="col-md-12">
                        {{ trans('home.no_picture') }}
                    </div>
                    <div v-else-if="hasPicture" class="col-md-12">
                        {{ album.name }}にはまだ写真が追加されていません。
                    </div>
                    <template v-else>
                        <div v-for="(picture, index) in pictures" class="col-xs-12 col-sm-6 col-md-3" style="cursor: pointer" @click="show(index)">
                            <div class="thumbnail">
                                <img v-if="!!picture.thumbnail_path" :src="picture.thumbnail_path" :alt="picture.filename">
                                <div class="caption">
                                    <p>{{ picture.filename }}</p>
                                    <div class="btn-group btn-group-justified" role="group" :aria-label="picture.id">
                                        <div class="btn-group btn-group-sm" role="group">
                                            <button type="button" class="btn btn-danger" @click.stop="confirmDestroy(index)">
                                                <i class="glyphicon glyphicon-trash"></i>&nbsp;
                                                {{ trans('home.delete') }}
                                            </button>
                                        </div>
                                        <div class="btn-group btn-group-sm" role="group">
                                            <button type="button" class="btn btn-primary"
                                                @click.stop="editPictureInfo(index)">
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
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <div class="thumbnail">
                        <img v-if="!!modal.delete.image" :src="modal.delete.image.storage_path" :alt="modal.delete.image.filename">
                    </div>

                </div>
            </div>
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

        <modal id="showModal" ref="showModal" size="lg" title=""
            @ok="show(modal.show.currentIndex)" :okHide="true" okColor="primary" :okText="trans('home.close')" :cancelButton="false">
            <div slot="header">
                <div class="row">
                    <div class="col-xs-8"><h4 class="modal-title">{{ modal.show.title }}</h4></div>
                    <div class="col-xs-4 text-right">
                        <button class="btn btn-ghost btn-default" :class="{active: modal.show.panorama.enable}"
                            @click="togglePanorama()"><i class="glyphicon glyphicon-sunglasses"></i></button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div v-if="modal.show.panorama.loading" class="loader"></div>
                    <div v-if="modal.show.panorama.enable" class="thumbnail" :style="[modal.show.panorama.style]" >
                        <theta :src="modal.show.image.storage_path" :style="{position: 'absolute', top: 0, right: 0}" @loaded="modal.show.panorama.loading=false"></theta>
                    </div>
                    <a v-else-if="!modal.show.panorama.loading" class="thumbnail" :href="modal.show.image.storage_path">
                        <img v-if="!!modal.show.image" :src="modal.show.image.storage_path" :alt="modal.show.image.filename">
                    </a>
                </div>
            </div>
        </modal>

        <uploader ref="uploader" :album="album.id" :clearWhenCancel="true" @success="uploaded"></uploader>
    </div>
</template>

<style>
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(209,209,209, 0.2);
  border-right: 1.1em solid rgba(209,209,209, 0.2);
  border-bottom: 1.1em solid rgba(209,209,209, 0.2);
  border-left: 1.1em solid #d1d1d1;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

<script>
    import UploaderComponent from './Uploader.vue';
    import { FETCH_PICTURES } from '../vuex/mutation-types';

    export default {
        data() {
            return {
                modal: {
                    delete: {
                        title: "",
                        message: "",
                        currentIndex: null,
                        image: {}
                    },
                    edit: {
                        title: "",
                        currentIndex: null,
                        file_name: "",
                        extension: ""
                    },
                    show: {
                        title: "",
                        currentIndex: null,
                        image: {},
                        panorama: {
                            enable: false,
                            style: {
                                height: 0,
                                'padding-bottom': '56.25%',
                                position: 'relative'
                            },
                            loading: false,
                        }
                    }
                },
            }
        },
        computed: {
            pictures() {
                return this.$store.state.picture.items;
            },
            album() {
                return this.$store.getters.currentAlbum;
            },
            thumbnails() {
                return this.$store.state.picture.thumbnails;
            },
            loading: function(){
                return this.$store.state.picture.loading;
            },
            albumSelected: function(){
                return !Object.keys(this.album).length;
            },
            hasPicture: function(){
                return !Object.keys(this.pictures).length;
            },
        },
        watch: {
            album() {
                this.fetchPictures();
            },
        },
        mounted() {
            this.fetchPictures();
        },
        methods: {
            sort() {
                this.pictures.sort(function(a, b){
                    var matchA = a.filename.match(/([\d]+)[^\d]+$/);
                    var matchB = b.filename.match(/([\d]+)[^\d]+$/);

                    var numA = (matchA) ? parseInt(matchA[1]) : 0;
                    var numB = (matchB) ? parseInt(matchB[1]) : 0;

                    if(numA<numB) return -1;
                    if(numA>numB) return 1;

                    return 0;
                });
            },
            fetchPictures(){
                this.$store.dispatch(FETCH_PICTURES)
            },
            show(index) {
                var picture = this.pictures[index];
                this.modal.show.title = picture.filename;
                this.modal.show.currentIndex = index;
                this.modal.show.image = picture;
                this.modal.show.panorama.enable = false;
                this.$refs.showModal.show();
            },
            togglePanorama() {
                this.modal.show.panorama.loading = !this.modal.show.panorama.enable;
                setTimeout(() => {
                    this.modal.show.panorama.enable = !this.modal.show.panorama.enable;
                }, 30);
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
                    currentIndex: index,
                    image: picture
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
            },
        },
        components:{
            'uploader': UploaderComponent
        },

    }
</script>
