<template>
    <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" :dropzoneOptions="option">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="uploadModalLabel">画像ファイルのアップロード</h4>
                </div>
                <div class="modal-body">
                    <drop-zone url="/api/picture" id="dropzone" ref="uploadDropzone" :autoProcessQueue="false" @vdropzone-success="success()"></drop-zone>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal" @click="cancel()">キャンセル</button>
                    <button type="button" class="btn btn-success" @click="upload()">完了</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Dropzone from 'vue2-dropzone'
    export default{
        props: ['album'],
        components:{
            'drop-zone': Dropzone
        },
        methods: {
            show() {
                $('#uploadModal').modal('show');
            },
            request(file, xhr, formData) {
                formData.append('album', 2);
            },
            cancel() {
            },
            upload(){
                this.$refs.uploadDropzone.processQueue();
            },
            success() {
                console.log('success');
            }
        },
        mounted() {
            // 何故かイベントリスナーが登録されてなかった・・・
            var that = this;
            dropzone.dropzone.on('sending', function(e, i, n){
                that.request(e, i, n);
            });
        }
    }
</script>
