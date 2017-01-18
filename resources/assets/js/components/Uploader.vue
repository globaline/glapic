<template>
    <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" :dropzoneOptions="option">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="uploadModalLabel">画像ファイルのアップロード</h4>
                </div>
                <div class="modal-body">
                    <button type="button" class="btn btn-default" data-dismiss="modal" @click="cancel()">キャンセル</button>
                    <button type="button" class="btn btn-success" @click="upload()">アップロード</button>
                    <br>
                    <div v-if="!!message" class="alert alert-success">
                        {{ message }}
                    </div>
                </div>
                <div class="modal-footer">
                    <drop-zone url="/api/picture" id="dropzone" ref="uploadDropzone" :showRemoveLink="false" :maxNumberOfFiles="50" :maxFileSizeInMB="4"
                               :autoProcessQueue="false" @vdropzone-success="nextUpload" @vdropzone-fileAdded="addFile"></drop-zone>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Dropzone from 'vue2-dropzone'
    export default{
        props: ['album', 'clearWhenCancel'],
        data(){
            return {
                message: "",
                files: {},
                numberOfUploaded: 0
            }
        },
        components:{
            'drop-zone': Dropzone
        },
        methods: {
            show() {
                $('#uploadModal').modal('show');
            },
            request(file, xhr, formData) {
                formData.append('album', this.album);
            },
            cancel() {
                this.$emit('cancel');
                if (this.clearWhenCancel) this.clear();
            },
            upload(){
                this.numberOfUploaded = Object.keys(this.files).length;
                this.$refs.uploadDropzone.processQueue();
            },
            addFile(file) {
                this.$set(this.files, file.name, file);
            },
            nextUpload(file, response) {
                this.$delete(this.files, file.name);
                var file_count = Object.keys(this.files).length;

                if(file_count != 0) {
                    this.$emit('success');
                    this.upload();
                } else {
                    this.message = this.numberOfUploaded + '個のファイルをアップロードしました。';
                    this.$emit('success-all');
                }
            },
            clear(){
                this.$refs.uploadDropzone.removeAllFiles();
                this.this.numberOfUploaded = 0;
                this.message = "";
            }
        },
        mounted() {
            // 何故かイベントリスナーが登録されてなかった・・・
            dropzone.dropzone.on('sending', (e, i, n) => {
                this.request(e, i, n);
            });
        }
    }
</script>
