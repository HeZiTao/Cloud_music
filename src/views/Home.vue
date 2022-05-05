<template>
  <div class="home">
    <!-- 内容接口 -->
    <div class="homeContent">
      <keep-alive include="Discover,My,Search,Songlistall">
        <router-view @showPlaySongPage="showPlaySongPage" />
      </keep-alive>
    </div>
    <!-- 播放状态栏 -->
    <!-- <div class="playStatus" v-show="isShow" @click="showPlaySongPage">
      <div class="songImg">
        <van-image
          round
          width="26px"
          height="26px"
          fit="cover"
          :src="nowPlaySongMsg.al.picUrl"
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
    </div> -->
    <div class="Playstatusnav" :style="{ bottom: isHide ? '50px' : '0px' }">
      <Playstatusnav
        @homeclick="isHideClick"
        :isShowPlayPage="isShowPlayPage"
        @hidePlaySongPage="hidePlaySongPage"
      />
    </div>
    <!-- 播放页面 -->
    <!-- <div class="shwoPlaySongPage">
      <van-popup
        v-model="show"
        closeable
        close-icon-position="top-left"
        position="bottom"
        close-icon="arrow-down"
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
          <div class="songRound" ref="songRound">
            <div class="blackRound">
              <van-image
                round
                width="200px"
                height="200px"
                fit="cover"
                :src="nowPlaySongMsg.al.picUrl"
              />
            </div>
          </div>
          <div class="bottomBtn">
            <div class="variousBtn">
              <div class="variousBtnItem">
                <van-icon name="like-o" size="24px" />
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
                button-size="10px"
                :style="{ margin: '0 10px' }"
              />
              <div>{{ nowPlaySongDuration }}</div>
            </div>
            <div class="playPause">
              <van-icon
                class="iconfont fontColor"
                class-prefix="iconfont"
                name="shunxubofang"
                size="18"
              />
              <van-icon
                class="iconfont fontColor"
                class-prefix="iconfont"
                name="shangyishouweidianji"
                size="18"
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
              />
              <van-icon name="bars" size="25" @click.stop="showSonglist" />
            </div>
          </div>
        </div>
        <div
          class="bgImg"
          :style="{
            backgroundImage: `url(${nowPlaySongMsg.al.picUrl})`,
          }"
        ></div>
      </van-popup>
    </div> -->
    <!-- 正在播放歌单页面 -->
    <!-- <div class="showPlaySongList">
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
    </div> -->

    <!-- 底部标签栏 -->
    <van-tabbar
      v-model="active"
      active-color="#ee4b46"
      inactive-color="#afafaf"
      fixed
      :route="true"
      v-show="isHide"
    >
      <van-tabbar-item
        v-for="(item, index) in tabbarIcon"
        :key="index"
        :to="item.routerName"
      >
        <span>{{ item.title }}</span>
        <template #icon="props">
          <div class="tabbarItem">
            <van-icon
              class="iconfont"
              class-prefix="iconfont"
              :name="item.name"
              :size="props.active ? 18 : 22"
              :style="{
                background: props.active
                  ? 'linear-gradient(45deg, #fd373e ,#fd9ea0)'
                  : 'none',
                borderRadius: '50%',
                padding: props.active ? '4px' : '0',
                color: props.active ? 'white' : '#afafaf',
              }"
            />
          </div>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Toast } from "vant";
import Playstatusnav from "../components/Playstatusnav.vue";
export default {
  name: "Home",
  components: {
    Playstatusnav,
  },
  data() {
    return {
      active: 0,
      tabbarIcon: [
        {
          name: "yinle",
          title: "发现",
          routerName: "/discover",
        },
        // {
        //   name: "tubiaozhizuomobanyihuifu-",
        //   title: "播客",
        // },
        {
          name: "yinle1",
          title: "我的",
          routerName: "/my",
        },
        // {
        //   name: "ren3",
        //   title: "关注",
        // },
        {
          name: "zimu-M",
          title: "云村",
        },
      ],
      routerName: [
        "Search",
        "SearchContent",
        "Songlistall",
        "",
        "Rankinglist",
        "RecommendList",
        "RecentPlay",
      ],
      // nowPlaySongMsg: {
      //   name: null,
      //   ar: [{ name: null }],
      //   al: {
      //     picUrl: null,
      //   },
      // },
      isShow: false,
      // show: false,
      // showPlaySongList: false,
      // value: 0,
      isHide: true,
      isShowPlayPage: false,
    };
  },
  computed: {
    // ...mapState(["nowPlaySongId", "isPlaySong", "nowSongListData"]),
    // ...mapState({
    //   Duration(state) {
    //     return state.nowPlaySongDuration;
    //   },
    // nowPlaySongDuration(state) {
    //   let num = this.formatTime(state.nowPlaySongDuration);
    //   return num;
    // },
    // nowPlaySongCurrentTime(state) {
    //   let num = this.formatTime(state.nowPlaySongCurrentTime);
    //   this.value = (100 * state.nowPlaySongCurrentTime) / this.Duration;
    //   return num;
    // },
    // }),
  },
  watch: {
    //   nowPlaySongId() {
    //     this.getPlaySongMsg();
    //   },
    // },
    // created() {
    //   this.isShow = this.isPlaySong ? true : false;
    //   if (this.isShow) {
    //     this.getPlaySongMsg();
    //   }
    $route: "getRouterName",
  },
  methods: {
    getRouterName() {
      if (this.routerName.indexOf(this.$route.name) > -1) {
        this.isHide = false;
      } else {
        this.isHide = true;
      }
    },
    showPlaySongPage(a) {
      this.isShowPlayPage = a;
    },
    hidePlaySongPage(a) {
      this.isShowPlayPage = a;
    },
    // getPlaySongMsg() {
    //   this.axios({
    //     url: `song/detail`,
    //     method: "get",
    //     //参数
    //     params: {
    //       ids: this.nowPlaySongId,
    //     },
    //   })
    //     .then((result) => {
    //       // status请求成功
    //       if (result.status == 200) {
    //         
    //         this.nowPlaySongMsg = result.data.songs[0];
    //         this.isShow = true;
    //       } else {
    //         
    //       }
    //     })
    //     .catch((err) => {
    //       
    //     });
    // },
    // isPlayBtn() {
    //   if (this.isPlaySong) {
    //     this.setOtherPlaySong({ otherPlaySong: false });
    //     if (this.show) {
    //       this.showPlaySongPage();
    //     }
    //   } else {
    //     this.setOtherPlaySong({ otherPlaySong: true });
    //     if (this.show) {
    //       this.showPlaySongPage();
    //     }
    //   }
    // },
    // 显示播放页面
    // showPlaySongPage() {
    //   this.show = true;
    //   this.$nextTick(() => {
    //     let songRound = this.$refs.songRound;
    //     if (this.isPlaySong) {
    //       songRound.style.animationPlayState = "running";
    //     } else {
    //       songRound.style.animationPlayState = "paused";
    //     }
    //   });
    // },
    // 显示当前播放歌单
    // showSonglist() {
    //   this.showPlaySongList = true;
    //   
    // },
    // 进度条
    // onChange(value) {
    //   let currentTime = (this.Duration * value) / 100;
    //   this.setSliderCurrentTime({ newCurrentTime: currentTime });
    // },
    // 隐藏标签栏
    isHideClick(e) {
      if (this.routerName.indexOf(this.$route.name) > -1) {
        return;
      }
      this.isHide = e;
    },
    //处理时间格式 mm:ss
    // formatTime(second) {
    //   var minutes = Math.floor(second / 60);
    //   minutes = minutes >= 10 ? minutes : "0" + minutes;
    //   var seconds = Math.floor(second % 60);
    //   seconds = seconds >= 10 ? seconds : "0" + seconds;
    //   return minutes + ":" + seconds;
    // },
    // ...mapMutations([
    //   "setIsPlaySong",
    //   "setNowPlaySongId",
    //   "setnowPlaySongCurrentTime",
    //   "setSliderCurrentTime",
    //   "setOtherPlaySong",
    // ]),
  },
};
</script>

<style lang="less" scoped>
.homeContent {
  position: fixed;
  top: 25px;
  left: 0;
  right: 0;
  bottom: 50px;
}
.Playstatusnav {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
}

.tabbarItem {
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/ .van-tabbar-item__icon {
  height: 24px;
}
</style>
