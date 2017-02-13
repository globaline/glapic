<template>
    <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" :dropzoneOptions="option">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="uploadModalLabel">画像ファイルのアップロード</h4>
                </div>
                <div class="modal-body">
                    <button type="button" class="btn btn-success" @click="upload()" :disabled="!numberOfFiles">実行</button>
                    <div v-if="!!message" class="alert alert-success" style="margin-top:10px;">
                        {{ message }}
                    </div>
                </div>
                <div class="modal-footer">
                    <drop-zone url="/api/picture" id="dropzone" ref="uploadDropzone" :showRemoveLink="true" :maxNumberOfFiles="50" :maxFileSizeInMB="16"
                               :autoProcessQueue="false" @vdropzone-success="nextUpload" @vdropzone-file-added="addFile"></drop-zone>
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
        computed: {
            numberOfFiles() {
                return Object.keys(this.files).length
            }
        },
        components:{
            'drop-zone': Dropzone,
        },
        methods: {
            show() {
                this.message = "";
                this.files = {},
                this.numberOfUploaded = 0;
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
                this.numberOfUploaded = this.numberOfFiles;
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
                    this.$refs.uploadDropzone.processQueue();
                } else {
                    this.message = this.numberOfUploaded + '個のファイルをアップロードしました。';
                    this.$emit('success-all');
                    this.$refs.uploadDropzone.removeAllFiles();
                    this.$set(this, 'files', {});
                    this.numberOfUploaded = 0;
                }
            },
            clear(){
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
