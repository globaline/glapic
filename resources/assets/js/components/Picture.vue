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
                                <img v-if="!!picture.thumbnail" :src="picture.thumbnail" :alt="picture.filename" @click='setPanorama(index)'>
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
                loading: false,
                thumbnail: {
                    queue: [],
                    timeout: 3000,
                    size: {
                        width: 200,
                        height: 160
                    }
                }
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
                    if (!pictures.length) {
                        this.$set(this, 'pictures', {});
                        return this.loading = false;
                    }
                    this.setThumbnails(pictures, (result) => {
                        this.$set(this, 'pictures', result);
                        this.sort();
                        return this.loading = false;
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
            setThumbnails(pictures, callback) {
                var queue, setCount, thisQueue;

                queue = this.thumbnail.queue;
                setCount = 0;

                queue.push(pictures);
                if(queue.length > 1) queue[queue.length-2].isCurrent = false;
                queue[queue.length-1].isCurrent = true;

                thisQueue = queue[queue.length-1];

                pictures.map((picture, index) => {
                    this.createThumbnail(pictures[index], function(){
                        setCount++;
                        if (setCount == pictures.length && callback != null && thisQueue.isCurrent) {
                            return callback(pictures);
                        }
                    });
                });
            },
            createThumbnail(picture, callback) {
                var img, canvas, ctx, resizeInfo, thumbnail;
                img = new Image();

                picture.thumbnail = null;
                img.onerror = () => {
                    console.error('[createThumbnail] Failed to load ' + picture.filename);
                    picture.error = true;
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTYwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6I2E5NDQ0Mjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPuOCouOCu+ODg+ODiCAxPC90aXRsZT48ZyBpZD0i44Os44Kk44Ok44O8XzIiIGRhdGEtbmFtZT0i44Os44Kk44Ok44O8IDIiPjxnIGlkPSLjg6zjgqTjg6Tjg7xfMS0yIiBkYXRhLW5hbWU9IuODrOOCpOODpOODvCAxIj48cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjUuMzEsNzIuMjZoOS41djIuNTdoLTYuNHYzLjU4aDUuNDRWODFINjguNDF2NC4xNEg3NXYyLjU5SDY1LjMxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTg2LjYsODcuNzRsLTMuMTgtNS44Nkg4MS4yN3Y1Ljg2aC0zLjFWNzIuMjZoNS40YzMuMjQsMCw1LjgyLDEuMTMsNS44Miw0LjY5YTQuNDMsNC40MywwLDAsMS0yLjk1LDQuNDZsMy42Miw2LjM0Wm0tNS4zMy04LjNoMmMyLDAsMy4wOC0uODQsMy4wOC0yLjQ5cy0xLjA5LTIuMjQtMy4wOC0yLjI0aC0yWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEwMC44Nyw4Ny43NGwtMy4xOC01Ljg2SDk1LjUzdjUuODZoLTMuMVY3Mi4yNmg1LjRjMy4yNCwwLDUuODIsMS4xMyw1LjgyLDQuNjlhNC40Myw0LjQzLDAsMCwxLTIuOTUsNC40NmwzLjYyLDYuMzRabS01LjMzLTguM2gyYzIsMCwzLjA4LS44NCwzLjA4LTIuNDlzLTEuMDktMi4yNC0zLjA4LTIuMjRoLTJaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTA1LjkzLDc5Ljk0YzAtNSwyLjgyLTgsNi45Mi04czYuOTIsMi45NSw2LjkyLDhTMTE3LDg4LDExMi44NSw4OCwxMDUuOTMsODUsMTA1LjkzLDc5Ljk0Wm0xMC42OSwwYzAtMy4zMy0xLjQ2LTUuMzEtMy43Ny01LjMxcy0zLjc3LDItMy43Nyw1LjMxLDEuNDYsNS40MiwzLjc3LDUuNDJTMTE2LjYyLDgzLjI0LDExNi42Miw3OS45NFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMzEuMjQsODcuNzRsLTMuMTgtNS44NkgxMjUuOXY1Ljg2aC0zLjFWNzIuMjZoNS40YzMuMjQsMCw1LjgyLDEuMTMsNS44Miw0LjY5YTQuNDMsNC40MywwLDAsMS0yLjk1LDQuNDZsMy42Miw2LjM0Wm0tNS4zMy04LjNoMmMyLDAsMy4wOC0uODQsMy4wOC0yLjQ5cy0xLjA5LTIuMjQtMy4wOC0yLjI0aC0yWiIvPjwvZz48L2c+PC9zdmc+';
                }
                setTimeout(function() {
                    if(picture.thumbnail == null && !picture.error){
                        console.error('[createThumbnail] Timeout to load ' + picture.filename);
                        img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTYwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6I2E5NDQ0Mjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPuOCouOCu+ODg+ODiCA0PC90aXRsZT48ZyBpZD0i44Os44Kk44Ok44O8XzIiIGRhdGEtbmFtZT0i44Os44Kk44Ok44O8IDIiPjxnIGlkPSLjg6zjgqTjg6Tjg7xfMS0yIiBkYXRhLW5hbWU9IuODrOOCpOODpOODvCAxIj48cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTQuMDYsNzQuNzRINDkuNjRWNzIuMTNoMTJ2Mi42Mkg1Ny4yMVY4Ny44N0g1NC4wNloiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik02NC4yMyw3Mi4xM2gzLjE1Vjg3Ljg3SDY0LjIzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTcxLjI1LDcyLjEzaDMuNDlsMi42OCw3LjM2Yy4zNCwxLC42NCwyLDEsM2guMTFjLjM0LTEsLjYyLTIuMDYsMS0zbDIuNjItNy4zNmgzLjQ5Vjg3Ljg3SDgyLjY3VjgxLjNjMC0xLjQ5LjIzLTMuNjguMzgtNS4xN0g4M2wtMS4yOCwzLjctMi40Myw2LjYySDc3LjQ2TDc1LDc5LjgzbC0xLjI2LTMuN2gtLjA5Yy4xNSwxLjQ5LjQsMy42OC40LDUuMTd2Ni41N0g3MS4yNVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik04OS40Miw3Mi4xM2g5LjY2djIuNjJIOTIuNTd2My42NEg5OC4xVjgxSDkyLjU3djQuMjFoNi43NHYyLjY0SDg5LjQyWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEwNi41NCw3OS45NGMwLTUuMTMsMi44Ny04LjExLDctOC4xMXM3LDMsNyw4LjExLTIuODcsOC4yMy03LDguMjNTMTA2LjU0LDg1LDEwNi41NCw3OS45NFptMTAuODcsMGMwLTMuMzgtMS40OS01LjQtMy44My01LjRzLTMuODMsMi0zLjgzLDUuNCwxLjQ5LDUuNTEsMy44Myw1LjUxUzExNy40MSw4My4zLDExNy40MSw3OS45NFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMjMuNjIsODAuNzlWNzIuMTNoMy4xNXY4Ljk0YzAsMy4yOCwxLjEzLDQuMzgsMyw0LjM4czMuMDYtMS4xMSwzLjA2LTQuMzhWNzIuMTNoM3Y4LjY2YzAsNS4yMy0yLjIzLDcuMzgtNi4wOSw3LjM4UzEyMy42Miw4NiwxMjMuNjIsODAuNzlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTQyLjc1LDc0Ljc0aC00LjQzVjcyLjEzaDEydjIuNjJIMTQ1LjlWODcuODdoLTMuMTVaIi8+PC9nPjwvZz48L3N2Zz4=';
                    }
                }, this.thumbnail.timeout);

                img.onload = () => {
                    var dx, dy, dw, dh;
                    canvas = document.createElement("canvas");
                    ctx = canvas.getContext("2d");
                    canvas.width = this.thumbnail.size.width;
                    canvas.height = this.thumbnail.size.height;
                    dh = img.width >= img.height ? canvas.height : img.height * canvas.width / img.width;
                    dw = img.width >= img.height ? img.width * canvas.height / img.height : canvas.width;
                    dx = (canvas.width - dw) / 2;
                    dy = (canvas.height - dh) / 2;
                    ctx.drawImage(img, dx, dy, dw, dh);
                    picture.thumbnail = canvas.toDataURL("image/png");
                    if(callback != null) return callback();
                };
                return img.src = picture.storage_path;
            },
            setPanorama(index) {
                $('iframe').attr('src', '/embed/theta?picture=' + this.pictures[index].id);
            }
        },
        components:{
            'uploader': UploaderComponent
        },

    }
</script>
