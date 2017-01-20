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
                        <div v-for="(picture, index) in pictures" class="col-xs-12 col-sm-6 col-md-3">
                            <div class="thumbnail">
                                <img v-if="!!picture.storage_path" :src="picture.thumbnail" :alt="picture.filename">
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
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <div class="thumbnail">
                        <img v-if="!!modal.delete.image" :src="modal.delete.image.storage_path" :alt="modal.delete.image.storage_path">
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
                        image: {}
                    },
                    edit: {
                        title: "",
                        currentIndex: null,
                        file_name: "",
                        extension: ""
                    }
                },
                loading: false
            }
        },
        computed: {
            albumSelected: function(){
                return !Object.keys(this.album).length;
            },
            hasPicture: function(){
                return !Object.keys(this.pictures).length;
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
                this.$http.get('api/picture?album=' + this.album.id)
                .then(response => {
                    this.loading = true;
                    var pictures = JSON.parse(response.data);
                    if (!pictures.length) this.loading = false;
                    this.createThumbnail(pictures, () => {
                        this.$set(this, 'pictures', pictures);
                        this.sort();
                        this.loading = false;
                    });

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
            createThumbnail(pictures, callback) {
                var setCount = 0;
                pictures.map(function(picture, index) {
                    var img, canvas, ctx, resizeInfo, thumbnail;
                    img = new Image();
                    img.onload = () => {
                        var dx, dy, dw, dh;
                        canvas = document.createElement("canvas");
                        ctx = canvas.getContext("2d");
                        canvas.width = 200;
                        canvas.height = 160;
                        dh = img.width >= img.height ? canvas.height : img.height * canvas.width / img.width;
                        dw = img.width >= img.height ? img.width * canvas.height / img.height : canvas.width;
                        dx = (canvas.width - dw) / 2;
                        dy = (canvas.height - dh) / 2;
                        ctx.drawImage(img, dx, dy, dw, dh);
                        pictures[index].thumbnail = canvas.toDataURL("image/png");

                        setCount++;
                        if(setCount == pictures.length) return callback();
                    };
                    img.src = pictures[index].storage_path;
                });
            }

        },
        components:{
            'uploader': UploaderComponent
        },

    }
</script>
