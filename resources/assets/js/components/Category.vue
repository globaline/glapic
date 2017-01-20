<template>
    <div class="panel panel-default">
        <div class="panel-heading" @click="toggleWindow()">
            <div class="row">
                <div class="col-xs-8">
                    <i class="glyphicon glyphicon hidden-lg" :class="{'glyphicon-menu-up': expand,  'glyphicon-menu-down': !expand}" style="margin-right: 0.5rem;"></i>
                    {{ trans('home.categories') }}<span v-if="categorySelected" class="hidden-lg" > - {{ current.name }}</span>
                </div>
                <div class="col-xs-4 text-right">
                    <button type="button" class="btn btn-xs btn-default btn-ghost" name="add_category"
                            @click.stop="">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="list-group" :class="{'hidden-sm hidden-xs hidden-md': !expand}">
            <button v-for="(category, index) in categories" type="button" class="list-group-item"
                    :class="{ active : isCurrent(category.id) }" @click="setCategory(index)">
                {{ category.name }}<span class="badge">{{ category.album_count }}</span>
            </button>
        </div>
        <div class="panel-footer text-right" :class="{'hidden-sm hidden-xs hidden-md': !expand}">
            <a href="">{{ trans('home.edit') }}</a>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['current'],
        data() {
            return {
                categories : {},
                expand :true
            }
        },
        computed: {
            categorySelected() {
                return !!Object.keys(this.current).length;
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
                this.expandWindow(false);
            },
            expandWindow(expand) {
                this.expand = expand;
            },
            toggleWindow() {
                this.expandWindow(!this.expand);
            },
            isCurrent(id) {
                return this.current.id == id;
            }
        }
    }
</script>
