<template>
    <div id="stage" :style="[stageStyle]"></div>
</template>

<script>
    var THREE = require('three');
    var OrbitControls = require('three-orbit-controls')(THREE);

    export default{
        props: {
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '100%'
            },
            src: {
                type: String,
                default: ""
            },
            style: {
                type: Object,
                default: function(){
                    return {};
                }
            }
        },
        data(){
            return{
                size: {
                    width: null,
                    height: null
                },
                scence: null,
                geometry: null,
                material: null,
                camera: null,
                axis: null,
                sphere: null,
                renderer: null,
                controls: null,
            }
        },
        computed: {
            stageStyle() {
                var baseStyle = {
                    width: this.width,
                    height: this.height,
                    overflow: 'hidden',
                };

                return $.extend(baseStyle, this.style);
            },
        },
        watch: {
            width(newWidth) {
                this.stageStyle.width = newWidth;
                this.size.width = newWidth;
            },
            height(newHeight) {
                this.stageStyle.width = newWidth;
                this.size.height = newHeight;
            },
            size:{
                handler: function() {
                    this.resize();
                },
                deep: true
            }
        },
        created: function () {
            window.addEventListener('resize', this.handleResize);
            this.$emit('beforeLoad');
        },
        beforeDestroy: function () {
            window.removeEventListener('resize', this.handleResize);
        },
        mounted() {
            this.size.width=$('#stage').width();
            this.size.height=$('#stage').height();

            //scene

            this.scene = new THREE.Scene();

            //mesh

            this.geometry = new THREE.SphereGeometry( 5, 60, 40 );
            this.geometry.scale( - 1, 1, 1 );

            this.material = new THREE.MeshBasicMaterial( {
                map: THREE.ImageUtils.loadTexture(this.src)
            } );

            this.sphere = new THREE.Mesh( this.geometry, this.material );
            this.scene.add( this.sphere );

            //camera

            this.camera = new THREE.PerspectiveCamera(75, this.size.width / this.size.height, 1, 1000);
            this.camera.position.set(0,0,0.1);
            this.camera.lookAt(this.sphere.position);

            //render

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(this.size.width,this.size.height);
            this.renderer.setClearColor({color: 0x000000});
            document.getElementById('stage').appendChild(this.renderer.domElement);
            this.renderer.render(this.scene, this.camera);
            this.$emit('load-status', 90);

            //control

            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.zoomSpeed = 3;
            this.render();
            this.$emit('loaded');

        },
        methods: {
            render(){
                requestAnimationFrame(this.render);
                // this.sphere.rotation.y += 0.05 * Math.PI/180;
                this.renderer.render(this.scene, this.camera);
                this.controls.update();
            },
            resize() {
                this.camera.aspect = this.size.width / this.size.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( this.size.width, this.size.height );
            },
            handleResize() {
                this.size.width=$('#stage').width();
                this.size.height=$('#stage').height();
            }
        }
    }
</script>
