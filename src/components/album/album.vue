<template>
    <div class="albumPage" v-if="albumObj.isShowAlbum" v-height>
        <div
            class="header"
            :style="{background: `url(${albumObj.albumItem.albumbg}) 0 0 / cover no-repeat`}"
        >
            <header>
                <span class="goback iconfont icon-houtui1" @click='goback'></span>
                {{albumObj.albumItem.albumTitle}}
            </header>
            <div class="content">
                <img :src="albumObj.albumItem.albumImg" alt />
                <div class="album-detail">
                    <p class="albumTitle">专辑名称：{{albumObj.albumItem.albumTitle}}</p>
                    <p class="albumSinger">歌手：{{albumObj.albumItem.albumSinger}}</p>
                </div>
            </div>
            <ul class="setting">
                <li>
                    <p class="iconfont icon-addfile"></p>
                    <p class="num">3333</p>
                </li>
                <li>
                    <p class="iconfont icon-BAI-pinglun"></p>
                    <p class="num">1247</p>
                </li>
                <li>
                    <p class="iconfont icon-fenxiang1"></p>
                    <p class="num">12</p>
                </li>
                <li>
                    <p class="iconfont icon-icon--"></p>
                    <p class="num">15</p>
                </li>
            </ul>
        </div>
        <div class="albumList" v-height='300'>
            <ul>
                <li 
                    :class="{cur: index == $store.state.audio.index && albumObj.index == $store.state.audio.albumIndex}"
                    v-for='(item, index) of albumObj.albumItem.albumList' 
                    :key='index'
                    @click='playAudio(albumObj.albumItem.albumList, index)'
                >
                    <!-- {{item.musicName}} --- {{item.musicSinger}} -->
                    <span 
                        class="xuhao iconfont"
                        :class="{'icon-laba': index == $store.state.audio.index && albumObj.index == $store.state.audio.albumIndex}"
                    >{{index == $store.state.audio.index && albumObj.index == $store.state.audio.albumIndex ? '' : index + 1}}</span>
                        <div>
                            <!-- index == $store.state.audio.index && albumObj.index == $store.state.audio.albumIndex
                                双向验证 播放歌曲和下标和专辑的下标 给li.cur 也一样
                             -->
                            <p>{{item.musicName}}</p>
                            <p>{{item.musicSinger}}</p>
                        </div>
                        <span class="iconfont icon-bofang"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ["albumObj"],
    methods:{
        goback(){
            this.$store.commit("HIDEALBUM",{
                isShowAlbum: false
            })
        },
        playAudio(itemList, index){
            // itemList 是整个列表 ，不是某一项
            console.log("itemList: ", itemList)
            this.$store.commit("SHOWPLAYER",{
                // 显示播放器页面
                isShowPlayer: true,
                // 传入播放列表
                playerList: itemList,
                // 点的是第几首歌曲
                index: index,
                // 头像
                avatar: this.albumObj.albumItem.albumImg,
                // 播放页面的背景
                playerbg: this.albumObj.albumItem.playerbg,
                // 点击的是第几张专辑
                albumIndex: this.albumObj.index

            })
        }
    }
};
</script>

<style scoped lang='stylus'>
.albumPage {
    position: fixed;
    top: 0px;
    left: 0;
    background-color: #fff;
    width: 100%;
    z-index: 1;

    .header {
        height: rem(300);
        font-size: rem(20);

        header {
            height: rem(50);
            text-align: center;
            line-height: rem(50);
            color: #fff;

            span.goback {
                position: absolute;
                top: 0px;
                left: 0;
                display: block;
                width: rem(60);
                height: rem(50);
                font-size: rem(26);
            }
        }
    }

    .content {
        padding: rem(16);
        overflow: hidden;

        img {
            width: 36%;
            display: block;
            float: left;
        }

        .album-detail {
            float: left;
            width: 64%;
            padding-top: rem(20);
            padding-left: rem(16);
            color: #fff;

            p {
                padding-bottom: rem(10);
                font-size: rem(16);
            }
        }
    }

    ul.setting {
        display: flex;

        li {
            flex: 1;
            text-align: center;
            color: #fff;
            p.iconfont {
                font-size: rem(40);
            }
            p.num{
                margin-top rem(5)
                font-size: rem(14);
            }
        }
    }
     .albumList {
         overflow-y: auto;
            ul {
                margin: rem(14) 0;
                li {
                    display: flex;
                    margin-top: rem(12px);

                    span.xuhao {
                        width: rem(40);
                        text-align: center;
                        line-height: rem(50px);
                        height: rem(50px);
                    }
                    span.icon-laba{
                        font-size: rem(28)
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
                    &.cur{
                        *{
                            color: #c20c0c !important;
                        }
                    }
                }
            }
        }
}
</style>