<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-2">
                <category></category>
            </div>
            <div class="col-lg-10">
                <album></album>
                <picture></picture>
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
                categories: {},
                albums: {},
            }
        },
        components:{
            'category': CategoryComponent,
            'album': AlbumComponent,
            'picture': PictureComponent
        },
        methods: {
            fetchCategories: () => {
                this.$http.get('/api/category').then((response) => {

                });
            }
        }
    }
</script>
