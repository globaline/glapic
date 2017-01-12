<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <div class="row">
                <div class="col-xs-6">
                    {{ trans('home.categories') }}
                </div>
                <div class="col-xs-6 text-right">
                    <button type="button" class="btn btn-xs btn-default btn-ghost" name="add_album">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="list-group">
            <button v-for="category in parsedCategories" type="button" class="list-group-item"
                    v-bind:class="{ active : category.active }" v-on:click="setCategory(category.id)">
                {{ category.name }}<span class="badge">{{ category.album_count }}</span>
            </button>
        </div>
        <div class="panel-footer text-right">
            <a href="">{{ trans('home.edit') }}</a>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['category'],
        data() {
            return {
                categories : {}
            }
        },
        computed: {
            parsedCategories: function() {
                var categories = this.categories;
                var current = this.$root.$data.category;
                Object.keys(categories).map(function(key, index){
                    categories[key].active = categories[key].id == current;
                });
                return this.$data.categories;
            }
        },
        created: function(){
            this.fetchCategories();
        },
        methods: {
            fetchCategories() {
                var self = this;
                $.get('api/category').then(function(categories){
                    self.categories = JSON.parse(categories);
                });
            },
            setCategory(id) {
                alert('hey');
                this.$root.$data.category = id;
                console.log(id);
            }
        }
    }
</script>
