<template>
    <div
        class="audio-player-page"
        v-height
        :style="{background:`#3b7e85 url(${audio.playerbg}) 0 0 / cover no-repeat`}"
    >
        <header>
            <span class="goback iconfont icon-houtui1" @click="goback"></span>
            {{typeof audio.index == 'number' ? audio.playerList[audio.index].musicName : '播放器'}}
        </header>
        <div v-if="typeof audio.index == 'number'">
            <audio
                :src="audio.playerList[audio.index].musicUrl"
                autoplay
                @timeupdate="play"
                @ended="ended"
                @playing='playing'
            ></audio>
        </div>
        <div class="content" v-show="!isShowLyric" @click="showLyric"  v-height='266'>
            <div class="cd-mine">
                <img :src="typeof audio.index == 'number' ? '/img/cd-mine.png' : '/img/cd.png' " />
                <div class="singerImg" :class="{cur: isPlay}">
                    <img :src="audio.avatar" alt />
                </div>
            </div>
            <div class="swith" :class="{cur: isPlay}">
                <img src="/img/swith.png" alt />
            </div>
        </div>
        <div class="volume" v-show='isShowLyric'>
            <span 
                class="iconfont"
                :class="[
                    {' icon-weibiaoti-' : volume < 0.5},
                    {'icon-weibiaoti-1' : volume > 0.5},
                    {'cur': volume > 0.8 ? true : false}
                ]"
            ></span>
            <input type="range" min='0' max='1' step='0.01' v-model="volume">
        </div>
        <div class="lyricBox" v-show="isShowLyric" @click="hideLyric" v-height='288'>
            <ul>
                <li
                    v-for="(item, index) of lyric"
                    :key="index"
                    :class="{cur : currentTime > lyric[index][0] && 
                    currentTime + (lyric[index][0] - lyric[
                        index <= 0 ? 0 : index + 1 > lyric.length - 1 ? lyric.length - 1 : index + 1
                    ][0]) < lyric[index][0]
                }"
                >
                    <span class="animationLyricOrigin">{{item[1]}}</span>
                </li>
            </ul>
        </div>
        <div class="setting">
            <ul>
                <li class="iconfont icon-xin1"></li>
                <li class="iconfont icon-icon--"></li>
                <li class="iconfont icon-BAI-pinglun"></li>
                <li class="iconfont icon-more-vert"></li>
            </ul>
        </div>
        <div class="progressBar">
            <p class="star">{{currentTime | zhuanhuan}}</p>
            <p class="progress">
                <span class="durationTime" @click="goTime($event)">
                    <span class="currentTime" :style="{width: currentTime / duration * 100 + '%' }"></span>
                </span>
            </p>
            <p class="end">{{duration | zhuanhuan}}</p>
        </div>
        <div class="controller">
            <span
                class="playMode iconfont"
                :class="[{'icon-xunhuan' : playState == 'all'},{'icon-bofangye-caozuolan-suijibofang' : playState == 'random'},{'icon-singlecycle' : playState == 'once'}]"
                @click="changePlayMode"
            ></span>
            <ul>
                <li class="iconfont icon-previous" @click="goPrev"></li>
                <li
                    class="iconfont"
                    :class="[isPlay ? 'icon-pause-20' : 'icon-bofang']"
                    @click="pause_play"
                ></li>
                <li class="iconfont icon-next" @click="goNext"></li>
            </ul>
            <span class="iconfont icon-zhankaicaidan" @click="showPlayList"></span>
        </div>
        <div class="popwindow" v-height :class="{cur: isShowPlayList}"></div>
        <div class="playList" :class="{cur: isShowPlayList}">
            <ul>
                <li
                    v-for="(item, index) of audio.playerList"
                    :key="index"
                    :class="{cur: index == audio.index}"
                    @click="changeMusic(index)"
                >
                    <span class="iconfont icon-laba" v-show="index === audio.index"></span>
                    <p>
                        <span class="musicName">{{item.musicName}}</span>
                        <span class="musicSinger">- {{item.musicSinger}}</span>
                    </p>
                    <span class="iconfont icon-bofang"></span>
                </li>
            </ul>
            <div class="close" @click="showPlayList">关闭</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["audio"],
    data() {
        return {
            isShowLyric: false,
            // 是否显示抽屉
            isShowPlayList: false,
            // 总时长
            duration: 0,
            // 当前时常
            currentTime: 0,
            // 由于有autoplay 所以 值默认是true
            isPlay: true,
            // 使用isAddClass 去处理换歌曲的时候 样式的问题
            isAddClass: true,
            //播放模式
            playState: "all",
            // 处理后的歌词
            lyric: [],
            // 处理声音
            volume: 0.3
        };
    },
    computed: {
        index() {
            return this.$store.state.audio.index;
        },
        albumIndex() {
            return this.$store.state.audio.albumIndex;
        }
    },
    watch: {
        async index() {
            this.isShowLyric = !this.isShowLyric;
            var data = await fetch(
                this.audio.playerList[this.index].musicLrc
            ).then(res => res.text());
            this.lyric = this.parseLyric(data);
        },
        async albumIndex() {
            this.isShowLyric = !this.isShowLyric;
            var data = await fetch(
                this.audio.playerList[this.index].musicLrc
            ).then(res => res.text());
            this.lyric = this.parseLyric(data);
        },
        volume(){
            $('audio')[0].volume = this.volume
        }
    },
    filters: {
        // 来源 https://www.cnblogs.com/100qianduan/p/7171456.html
        zhuanhuan(s) {
            var t;
            if (s > -1) {
                var min = Math.floor(s / 60) % 60;
                var sec = s % 60;

                if (min < 10) {
                    t += "0";
                }
                t = min + ":";
                if (sec < 10) {
                    t += "0";
                }
                t += sec | 0;
            }
            return t;
        }
    },
    methods: {
        goback() {
            this.$store.commit("HIDEAUDIOPLAYER", {
                isShowPlayer: false
            });
        },
        async showLyric() {
            // 显示歌词
            this.isShowLyric = !this.isShowLyric;
            var data = await fetch(
                this.audio.playerList[this.index].musicLrc
            ).then(res => res.text());
            if(data){
                this.lyric = this.parseLyric(data);
            }
            
            // console.log(data)
        },
        parseLyric(lyric) {
            var arr = [];
            // 将歌词的 回车 换行符 去掉，放在一个数组里面
            var lines = lyric.split(/\n/);
            // 使用正则 匹配时间
            var getLyricTime = /\[\d{2}:\d{2}.\d{2}\]/g;

            // // 获取有时间的歌词
            while (!getLyricTime.test(lines[0])) {
                lines = lines.splice(1);
            }
            // 去空行
            if (lines[lines.length - 1].length === 0) {
                lines.pop();
            }
            // 遍历歌词 将1分30.40秒 转换成 90.40秒
            lines.forEach(item => {
                // 得到时间和歌词的分界点
                let index = item.indexOf("]");
                // 得到时间
                let time = item.substr(1, index - 1);
                // 转换时间
                let timeArr = time.split(":");
                // 得到歌词
                let geci = item.substr(index + 1);
                console.log(geci)
                // 将处理过的 时间 和歌词 放进arr里面
                arr.push([timeArr[0] * 60 + ~~timeArr[1], geci]);
            });
            return arr;
        },
        hideLyric() {
            // 隐藏歌词
            this.isShowLyric = !this.isShowLyric;
        },
        showPlayList() {
            // 是否显示抽屉
            this.isShowPlayList = !this.isShowPlayList;
        },
        ended() {
            // 当媒介已到达结尾时运行的脚本
            if (this.playState == "all") {
                // 还要看是不是最后一曲，如果不是 +1  如果是最后一曲  this.changemusic(0)
                if (this.index >= this.audio.playerList.length - 1) {
                    console.log("这张专辑播放完了！！！");
                    this.changeMusic(0);
                } else {
                    this.changeMusic(this.index + 1);
                }
            } else if (this.playState == "once") {
                this.changeMusic(this.index);
                $("audio")[0].load();
            } else if (this.playState == "random") {
                // 防止随机到自己需要写do...while
                let index;
                do {
                    index = ~~(Math.random() * this.audio.playerList.length);
                } while (index == this.index);

                this.changeMusic(index);
            }
        },
        playing(){
            // 当媒介已开始播放时运行的脚本。
            this.duration = $("audio")[0].duration;
            $('audio')[0].volume = this.volume
        },
        play() {
            // 主播放函数
            
            this.currentTime = $("audio")[0].currentTime;
            // 使用isAddClass 处理暂停时换歌曲 样式不同步的问题
            if (this.isAddClass && $("audio")[0].pause) {
                this.isPlay = false;
                this.isAddClass = false;
            } else {
                this.isPlay = true;
            }
            if (!this.isShowLyric) {
                return;
            }
            for (var i = 0; i < this.lyric.length - 1; i++) {
                if (this.currentTime > this.lyric[i][0]) {
                    $(".lyricBox ul").css({
                        top: $(".lyricBox").height() / 2 - 26 * (i + 1)
                    });
                }
            }
        },
        goTime(event) {
            // console.log("event: ", event)
            // 点击进度条 根据点击位置 设置播放时间点
            $("audio")[0].currentTime =
                (event.offsetX / $(".durationTime").width()) *
                $("audio")[0].duration;
        },
        pause_play() {
            this.isPlay = !this.isPlay;
            if (!this.isPlay) {
                $("audio")[0].pause();
                //    设置isaddclass
                this.isAddClass = true;
            } else {
                $("audio")[0].play();
            }
        },
        changePlayMode() {
            // 切换播放模式
            if (this.playState == "all") {
                this.playState = "random";
            } else if (this.playState == "random") {
                this.playState = "once";
            } else if (this.playState == "once") {
                this.playState = "all";
            }
        },
        changeMusic(index) {
            // 热门歌曲的切歌
            if (this.$store.state.audio.albumIndex == null) {
                this.$store.commit("CHANGEMUSIC", {
                    index: index,
                    playerbg: this.audio.playerList[index].playerbg,
                    avatar: this.audio.playerList[index].singerImg
                });
            } else if (typeof this.$store.state.audio.albumIndex == "number") {
                // 专辑歌曲的切歌
                this.$store.commit("CHANGEMUSIC", {
                    index: index,
                    playerbg: this.audio.playerbg,
                    avatar: this.audio.avatar
                });
            }
        },
        goPrev() {
            // 上一曲
            if (this.playState == "random") {
                let index = ~~(Math.random() * this.audio.playerList.length);
                console.log(index);
                this.changeMusic(index);
            } else {
                if (this.index <= 0) {
                    this.changeMusic(this.audio.playerList.length - 1);
                } else {
                    this.changeMusic(this.index - 1);
                }
            }
        },
        goNext() {
            // 下一曲
            if (this.playState == "random") {
                let index = ~~(Math.random() * this.audio.playerList.length);
                this.changeMusic(index);
            } else {
                if (this.index >= this.audio.playerList.length - 1) {
                    this.changeMusic(0);
                } else {
                    this.changeMusic(this.index + 1);
                }
            }
        }
    }
};
</script>

<style scoped lang='stylus'>
.audio-player-page {
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 2;

    header {
        height: rem(50);
        text-align: center;
        color: #fff;
        position: relative;
        line-height: rem(50);
        font-size: rem(20);
        background: linear-gradient(top, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0));

        span.goback {
            width: rem(50);
            height: rem(50);
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
            font-size: rem(26);
        }
    }

    .content {
        padding: rem(80px) 0;
        position: relative;
        overflow: hidden;

        .cd-mine {
            width: 70%;
            margin: 0 auto;
            position: relative;

            img {
                width: 100%;
                display: block;
            }

            .singerImg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 70%;
                overflow: hidden;
                border-radius: 50%;
                animation: rotate 10s linear 0s infinite;
                animation-play-state: paused;

                @keyframes rotate {
                    from {
                        transform: translate(-50%, -50%) rotate(0deg);
                    }

                    to {
                        transform: translate(-50%, -50%) rotate(360deg);
                    }
                }

                &.cur {
                    animation-play-state: running;
                }
            }
        }

        .swith {
            width: rem(100);
            position: absolute;
            top: rem(-15px);
            left: rem(183);
            transform: rotate(-22deg);
            transform-origin: rem(15px) rem(15px);
            transition: all 0.8s ease 0s;

            img {
                display: block;
                width: 100%;
            }

            &.cur {
                transform: rotate(0deg);
            }
        }
    }

    .lyricBox {
        height: rem(448);
    }

    .setting {
        ul {
            display: flex;

            li {
                flex: 1;
                color: #fff;
                font-size: rem(36px);
                text-align: center;
                height: rem(50);
                line-height: rem(50);

                &.icon-xin1 {
                    font-size: rem(28);
                }

                &.icon-icon-- {
                    font-size: rem(38);
                }
            }
        }
    }

    .progressBar {
        height: rem(24);
        margin: rem(30px) 0;
        display: flex;
        align-items: center;
        color: #fff;
        padding: 0 rem(10);

        p.progress {
            height: rem(3);
            display: flex;
            padding: 0 rem(10);
            flex: 1;

            span.durationTime {
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.7);

                span.currentTime {
                    height: 100%;
                    width: 50%;
                    display: block;
                    background-color: #C20C0C;
                }
            }
        }
    }

    .controller {
        height: rem(60);
        color: #fff;
        position: relative;

        .playMode, .icon-zhankaicaidan {
            width: rem(70);
            height: rem(60);
            line-height: rem(60);
            position: absolute;
            top: 0px;
            left: 0;
            text-align: center;
            font-size: rem(38);
        }

        .icon-zhankaicaidan {
            left: unset;
            right: 0;
        }

        ul {
            display: flex;
            width: calc(100vw - 140px);
            margin: 0 auto;

            li {
                flex: 1;
                text-align: center;
                line-height: rem(60);
                height: rem(60);
                font-size: rem(42);

                &.icon-pause-20, &.icon-bofang {
                    font-size: rem(60);
                }
            }
        }
    }

    .popwindow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 3;
        background-color: rgba(0, 0, 0, 0.7);
        display: none;

        &.cur {
            display: block;
        }
    }

    .playList {
        width: 100%;
        height: rem(400px);
        position: absolute;
        bottom: rem(-400px);
        left: 0;
        z-index: 4;
        background-color: #fff;
        transition: all 1s ease 0s;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;

        ul {
            height: 350px;
            overflow: scroll;

            li {
                display: flex;
                align-items: center;
                line-height: rem(50);
                height: rem(50);
                border-bottom: 1px solid #ececec;

                span.icon-laba {
                    font-size: rem(26);
                }

                p {
                    display: flex;
                    align-items: center;
                    margin-left: rem(15);

                    span.musicName {
                        font-size: rem(18);
                    }

                    span.musicSinger {
                        font-size: rem(14);
                        color: #929292;
                    }
                }

                span.icon-bofang {
                    margin: 0 rem(20px) 0 auto;
                    font-size: rem(30);
                }

                &.cur {
                    p {
                        margin-left: 0;
                    }

                    color: #C20C0C;

                    .musicSinger {
                        color: #C20C0C;
                    }
                }
            }
        }

        .close {
            background-color: #eee;
            height: rem(50);
            line-height: rem(50);
            text-align: center;
        }

        &.cur {
            bottom: 0px;
        }
    }

    .lyricBox {
        overflow: hidden;

        ul {
            position: relative;
            transition: all 0.8s ease 0s;

            li {
                color: #fff;
                text-align: center;
                line-height: 26px;

                span.animationLyricOrigin {
                    display: inline-block;
                    height: 26px;
                    line-height: 26px;
                }
                &.cur {
                    color: red;
                }
            }
        }
    }
    .volume{
        
        height: 22px;
        display: flex;
        align-items :center;
        justify-content : center;
        span{
            width 24px;height: 24px;color #fff;
            display block;
            text-align center;
            line-height: 24px;
            &.cur{
                color: red;
                font-size: 20px;
            }
        }
        input{
            width:80%;
            // 清楚默认样式
            -webkit-appearance: none;
            height: 3px;
            background: rgba(255,255,255,.7)
        
        }
        input[type='range']::-webkit-slider-thumb{
             // 清楚默认样式
            -webkit-appearance: none;
            width: 12px;height: 12px;
            border-radius 50%;
            background: red;
            border: 2px solid #fff;
        }
    }
}
</style>