<template>
    <div class="content" v-height="50">
        <div class="swiper">
            <swiper :options="swiperOption">
                <!-- slides -->
                <swiper-slide
                    v-for="(item, index) of swiperList"
                    :key="index"
                    style="touch-action: none;"
                >
                    <img :src="item.imgUrl" srcset alt />
                </swiper-slide>
                <!-- Optional controls -->
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
        <div class="music-content">
            <div class="music-album">
                <h3>热门专辑</h3>
                <ul>
                    <li v-for="(item, index) in album" :key="index" @click="showAlbum(item, index)">
                        <img :src="item.albumImg" alt />
                        <p>{{item.albumTitle}}</p>
                    </li>
                </ul>
            </div>
            <div class="music-recommend">
                <h3>热门单曲</h3>
                <!-- <span>{{recommend}}</span> -->
                <ul>
                    <li
                        v-for="(item, index) in recommend"
                        :key="index"
                        @click="playRecommend(recommend, index)"
                        :class="{cur: index == $store.state.audio.index && $store.state.audio.albumIndex == null}"
                    >
                        <span
                            class="xuhao iconfont"
                            :class="{'icon-laba': index == $store.state.audio.index &&  $store.state.audio.albumIndex == null}"
                        >{{index == $store.state.audio.index && $store.state.audio.albumIndex == null ? '' : index + 1}}</span>
                        <div>
                            <p>{{item.musicName}}</p>
                            <p>{{item.musicSinger}}</p>
                        </div>
                        <span class="iconfont icon-bofang"></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            swiperList: [
                {
                    imgUrl: "/img/1.jpeg"
                },
                {
                    imgUrl: "/img/2.jpeg"
                },
                {
                    imgUrl: "/img/3.jpeg"
                },
                {
                    imgUrl: "/img/4.jpeg"
                },
                {
                    imgUrl: "/img/5.jpeg"
                }
            ],
            swiperOption: {
                // some swiper options/callbacks
                // 所有的参数同 swiper 官方 api 参数
                // 网址 https://www.swiper.com.cn/api/start/new.html
                pagination: {
                    el: ".swiper-pagination"
                },
                loop: true,
                autoplay: {
                    delay: 3000
                }
            }
        };
    },
    computed: {
        album() {
            return this.$store.state.mapList.album;
        },
        recommend() {
            return this.$store.state.mapList.recommend;
        }
    },
    created() {
        this.$store.dispatch("GETMUSIC");
    },
    methods: {
        showAlbum(item, index) {
            // console.log("item: ", item);
            // console.log("index: ", index)
            this.$store.commit("SHOWALBUM", {
                // 是否显示这张专辑
                isShowAlbum: true,
                // 传入整张专辑的所有数据
                albumItem: item,
                // 专辑的下标
                index: index
            });
        },
        playRecommend(recommend, index) {
            this.$store.commit("SHOWPLAYER", {
                isShowPlayer: true,
                playerList: recommend,
                index: index,
                avatar: recommend[index].singerImg,
                playerbg: recommend[index].playerbg,
                albumIndex: null
            });
        }
    }
};
</script>

<style scoped lang='stylus'>
.content {
    overflow-y: auto;

    .swiper {
        img {
            display: block;
            width: 100%;
        }
    }

    .music-content {
        padding: rem(10) rem(18);

        h3 {
            font-weight: normal;
            position: relative;
            padding-left: rem(16px);
        }

        h3::before {
            content: '';
            margin-right: 0.625rem;
            display: block;
            width: rem(4px);
            height: rem(19px);
            position: absolute;
            top: rem(4px);
            left: 0;
            background-color: #c20c0c;
        }

        .music-album {
            margin-top: rem(14);

            ul {
                display: flex;
                flex-flow: wrap;

                li {
                    width: calc(33.333% - 7px);
                    margin: rem(10) rem(10) rem(10) 0;

                    img {
                        display: block;
                        width: 100%;
                    }

                    p {
                        text-align: center;
                        padding-top: rem(10);
                    }
                }

                li:nth-child(3n) {
                    margin-right: 0;
                }
            }
        }

        .music-recommend {
            margin-top: rem(14);

            ul {
                li {
                    display: flex;
                    margin-top: rem(12px);

                    span.xuhao {
                        width: rem(40);
                        text-align: center;
                        line-height: rem(50px);
                        height: rem(50px);
                    }

                    span.icon-laba {
                        font-size: rem(28);
                    }

                    div {
                        padding-left: rem(8px);

                        p:nth-child(1) {
                            font-size: rem(16);
                            height: rem(28);
                            line-height: rem(28);
                        }

                        p:nth-child(2) {
                            color: #929292;
                            font-size: rem(14);
                            height: rem(22);
                            line-height: rem(22);
                        }

                        flex: 1;
                    }

                    span.icon-bofang {
                        width: rem(50);
                        height: rem(50);
                        line-height: rem(50);
                        text-align: center;
                        font-size: rem(30);
                    }

                    &.cur {
                        color: #f35626;
                        background-image: linear-gradient(92deg, red 0%, yellow 100%);
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        animation: hue 6s infinite linear;

                        @keyframes hue {
                            0% {
                                filter: hue-rotate(0deg);
                            }

                            100% {
                                filter: hue-rotate(-360deg);
                            }
                        }

                        * {
                            color: #c20c0c !important;
                        }
                    }
                }
            }
        }
    }
}
</style>