<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Example Component</div>
                    <ul>
                        <li v-for="category in categories">
                            {{ category.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pains : [{"id":1,"name":"BEFORWARD","created_at":"2017-01-05 10:58:52","updated_at":"2017-01-05 10:58:52","album_count":10}]
            }
        },
        props: ['categories'],
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
