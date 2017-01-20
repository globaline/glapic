<template>
    <div id="stage" :style="[stageSize]"></div>
</template>

<script>
    var THREE = require('three');
    var OrbitControls = require('three-orbit-controls')(THREE);

    export default{
        props: {
            width: {
                type: Number,
                default: 800
            },
            height: {
                type: Number,
                default: 450
            },
            src: {
                type: String,
                default: ""
            }
        },
        data(){
            return{
                stageSize: {
                    width: this.width,
                    height: this.height
                },
                scence: null,
                geometry: null,
                material: null,
                camera: null,
                axis: null,
                sphere: null,
                renderer: null,
                controls: null
            }
        },
        mounted() {
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

            this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 1000);
            this.camera.position.set(0,0,0.1);
            this.camera.lookAt(this.sphere.position);

            //render

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(this.width,this.height);
            this.renderer.setClearColor({color: 0x000000});
            document.getElementById('stage').appendChild(this.renderer.domElement);
            this.renderer.render(this.scene, this.camera);

            //control

            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.zoomSpeed = 3;

            this.render();
        },
        components:{
        },
        methods: {
            render(){
                requestAnimationFrame(this.render);
                this.sphere.rotation.y += 0.05 * Math.PI/180;
                //画面リサイズ対応
                document.getElementById('stage').addEventListener( 'resize', this.resize, false );
                this.renderer.render(this.scene, this.camera);
                this.controls.update();
            },
            resize() {
                this.camera.aspect = this.width / this.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( this.width, this.height );
            }
        }
    }
</script>
