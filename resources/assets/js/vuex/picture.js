import Vuex from 'vuex';
import Vue from 'vue';
import { FETCH_PICTURES, SET_THUMBNAILS, SET_PICTURE_LOADER } from './mutation-types';

Vue.use(Vuex);

const vm = new Vue;
const queue = [];

const thumbnailSettings = {
    timeout: 10000,
    size: {
        width: 200,
            height: 160
    }
};

export default {
    state : {
        items: [],
        thumbnails: [],
        loading: false
    },
    actions : {
        [FETCH_PICTURES]({ commit, getters, dispatch }) {
            vm.$http.get('api/picture?album=' + getters.currentAlbum.id)
                .then(response =>{
                    let data = JSON.parse(response.data);
                    if (Object.keys(data).length) commit(SET_PICTURE_LOADER, true);
                    dispatch(SET_THUMBNAILS, data)
                        .then(data => {
                            commit(FETCH_PICTURES, data);
                            commit(SET_PICTURE_LOADER, false);
                        })
                })
                .catch(error => console.error(error));
        },
        [SET_THUMBNAILS]({ commit }, pictures) {
            return new Promise( (resolve, reject) => {
                let setCount, thisQueue;
                let thumbnails = [];

                setCount = 0;

                queue.push({pictures: pictures});

                if(queue.length > 1) queue[queue.length-2].isCurrent = false;
                thisQueue = queue[queue.length-1];
                thisQueue.isCurrent = true;


                pictures.map((picture, index) => {
                    createThumbnail(pictures[index] , (thumbnail) => {
                        thumbnails[index] = thumbnail;
                        setCount++;
                        if (setCount == pictures.length && thisQueue.isCurrent) {
                            commit(SET_THUMBNAILS, thumbnails);
                            resolve(pictures);
                        }
                    });
                });
            });
        }
    },
    mutations : {
        [FETCH_PICTURES](state, pictures) {
            state.items = pictures;
        },
        [SET_THUMBNAILS](state, thumbnails) {
            state.thumbnails = thumbnails;
        },
        [SET_PICTURE_LOADER](state, status) {
            state.loading = status;
        }
    },
}

function createThumbnail(picture, callback) {
    let img, canvas, ctx, settings;

    settings = thumbnailSettings;

    img = new Image();

    img.onerror = () => {
        console.error('[createThumbnail] Failed to load ' + picture.filename);
        picture.error = true;
        img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTYwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6I2E5NDQ0Mjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPuOCouOCu+ODg+ODiCAxPC90aXRsZT48ZyBpZD0i44Os44Kk44Ok44O8XzIiIGRhdGEtbmFtZT0i44Os44Kk44Ok44O8IDIiPjxnIGlkPSLjg6zjgqTjg6Tjg7xfMS0yIiBkYXRhLW5hbWU9IuODrOOCpOODpOODvCAxIj48cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjUuMzEsNzIuMjZoOS41djIuNTdoLTYuNHYzLjU4aDUuNDRWODFINjguNDF2NC4xNEg3NXYyLjU5SDY1LjMxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTg2LjYsODcuNzRsLTMuMTgtNS44Nkg4MS4yN3Y1Ljg2aC0zLjFWNzIuMjZoNS40YzMuMjQsMCw1LjgyLDEuMTMsNS44Miw0LjY5YTQuNDMsNC40MywwLDAsMS0yLjk1LDQuNDZsMy42Miw2LjM0Wm0tNS4zMy04LjNoMmMyLDAsMy4wOC0uODQsMy4wOC0yLjQ5cy0xLjA5LTIuMjQtMy4wOC0yLjI0aC0yWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEwMC44Nyw4Ny43NGwtMy4xOC01Ljg2SDk1LjUzdjUuODZoLTMuMVY3Mi4yNmg1LjRjMy4yNCwwLDUuODIsMS4xMyw1LjgyLDQuNjlhNC40Myw0LjQzLDAsMCwxLTIuOTUsNC40NmwzLjYyLDYuMzRabS01LjMzLTguM2gyYzIsMCwzLjA4LS44NCwzLjA4LTIuNDlzLTEuMDktMi4yNC0zLjA4LTIuMjRoLTJaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTA1LjkzLDc5Ljk0YzAtNSwyLjgyLTgsNi45Mi04czYuOTIsMi45NSw2LjkyLDhTMTE3LDg4LDExMi44NSw4OCwxMDUuOTMsODUsMTA1LjkzLDc5Ljk0Wm0xMC42OSwwYzAtMy4zMy0xLjQ2LTUuMzEtMy43Ny01LjMxcy0zLjc3LDItMy43Nyw1LjMxLDEuNDYsNS40MiwzLjc3LDUuNDJTMTE2LjYyLDgzLjI0LDExNi42Miw3OS45NFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMzEuMjQsODcuNzRsLTMuMTgtNS44NkgxMjUuOXY1Ljg2aC0zLjFWNzIuMjZoNS40YzMuMjQsMCw1LjgyLDEuMTMsNS44Miw0LjY5YTQuNDMsNC40MywwLDAsMS0yLjk1LDQuNDZsMy42Miw2LjM0Wm0tNS4zMy04LjNoMmMyLDAsMy4wOC0uODQsMy4wOC0yLjQ5cy0xLjA5LTIuMjQtMy4wOC0yLjI0aC0yWiIvPjwvZz48L2c+PC9zdmc+';
    };

    setTimeout(function() {
        if(picture.thumbnail == null && !picture.error){
            console.error('[createThumbnail] Timeout to load ' + picture.filename);
            img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTYwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6I2E5NDQ0Mjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPuOCouOCu+ODg+ODiCA0PC90aXRsZT48ZyBpZD0i44Os44Kk44Ok44O8XzIiIGRhdGEtbmFtZT0i44Os44Kk44Ok44O8IDIiPjxnIGlkPSLjg6zjgqTjg6Tjg7xfMS0yIiBkYXRhLW5hbWU9IuODrOOCpOODpOODvCAxIj48cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTQuMDYsNzQuNzRINDkuNjRWNzIuMTNoMTJ2Mi42Mkg1Ny4yMVY4Ny44N0g1NC4wNloiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik02NC4yMyw3Mi4xM2gzLjE1Vjg3Ljg3SDY0LjIzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTcxLjI1LDcyLjEzaDMuNDlsMi42OCw3LjM2Yy4zNCwxLC42NCwyLDEsM2guMTFjLjM0LTEsLjYyLTIuMDYsMS0zbDIuNjItNy4zNmgzLjQ5Vjg3Ljg3SDgyLjY3VjgxLjNjMC0xLjQ5LjIzLTMuNjguMzgtNS4xN0g4M2wtMS4yOCwzLjctMi40Myw2LjYySDc3LjQ2TDc1LDc5LjgzbC0xLjI2LTMuN2gtLjA5Yy4xNSwxLjQ5LjQsMy42OC40LDUuMTd2Ni41N0g3MS4yNVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik04OS40Miw3Mi4xM2g5LjY2djIuNjJIOTIuNTd2My42NEg5OC4xVjgxSDkyLjU3djQuMjFoNi43NHYyLjY0SDg5LjQyWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEwNi41NCw3OS45NGMwLTUuMTMsMi44Ny04LjExLDctOC4xMXM3LDMsNyw4LjExLTIuODcsOC4yMy03LDguMjNTMTA2LjU0LDg1LDEwNi41NCw3OS45NFptMTAuODcsMGMwLTMuMzgtMS40OS01LjQtMy44My01LjRzLTMuODMsMi0zLjgzLDUuNCwxLjQ5LDUuNTEsMy44Myw1LjUxUzExNy40MSw4My4zLDExNy40MSw3OS45NFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMjMuNjIsODAuNzlWNzIuMTNoMy4xNXY4Ljk0YzAsMy4yOCwxLjEzLDQuMzgsMyw0LjM4czMuMDYtMS4xMSwzLjA2LTQuMzhWNzIuMTNoM3Y4LjY2YzAsNS4yMy0yLjIzLDcuMzgtNi4wOSw3LjM4UzEyMy42Miw4NiwxMjMuNjIsODAuNzlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTQyLjc1LDc0Ljc0aC00LjQzVjcyLjEzaDEydjIuNjJIMTQ1LjlWODcuODdoLTMuMTVaIi8+PC9nPjwvZz48L3N2Zz4=';
        }
    }, settings.timeout);

    img.onload = () => {
        let dx, dy, dw, dh, thumbnail;
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = settings.size.width;
        canvas.height = settings.size.height;
        dh = img.width >= img.height ? canvas.height : img.height * canvas.width / img.width;
        dw = img.width >= img.height ? img.width * canvas.height / img.height : canvas.width;
        dx = (canvas.width - dw) / 2;
        dy = (canvas.height - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
        thumbnail = canvas.toDataURL("image/png");
        if(callback != null) return callback(thumbnail);
    };
    return img.src = picture.storage_path;
}