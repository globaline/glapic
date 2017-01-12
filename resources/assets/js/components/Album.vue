<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <div class="row">
                <div class="col-xs-6">{{ trans('home.albums') }}</div>
                <div class="col-xs-6 text-right">
                    <button type="button" class="btn btn-xs btn-default btn-ghost" name="add_album">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="panel-body">
            <div class="row">
                <div v-if="albums == {}" class="col-md-12">
                    {{ trans('home.no_album') }}
                </div>
                <template v-else>
                <div v-for="album in parsedAlbums" class="col-xs-6 col-sm-4 col-md-2">
                    <a :href="album.href" class="thumbnail" v-bind:class="{ active:album.active }">
                        <img :src="album.thumbnail.storage_path" :alt="album.name">
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
    </div>
</template>

<script>
    export default {
        props: ['albums'],
        computed: {
            parsedAlbums: function() {
                var albums = this.albums;
                var category = this.$root.request.category;
                var current = this.$root.request.album;
                Object.keys(albums).map(function(key, index){
                    albums[key].href = '/?category=' + category + '&album=' + albums[key].id;
                    albums[key].active = albums[key].id == current;
                });
                return albums;
            }
        },
    }
</script>
