<template>
  <div>
    <div class="playStatus" v-show="isShow" @click="showPlaySongPage">
      <div class="songImg">
        <van-image
          round
          width="26px"
          height="26px"
          fit="cover"
          :src="nowPlaySongMsg.al ? nowPlaySongMsg.al.picUrl : ''"
        />
      </div>
      <div class="songMsg">
        <div class="songName">{{ nowPlaySongMsg.name }}</div>
        <div class="singer">-</div>
        <div class="singer">
          {{ nowPlaySongMsg.ar[0].name }}
        </div>
      </div>
      <div class="songBtn">
        <div class="playBtn" @click.stop="isPlayBtn">
          <van-icon v-if="isPlaySong" name="pause" size="16" color="#323333" />
          <van-icon v-else name="play" size="16" color="#323333" />
        </div>
        <van-icon
          name="bars"
          size="22"
          color="#323333"
          @click.stop="showSonglist"
        />
      </div>
    </div>
    <!-- 播放页面 -->
    <div class="shwoPlaySongPage">
      <van-popup
        v-model="show"
        closeable
        close-icon-position="top-left"
        position="bottom"
        close-icon="arrow-down"
        @close="showTitle"
        @closed="closed"
        :style="{
          height: '100%',
        }"
      >
        <div class="playSongPageContent">
          <div class="topTitle">
            <div class="topTitltCenter">
              <div class="songName">{{ nowPlaySongMsg.name }}</div>
              <div class="singerName">{{ nowPlaySongMsg.ar[0].name }}</div>
            </div>
            <div class="share">
              <van-icon name="share-o" size="22" color="#f9f9f9" />
            </div>
          </div>
          <div @click="showLyric" class="lyricBox">
            <div
              class="lyrics"
              v-if="isLyric"
              :style="{
                top: topHeight + 'px',
                transition: isTransition ? 'top 0.2s linear' : 'top 0 linear',
              }"
            >
              <p
                v-for="(a, b) in lyricArray"
                :key="b"
                :class="highlightIndex == b ? 'active' : ''"
              >
                <span @click.stop="lyricArrayClick(a)">
                  {{ a.lyric }}
                </span>
              </p>
            </div>
            <div class="songRound" ref="songRound" v-else>
              <div class="blackRound">
                <van-image
                  round
                  width="200px"
                  height="200px"
                  fit="cover"
                  :src="
                    nowPlaySongMsg.al.picUrl ? nowPlaySongMsg.al.picUrl : ''
                  "
                />
              </div>
            </div>
          </div>
          <div class="bottomBtn">
            <div class="variousBtn">
              <div class="variousBtnItem" @click="likeSong">
                <van-icon v-if="!isLike" name="like-o" size="24px" />
                <van-icon v-else name="like" size="24px" color="red" />
              </div>
              <div class="variousBtnItem">
                <van-icon name="chat-o" size="24px" />
              </div>
              <div class="variousBtnItem">
                <van-icon name="more-o" size="24px" />
              </div>
            </div>
            <div class="slider">
              <div>{{ nowPlaySongCurrentTime }}</div>
              <van-slider
                v-model="value"
                bar-height="2px"
                active-color="#d7d7d7a0"
                inactive-color="#e5e5e534"
                @change="onChange"
                @drag-start="dragStart"
                @drag-end="dragEnd"
                button-size="10px"
                :style="{ margin: '0 10px' }"
              />
              <div>{{ nowPlaySongDuration }}</div>
            </div>
            <div class="playPause">
              <div style="width: 28px">
                <van-icon
                  class="iconfont fontColor"
                  class-prefix="iconfont"
                  :name="
                    mode == 0
                      ? 'shunxubofang'
                      : mode == 1
                      ? 'danquxunhuan'
                      : 'ziyuan'
                  "
                  size="18"
                  @click="changeMode"
                />
              </div>
              <van-icon
                class="iconfont fontColor"
                class-prefix="iconfont"
                name="shangyishouweidianji"
                size="18"
                @click.stop="lastSong()"
              />
              <div @click.stop="isPlayBtn">
                <van-icon v-if="isPlaySong" name="pause-circle-o" size="50" />
                <van-icon v-else name="play-circle-o" size="50" />
              </div>
              <van-icon
                class="iconfont fontColor"
                class-prefix="iconfont"
                name="xiayishouweidianji"
                size="18"
                @click.stop="nextSong()"
              />
              <van-icon name="bars" size="25" @click.stop="showSonglist" />
            </div>
          </div>
        </div>
        <div
          class="bgImg"
          :style="{
            backgroundImage: nowPlaySongMsg.al
              ? `url(${nowPlaySongMsg.al.picUrl})`
              : '',
          }"
        ></div>
      </van-popup>
    </div>
    <!-- 正在播放歌单页面 -->
    <div class="showPlaySongList">
      <van-popup
        v-model="showPlaySongList"
        position="bottom"
        :style="{ height: '60%' }"
        :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.4)' }"
      >
        <div class="playSongNow">
          <h2 class="playSongNowTitle">
            当前播放<span class="songNum">({{ nowSongListData.length }})</span>
          </h2>
          <div class="playSongNowContent">
            <div
              class="playSongNowItem"
              v-for="(a, b) in nowSongListData"
              :key="b"
              @click="
                setNowPlaySongId({
                  nowPlaySongId: a.song.id,
                  isPlaySong: true,
                })
              "
            >
              <van-icon
                v-if="a.song.id == nowPlaySongId"
                class="iconfont fontColor"
                class-prefix="iconfont"
                name="bofangzhong"
                size="12"
                :style="{ color: '#dd001b', marginRight: '4px' }"
              />
              <div
                class="songName"
                :style="{
                  color: a.song.id == nowPlaySongId ? '#dd001b' : '#000',
                }"
              >
                {{ a.song.name }}
              </div>
              <div
                class="center"
                :style="{
                  color: a.song.id == nowPlaySongId ? '#dd001b' : '#afafaf',
                }"
              >
                -
              </div>
              <div
                class="artistsName"
                :style="{
                  color: a.song.id == nowPlaySongId ? '#dd001b' : '#afafaf',
                }"
              >
                {{ a.artists[0].name }}
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Playstatusnav",
  props: {
    isShowPlayPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      nowPlaySongMsg: {
        name: null,
        ar: [{ name: null }],
        al: {
          picUrl: null,
        },
      },
      isShow: false,
      show: false,
      value: 0,
      showPlaySongList: false,
      mode: 0,
      isLyric: false,
      lyricText: null,
      lyricArray: [],
      topHeight: null,
      highlightIndex: 0,
      isTransition: false,
      isDrag: false,
      isLike: false,
    };
  },
  computed: {
    ...mapState(["nowPlaySongId", "isPlaySong", "nowSongListData"]),
    ...mapState({
      Duration(state) {
        return state.nowPlaySongDuration;
      },
      nowPlaySongDuration(state) {
        let num = this.formatTime(state.nowPlaySongDuration);
        return num;
      },
      nowPlaySongCurrentTime(state) {
        this.playLyric(state.nowPlaySongCurrentTime);
        let num = this.formatTime(state.nowPlaySongCurrentTime);
        if (!this.isDrag) {
          this.value = (100 * state.nowPlaySongCurrentTime) / this.Duration;
        }
        return num;
      },
    }),
  },
  watch: {
    nowPlaySongId() {
      this.getPlaySongMsg();
      this.getLyric();
    },
    isShowPlayPage(nv) {
      if (nv == true) {
        this.showPlaySongPage();
      }
    },
    show(nv) {
      if (nv == false) {
        this.$emit("hidePlaySongPage", false);
      }
    },
  },
  created() {
    this.isShow = this.nowPlaySongId ? true : false;
    if (this.isShow) {
      this.getPlaySongMsg();
      this.getLyric();
    }
  },

  methods: {
    //获取当前播放歌曲
    getPlaySongMsg() {
      this.axios({
        url: `song/detail`,
        method: "get",
        //参数
        params: {
          ids: this.nowPlaySongId,
        },
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            
            this.nowPlaySongMsg = result.data.songs[0];
            this.isShow = true;
          } else {
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 获取歌词
    getLyric() {
      this.axios({
        url: `lyric`,
        method: "get",
        //参数
        params: {
          id: this.nowPlaySongId,
        },
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            this.lyricText = result.data.lrc.lyric;
            this.disposeLyric();
          } else {
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 处理歌词
    disposeLyric() {
      let lyric = this.lyricText.trim();
      lyric = lyric.split("\n");
      let lyricArray = [];
      lyric.forEach((ele) => {
        let timeLyric = ele.split("]");
        let lyricItem = timeLyric[1];
        let lyricTime = timeLyric[0].split("[")[1].split(":");
        let minutes = null;
        if (lyricTime[0].split("0").join("")) {
          minutes = lyricTime[0].split("0").join("");
        } else {
          minutes = 0;
        }
        let secondsNum = +lyricTime[1];
        minutes = +minutes;
        let seconds = minutes * 60 + secondsNum;
        seconds = seconds.toFixed(2);
        let lyricObj = {
          time: seconds,
          lyric: lyricItem,
        };
        if (lyricObj.lyric) {
          lyricArray.push(lyricObj);
        }
      });

      this.lyricArray = lyricArray;
      
    },
    // 播放歌词
    playLyric(nowTime) {
      let lyricPHeight = 40;
      for (let i = 0; i < this.lyricArray.length; i++) {
        if (i + 1 !== this.lyricArray.length) {
          let first = Number(this.lyricArray[i].time);
          let next = Number(this.lyricArray[i + 1].time);
          if (nowTime >= first && nowTime <= next) {
            let topHeight = -i * lyricPHeight + 160;
            if (this.topHeight == topHeight) {
              return;
            }
            this.topHeight = topHeight;
            this.highlightIndex = i;
          }
        }
      }
    },
    // 点击歌词
    lyricArrayClick(a) {
      this.setSliderCurrentTime({ newCurrentTime: a.time });
    },
    // 喜欢音乐
    likeSong() {
      let cookie = localStorage.getItem("userCookie");
      if (!cookie) {
        return;
      }
      let islike = null;
      if (this.isLike) {
        islike = false;
      } else {
        islike = true;
      }
      this.axios({
        url: `like`,
        method: "get",
        //参数
        params: {
          id: this.nowPlaySongId,
          like: islike,
          cookie: cookie,
        },
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            this.isLike = !this.isLike;
            if (this.isLike) {
              Toast("已添加到我喜欢的音乐");
            } else {
              Toast("已移除喜欢");
            }
          } else {
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 获取喜欢音乐列表
    likeSongList() {
      let cookie = localStorage.getItem("userCookie");
      let uid = localStorage.getItem("userId");
      if (!cookie) {
        return;
      }
      this.axios({
        url: `likelist`,
        method: "get",
        //参数
        params: {
          uid: uid,
          cookie: cookie,
        },
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            for (let i = 0; i < result.data.ids.length; i++) {
              if (result.data.ids[i] == this.nowPlaySongId) {
                this.isLike = true;
                return;
              }
              this.isLike = false;
            }
          } else {
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 播放暂停
    isPlayBtn() {
      if (this.isPlaySong) {
        this.setOtherPlaySong({ otherPlaySong: false });
        if (this.show) {
          this.showPlaySongPage();
        }
      } else {
        this.setOtherPlaySong({ otherPlaySong: true });
        if (this.show) {
          this.showPlaySongPage();
        }
      }
    },
    showPlaySongPage() {
      this.show = true;
      this.$nextTick(() => {
        let songRound = this.$refs.songRound;
        if (!songRound) {
          return;
        }
        if (this.isPlaySong) {
          songRound.style.animationPlayState = "running";
        } else {
          songRound.style.animationPlayState = "paused";
        }
      });
      this.$emit("myclick", false);
      this.$emit("homeclick", false);
      this.likeSongList();
    },
    // 进度条
    onChange(value) {
      let currentTime = (this.Duration * value) / 100;
      this.setSliderCurrentTime({ newCurrentTime: currentTime });
    },
    dragStart() {
      this.isDrag = true;
    },
    dragEnd() {
      this.isDrag = false;
    },
    //处理时间格式 mm:ss
    formatTime(second) {
      var minutes = Math.floor(second / 60);
      minutes = minutes >= 10 ? minutes : "0" + minutes;
      var seconds = Math.floor(second % 60);
      seconds = seconds >= 10 ? seconds : "0" + seconds;
      return minutes + ":" + seconds;
    },
    showTitle() {
      this.$emit("myclick", true);
      this.$emit("homeclick", true);
    },
    closed() {
      this.isLyric = false;
    },
    // 显示当前播放歌单
    showSonglist() {
      this.showPlaySongList = true;
      if (this.nowSongListData.length == 0) {
        let obj = {
          song: {
            id: this.nowPlaySongMsg.id,
            name: this.nowPlaySongMsg.name,
          },
          artists: [
            {
              name: this.nowPlaySongMsg.ar[0].name,
            },
          ],
        };
        this.nowSongListData.push(obj);
      }
    },
    // 下一首
    nextSong() {
      // 获取时间戳
      let timestamp = Date.now();
      
      this.setNextPlay({ nextPlay: timestamp });
    },
    // 上一首
    lastSong() {
      if (this.nowSongListData.length == 1) {
        this.nextSong();
        return;
      }
      if (this.mode == 0 || 1) {
        this.nowSongListData.forEach((ele, index) => {
          if (ele.song.id == this.nowPlaySongId) {
            if (index == 0) {
              this.index = this.nowSongListData.length;
            } else {
              this.index = index;
            }
          }
        });
        let id = this.nowSongListData[this.index - 1].song.id;
        this.setNowPlaySongId({ nowPlaySongId: id, isPlaySong: true });
      } else if (this.mode == 2) {
        let random = Math.random() * this.nowSongListData.length;
        random = Math.floor(random);
        let id = this.nowSongListData[random].song.id;
        this.setNowPlaySongId({ nowPlaySongId: id, isPlaySong: true });
      }
    },
    // 显示歌词
    showLyric() {
      this.isLyric = !this.isLyric;
      setTimeout(() => {
        this.isTransition = !this.isTransition;
      }, 200);
    },
    changeMode() {
      this.mode += 1;
      if (this.mode == 3) {
        this.mode = 0;
      }
      this.setMode({
        mode: this.mode,
      });
    },
    ...mapMutations([
      "setIsPlaySong",
      "setNowPlaySongId",
      "setnowPlaySongCurrentTime",
      "setSliderCurrentTime",
      "setOtherPlaySong",
      "setMode",
      "setNextPlay",
    ]),
  },
};
</script>

<style lang="less" scoped>
.playStatus {
  height: 36px;
  background-color: #fdfdfd;
  padding: 0 18px 4px;
  border-top: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .songImg {
    width: 26px;
    height: 26px;
    padding: 6px;
    border-radius: 50%;
    background-color: #000;
    position: absolute;
    top: -4px;
  }
  .songMsg {
    line-height: 36px;
    display: flex;
    align-items: center;
    padding-left: 46px;
    overflow: hidden;
    .songName {
      font-size: 14px;
      white-space: nowrap;
    }
    .singer {
      margin-left: 4px;
      color: #686869;
      white-space: nowrap;
    }
  }
  .songBtn {
    display: flex;
    align-items: center;
    .playBtn {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid #c7c7c7;
      margin-right: 18px;
    }
  }
}
.shwoPlaySongPage {
  .playSongPageContent {
    width: 100%;
    height: 100%;
    padding-top: 25px;
    box-sizing: border-box;
    color: #dadada5d;
    .topTitle {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px 0 0;
      .songName {
        width: 240px;
        max-height: 70px;
        color: #e7e7e7;
        font-size: 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .singerName {
        color: #c7c7c7;
        font-size: 14px;
        margin-top: 6px;
      }
    }
    .share {
      position: absolute;
      top: 40px;
      right: 16px;
    }
    .songRound {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 140px;
      left: 0;
      right: 0;
      margin: 0 auto;
      animation: turn 10s linear infinite;
      .blackRound {
        padding: 40px;
        background-color: #0f0f0f;
        border-radius: 50%;
        box-shadow: 0 0 0px 10px rgba(170, 170, 170, 0.2);
      }
      @keyframes turn {
        0% {
          -webkit-transform: rotate(0deg);
        }
        25% {
          -webkit-transform: rotate(90deg);
        }
        50% {
          -webkit-transform: rotate(180deg);
        }
        75% {
          -webkit-transform: rotate(270deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }
    }
    .bottomBtn {
      position: fixed;
      bottom: 0px;
      left: 0;
      right: 0;
      color: #dddddd;
      .variousBtn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px 20px;
      }
      .slider {
        padding: 14px 30px 0;
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #d7d7d7a0;
      }
      .playPause {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px 30px 40px;
      }
    }
  }
  .bgImg {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-size: cover;
    background-position: center center;
    filter: blur(18px) brightness(70%);
  }
}

.shwoPlaySongPage {
  .playSongPageContent {
    width: 100%;
    height: 100%;
    padding-top: 25px;
    box-sizing: border-box;
    color: #dadada5d;
    .topTitle {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px 0 20px;
      .songName {
        width: 240px;
        max-height: 70px;
        color: #e7e7e7;
        font-size: 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .singerName {
        color: #c7c7c7;
        font-size: 14px;
        margin-top: 6px;
      }
    }
    .lyricBox {
      height: 360px;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      position: relative;
      overflow: hidden;

      .lyrics {
        width: 100%;
        color: #b3b3b3;
        position: absolute;
        left: 0;
        user-select: none;
        .active {
          color: #fff;
        }
      }

      .lyrics p {
        margin: 0;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .share {
      position: absolute;
      top: 40px;
      right: 16px;
    }
    .songRound {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 160px;
      left: 0;
      right: 0;
      margin: 0 auto;
      animation: turn 10s linear infinite;
      .blackRound {
        padding: 40px;
        background-color: #0f0f0f;
        border-radius: 50%;
        box-shadow: 0 0 0px 10px rgba(170, 170, 170, 0.2);
      }
      @keyframes turn {
        0% {
          -webkit-transform: rotate(0deg);
        }
        25% {
          -webkit-transform: rotate(90deg);
        }
        50% {
          -webkit-transform: rotate(180deg);
        }
        75% {
          -webkit-transform: rotate(270deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }
    }
    .bottomBtn {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      color: #dddddd;
      .variousBtn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px 20px;
      }
      .slider {
        padding: 14px 30px 0;
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #d7d7d7a0;
      }
      .playPause {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px 30px 40px;
      }
    }
  }
  .bgImg {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-size: cover;
    background-position: center center;
    filter: blur(60px) brightness(70%);
  }
}
.showPlaySongList {
  /deep/ .van-popup--bottom {
    bottom: 57px;
    left: 50%;
    transform: translateX(-50%);
    width: 92%;
    border-radius: 16px;
  }
  .playSongNow {
    padding: 0 14px;
    .playSongNowTitle {
      position: sticky;
      top: 0;
      background-color: #fff;
      margin: 0;
      padding: 15px 0;
    }
    .songNum {
      font-size: 12px;
      color: #afafaf;
    }
  }
  .playSongNowContent {
    .playSongNowItem {
      padding: 10px 0;
      display: flex;
      align-items: center;
      .songName {
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .center {
        font-size: 20px;
        margin: 0 4px;
      }
      .artistsName {
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
/deep/ .van-popup__close-icon--top-left {
  top: 40px;
  color: #f9f9f9;
}
</style>