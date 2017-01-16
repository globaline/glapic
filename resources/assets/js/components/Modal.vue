<template>
    <div :id="id" class="modal fade" role="dialog" :aria-labelledby="id + 'Label'">
        <div class="modal-dialog" :class="[modalSize]" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header"></slot>
                    <h4 class="modal-title">{{ title }}</h4>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button class="btn" @click="cancelCall" :class="[cancelButtonColor]">{{ cancelText }}</button>
                    <button class="btn" @click="okCall" :class="[okButtonColor]">{{ okText }}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        props: {
            size: {
                type: String,
                default: 'default',
            },
            id: {
                type: String,
                default: 'Modal',
            },
            title: {
                type: String,
                default: 'Modal Title'
            },
            okText: {
                type: String,
                default: 'OK'
            },
            okColor: {
                type: String,
                default: 'success'
            },
            okHide: {
                type: Boolean,
                default: false
            },
            cancelText: {
                type: String,
                default: 'Cancel'
            },
            cancelColor: {
                type: String,
                default: 'default'
            },
            cancelHide: {
                type: Boolean,
                default: true
            },
            triggerCancelWhenHide: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return {
                cancelFromButton: false
            }
        },
        computed: {
            modalSize: function (){
                return this.size == 'lg' ? 'modal-lg'
                    : this.size == 'sm' ? 'modal-sm'
                    : '';
            },
            okButtonColor: function(){
                var color = this.okColor
                return color == 'warning' ? "btn-warning"
                    : color == 'danger' ? "btn-danger"
                    : color == 'success' ? "btn-success"
                    : color == 'primary' ? "btn-primary"
                    : "btn-default";
            },
            cancelButtonColor: function(){
                var color = this.cancelColor
                return color == 'warning' ? "btn-warning"
                    : color == 'danger' ? "btn-danger"
                    : color == 'success' ? "btn-success"
                    : color == 'primary' ? "btn-primary"
                    : "btn-default";
            },
        },
        mounted() {
            $('#' + this.id).on('hide.bs.modal', () => {
                if(this.triggerCancelWhenHide && !this.cancelFromButton) {
                    this.$emit('cancel');
                    this.cancelFromButton = false;
                }
            });
        },
        methods: {
            show() {
                $('#' + this.id).modal('show');
            },
            hide() {
                $('#' + this.id).modal('hide');
            },
            okCall() {
                this.$emit('ok');
                if(this.okHide) this.hide();
            },
            cancelCall() {
                this.$emit('cancel');
                if(this.cancelHide) {
                    this.cancelFromButton = true;
                    // キャンセル処理の二重トリガー防止
                    this.hide();
                }
            }
        }
    }
</script>
