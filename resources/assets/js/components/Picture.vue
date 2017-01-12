<template>
    <div class="panel panel-default">
        <div class="panel-heading">{{ trans('home.pictures')  }}</div>
        <div class="panel-body">
            <div class="row">
                <div v-if="pictures=={}" class="col-md-12">
                    {{ trans('home.no_picture') }}
                </div>
                <template v-else>
                    <div v-for="picture in pictures" class="col-xs-12 col-sm-6 col-md-3">
                        <div class="thumbnail">
                            <img :src="picture.storage_path" :alt="picture.file_name">
                            <div class="caption">
                                <div class="btn-group btn-group-justified" role="group" :aria-label="picture.id">
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button type="button" class="btn btn-danger">
                                            <i class="glyphicon glyphicon-trash"></i>&nbsp;
                                            {{ trans('home.delete') }}
                                        </button>
                                    </div>
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button type="button" class="btn btn-primary">
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
</template>

<script>
    export default {
        props: ['pictures']
    }
</script>
