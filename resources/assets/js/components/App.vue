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
    import CategoryComponent from './Category.vue'
    import AlbumComponent from './Album.vue'
    import PictureComponent from './Picture.vue'

    export default{
        data: () => {
            return{
                category: {},
                album: {},
            }
        },
        components:{
            'category': CategoryComponent,
            'album': AlbumComponent,
            'picture': PictureComponent
        },
        methods: {
            setCategory(category) {
                this.$set(this, 'category', category);
            },
            setAlbum(album) {
                this.$set(this, 'album', album);
            },
            alert(message) {
                alert(message);
            }
        },
    }
</script>
