<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-2">
                <category @set="setCategory" :current="category"></category>
            </div>
            <div class="col-lg-10">
                <album @set="setAlbum" :category="category" :current="album"></album>
                <picture :album="album"></picture>
            </div>
        </div>
    </div>
</template>

<script>
    import CategoryComponent from './category.vue'
    import AlbumComponent from './album.vue'
    import PictureComponent from './picture.vue'

    export default{
        data: () => {
            return{
                category: null,
                album: null,
            }
        },
        components:{
            'category': CategoryComponent,
            'album': AlbumComponent,
            'picture': PictureComponent
        },
        methods: {
            setCategory(id) {
                this.$set(this, 'category', id);
            },
            setAlbum(id) {
                this.$set(this, 'album', id);
            },
            alert(message) {
                alert(message);
            }
        },
    }
</script>
