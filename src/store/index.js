import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapList:[],
    albumObj: {
      // 不显示专辑页面
      isShowAlbum: false,
      // 专辑信息
      albumItem: {},
      // idx默认为null
      index: null
    },
    audio:{
      // 是否显示播放页面
      isShowPlayer: false,
      // 播放列表 有可能是专辑 有可能是热门歌曲
      playerList:[],
      // 播放歌曲下表
      index: null,
      // 头像
      avatar: null,
      // 播放背景
      playerbg: '',
      // 专辑的index ，热门歌曲null
      albumIndex: null
    }
  },
  mutations: {
    GETMUSIC(state, payload){
      state.mapList = payload
    },
    SHOWALBUM(state, payload){
      console.log(payload);
      // 显示专辑页面
      state.albumObj.isShowAlbum = payload.isShowAlbum
      // 设置专辑列表
      state.albumObj.albumItem = payload.albumItem
      // 点的是第几张专辑
      state.albumObj.index = payload.index
    },
    HIDEALBUM(state, payload){
      // 隐藏专辑
      state.albumObj.isShowAlbum = payload.isShowAlbum
    },
    HIDEAUDIOPLAYER(state, payload){
      state.audio.isShowPlayer = payload.isShowPlayer
    },
    SHOWPLAYER(state, payload){
        // console.log(payload);
        state.audio.isShowPlayer = payload.isShowPlayer  
        state.audio.playerList = payload.playerList 
        state.audio.index = payload.index  
        state.audio.avatar = payload.avatar  
        state.audio.playerbg = payload.playerbg  
        state.audio.albumIndex = payload.albumIndex  

    },
    _SHOWPLAYER_(state, payload){
        state.audio.isShowPlayer = payload.isShowPlayer
    },
    CHANGEMUSIC(state, payload){
        console.log("payload: ",payload);
        state.audio.index = payload.index 
        state.audio.avatar = payload.avatar  
        state.audio.playerbg = payload.playerbg  
    }
  },
  actions: {
    async GETMUSIC({commit}){
      var {mapList} = await fetch('/getmusic').then(res => res.json());
      console.log(mapList);
      commit("GETMUSIC",mapList)
    }
  },
  modules: {
  }
})
