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
            <button v-for="(category, index) in categories" type="button" class="list-group-item"
                    v-bind:class="{ active : isCurrent(category.id) }" v-on:click="setCategory(index)">
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
        props: ['current'],
        data() {
            return {
                categories : {}
            }
        },
        mounted() {
            this.fetchCategories();
        },
        methods: {
            fetchCategories() {
                this.$http.get('api/category')
                .then(response => {
                    this.categories = JSON.parse(response.data);
                });
            },
            setCategory(index) {
                var category = this.categories[index];
                this.$emit('set', category);
            },
            isCurrent(id) {
                return this.current.id == id;
            }
        }
    }
</script>
