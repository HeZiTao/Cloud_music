<template>
  <div id="app">
    <!-- 顶部图标 -->
    <div class="logo">
      <van-icon
        class="iconfont"
        class-prefix="iconfont"
        name="yinle"
        size="20"
        color="#c93d2d"
      />
      <div>网易云音乐</div>
    </div>
    <router-view />
    <div class="audioBox">
      <audio @canplay="songCanPlay" @ended="songEnded" ref="audio"></audio>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  data() {
    return {
      songCurrentTime: null,
      songDuration: null,
      index: null,
    };
  },
  computed: {
    ...mapState([
      "nowPlaySongId",
      "getNowPlaySongMsg",
      "isPlaySong",
      "sliderCurrentTime",
      "nowSongListData",
      "otherPlaySong",
      "mode",
      "nextPlay",
    ]),
  },
  watch: {
    // 监听当前播放的音乐ID
    nowPlaySongId() {
      this.getPlayIdUrl();
    },
    otherPlaySong(nv) {
      let audio = this.$refs.audio;
      if (nv) {
        this.setIsPlaySong({ isPlaySong: true });
        audio.play();
      } else {
        this.setIsPlaySong({ isPlaySong: false });
        audio.pause();
      }
    },
    sliderCurrentTime(nv) {
      this.changecurrentTime(nv);
    },
    nextPlay() {
      this.modeAutoPlay();
    },
  },
  mounted() {
    let audio = this.$refs.audio;
    audio.addEventListener("timeupdate", this.songTimeupdate, true);
  },
  methods: {
    getPlayIdUrl() {
      //启动加载提示
      Toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        loadingType: "spinner",
        //不会自动关闭提示
        duration: 0,
      });
      let audio = this.$refs.audio;
      let cookie = localStorage.getItem("userCookie");
      audio.src = "";
      //  https://music.163.com/song/media/outer/url?id=id.mp3

      audio.src = `https://music.163.com/song/media/outer/url?id=${this.nowPlaySongId}.mp3`;
      // this.axios({
      //   url: `song/url`,
      //   method: "get",
      //   //参数
      //   params: {
      //     id: this.nowPlaySongId,
      //     cookie: cookie,
      //   },
      // })
      //   .then((result) => {
      //     // status请求成功
      //     if (result.status == 200) {
      //       if (result.data.code == 200) {
      //         audio.src = result.data.data[0].url;
      //       }
      //     } else {

      //     }
      //   })
      //   .catch((err) => {

      //   });
    },
    songTimeupdate(e) {
      let songCurrentTime = e.target.currentTime;
      this.setnowPlaySongCurrentTime({ currentTime: songCurrentTime });
    },
    songCanPlay(e) {
      let songDuration = e.target.duration;
      this.setnowPlaySongDuration({ duration: songDuration });
      this.playSong();
    },
    changecurrentTime(nv) {
      let audio = this.$refs.audio;
      audio.currentTime = nv;
    },
    playSong() {
      let audio = this.$refs.audio;
      if (this.isPlaySong) {
        audio.play();
      } else {
        audio.pause();
      }
      Toast.clear();
    },
    songEnded() {
      this.modeAutoPlay();
    },
    // 根据模式自动播放下一首
    modeAutoPlay() {
      let audio = this.$refs.audio;
      if (this.nowSongListData.length == 1) {
        audio.load();
        return;
      }
      if (this.mode == 0) {
        this.nowSongListData.forEach((ele, index) => {
          if (ele.song.id == this.nowPlaySongId) {
            if (index == this.nowSongListData.length - 1) {
              this.index = -1;
            } else {
              this.index = index;
            }
          }
        });
        let id = this.nowSongListData[this.index + 1].song.id;
        this.setNowPlaySongId({ nowPlaySongId: id, isPlaySong: true });
      } else if (this.mode == 1) {
        audio.load();
      } else {
        let random = Math.random() * this.nowSongListData.length;
        random = Math.floor(random);
        let id = this.nowSongListData[random].song.id;
        this.setNowPlaySongId({ nowPlaySongId: id, isPlaySong: true });
      }
    },
    ...mapMutations([
      "setnowPlaySongCurrentTime",
      "setnowPlaySongDuration",
      "setNowPlaySongId",
      "setIsPlaySong",
      "setSliderCurrentTime",
    ]),
  },
};
</script>

<style lang="less">
body {
  margin: 0 auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f6f6f6;
}
#app {
  width: 100%;
  height: 100%;
}
.auto-img {
  width: 100%;
  display: block;
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c93d2d;
  font-style: italic;
  font-size: 16px;
  padding-top: 4px;
  font-weight: bold;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
// 模块通用顶部
.generalTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 13px;
  .generalTitle {
    font-size: 18px;
    // font-weight: bold;
  }
  .generalBtn {
    display: flex;
    align-items: center;
    border: 1px solid #d2d2d2;
    border-radius: 20px;
    padding-left: 8px;
    padding-right: 2px;
    padding: 2px 4px 2px 10px;
  }
}
</style>
