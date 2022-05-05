import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前播放歌曲Id
    nowPlaySongId: null,
    // 当前歌曲播放时间
    nowPlaySongCurrentTime: null,
    // 当前歌曲总时长
    nowPlaySongDuration: null,
    // 当前歌曲播放状态
    isPlaySong: false,
    // 当前播放的歌单
    nowSongListData: [],
    // 滑条滚动时间
    sliderCurrentTime: null,
    // 其他地方停止
    otherPlaySong: null,
    // 播放模式
    mode: 0,
    // 下一首指令
    nextPlay: null
  },
  getters: {
  },
  mutations: {
    setNowPlaySongId(state, payload) {
      state.nowPlaySongId = payload.nowPlaySongId;
      state.isPlaySong = payload.isPlaySong
    },
    checkOutUser(state) {
      state.cookie = null;
      state.userId = null;
    },
    setnowPlaySongCurrentTime(state, payload) {
      state.nowPlaySongCurrentTime = payload.currentTime
    },
    setnowPlaySongDuration(state, payload) {
      state.nowPlaySongDuration = payload.duration
    },
    setIsPlaySong(state, payload) {
      state.isPlaySong = payload.isPlaySong
    },
    setNowSongListData(state, payload) {
      state.nowSongListData = payload.nowSongListItem
    },
    setSliderCurrentTime(state, payload) {
      state.sliderCurrentTime = payload.newCurrentTime
    },
    setOtherPlaySong(state, payload) {
      state.otherPlaySong = payload.otherPlaySong
    },
    setMode(state, payload) {
      state.mode = payload.mode
    },
    setNextPlay(state, payload) {
      state.nextPlay = payload.nextPlay
    }
  },
  actions: {
  },
  modules: {
  }
})
