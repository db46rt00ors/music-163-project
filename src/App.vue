<template>
    <div id="app">
        <div class="navList">
            <span class="iconfont icon-caidan"></span>
            <ul>
                <li
                    v-for="(item, index) in navList"
                    :key="index"
                    :class="['iconfont',item.iconfont,{'cur': item.iconfont === $route.name}]"
                    @click="routerGo(item.url)"
                ></li>
            </ul>
            <span class="iconfont icon-zhuanjiguangpan" @click='showPlayer'></span>
        </div>
        <transition
            enter-active-class="animated slideInRight"
            leave-active-class="animated slideOutLeft"
        >
            <router-view />
        </transition>
        <transition
            enter-active-class="animated slideInRight"
            leave-active-class="animated slideOutLeft"
        >
            <album :albumObj='albumObj'></album>
        </transition>
        <transition
            enter-active-class="animated slideInRight"
            leave-active-class="animated slideOutLeft"
        >
            <audio-player :audio='audio' v-show='audio.isShowPlayer'></audio-player>
        </transition>
    </div>
</template>
<script>
import album from './components/album/album.vue'
import audioPlayer from './components/audio-player/audio-player.vue'
export default {
    data() {
        return {
            navList: [
                {
                    iconfont: "icon-wangyiyunyinlezizhi-copy",
                    url: "/index"
                },
                {
                    iconfont: "icon-diantai",
                    url: "/diantai"
                },
                {
                    iconfont: "icon-pengyou",
                    url: "/wode"
                }
            ]
        };
    },
    computed:{
        albumObj(){
            return this.$store.state.albumObj
        },
        audio(){
            return this.$store.state.audio
        }
    },
    methods: {
        routerGo(url) {
            this.$router.push({ path: url });
        },
        showPlayer(){
            this.$store.commit("_SHOWPLAYER_",{
                isShowPlayer: true
            })
        }
    },
    components:{
        album,audioPlayer
    }
};
</script>
<style lang='stylus' scoped>
.animated{
    animation-duration :.4s;
}
.slideOutLeft{
    display none
}
div.navList {
    height: rem(50);
    background-color: #C20C0C;
    color: #fff;
    position: relative;

    .icon-caidan, .icon-zhuanjiguangpan {
        width: rem(70);
        height: rem(50);
        line-height: rem(50);
        position: absolute;
        top: 0px;
        left: 0;
        text-align: center;
        font-size: rem(26);
    }

    ul {
        display: flex;
        width: calc(100vw - 140px);
        margin: 0 auto;

        li {
            flex: 1;
            text-align: center;
            line-height: rem(50);
            height: rem(50);
            font-size: rem(26);

            &.cur {
                background-color: #9B0909;
            }
        }
    }

    .icon-zhuanjiguangpan {
        left: unset;
        right: 0;
    }
}
</style>
