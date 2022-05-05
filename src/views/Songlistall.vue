<template>
  <div class="Songlistall">
    <div class="topNav" v-show="isHide">
      <div
        class="topNavBg"
        :style="{
          backgroundImage: playlist.coverImgUrl
            ? `url(${playlist.coverImgUrl})`
            : playlist.blurPicUrl
            ? `url(${playlist.blurPicUrl})`
            : '',
        }"
      ></div>
      <van-nav-bar
        :title="
          fromPage ? '每日推荐歌曲' : playlist.coverImgUrl ? '歌单' : '专辑'
        "
        left-arrow
        :fixed="true"
        @click-left="onClickLeft"
      >
        <template #left>
          <van-icon name="arrow-left" size="24" color="#ebe9e9" />
        </template>
        <template #right>
          <van-icon name="search" size="24" color="#ebe9e9" />
        </template>
      </van-nav-bar>
    </div>
    <div class="songList">
      <div class="songListMsg">
        <div class="songListImg">
          <img
            class="auto-img"
            :src="
              playlist.coverImgUrl ? playlist.coverImgUrl : playlist.blurPicUrl
            "
            alt=""
          />
        </div>
        <div class="title">
          <div class="titleImg">
            <img
              class="auto-img"
              :src="
                playlist.coverImgUrl
                  ? playlist.coverImgUrl
                  : playlist.blurPicUrl
              "
              alt=""
            />
          </div>
          <div class="titleText">{{ playlist.name }}</div>
        </div>
      </div>
      <div class="songListContent">
        <div
          class="songListItem"
          v-for="(x, y) in songListMsg"
          :key="y"
          @click="itemClick(x)"
        >
          <div class="left">
            <div class="itemNum" v-if="!fromPage">{{ y + 1 }}</div>
            <div class="itemNum" v-else>
              <van-image
                width="40px"
                height="40px"
                fit="cover"
                :src="recommendSongList[y].al.picUrl"
              />
            </div>
            <van-icon
              v-if="x.id == nowPlaySongId"
              class="iconfont fontColor"
              class-prefix="iconfont"
              name="bofangzhong"
              size="12"
              :style="{ color: '#dd001b', marginRight: '10px' }"
            />
            <div class="itemAll">
              <div
                class="itemSongName"
                :style="{
                  color: x.id == nowPlaySongId ? '#dd001b' : '#444446',
                }"
              >
                {{ x.name }}
              </div>
              <div class="itemSingerName">
                {{ x.ar[0].name }} <span class="center">-</span> {{ x.name }}
              </div>
            </div>
          </div>
          <div class="right" @click.stop="playMv(x.mv)">
            <van-icon
              v-if="x.mv !== 0"
              class="iconfont fontColor"
              class-prefix="iconfont"
              name="mv"
              size="22"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="bottomNav">
      <Playstatusnav @myclick="isHideClick" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Toast } from "vant";
import Playstatusnav from "../components/Playstatusnav.vue";
export default {
  name: "Songlistall",
  components: {
    Playstatusnav,
  },
  data() {
    return {
      songListMsg: null,
      trackIds: "",
      playlist: { coverImgUrl: null, blurPicUrl: null },
      nowPlaySongMsg: {
        name: null,
        ar: [{ name: null }],
        al: {
          picUrl: null,
        },
      },
      isShow: false,
      isHide: true,
      fromPage: null,
      recommendSongList: null,
    };
  },
  computed: {
    ...mapState(["nowPlaySongId", "isPlaySong", "nowSongListData"]),
  },
  activated() {
    this.playlist = { coverImgUrl: null, blurPicUrl: null };
    this.songListMsg = null;
    // 获取专辑信息
    let targetId = this.$route.params.targetId;
    // 获取来自推荐歌单
    this.fromPage = this.$route.params.fromPage;
    if (targetId) {
      this.getAlbumList(targetId);
      return;
    }
    if (this.fromPage == "recommendSong") {
      this.getRecommendSong();
      return;
    }
    //获取歌单信息
    this.getSongList();
  },
  methods: {
    //   获取歌单信息
    getSongList() {
      this.trackIds = "";
      //启动加载提示
      Toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        loadingType: "spinner",
        //不会自动关闭提示
        duration: 0,
      });
      let songlist = this.$route.params.songlist;
      let cookie = localStorage.getItem("userCookie");
      if (cookie) {
        cookie = "&cookie=" + cookie;
      } else {
        cookie = "";
      }
      this.axios({
        method: "get",
        url: `playlist/detail?id=${songlist.creativeId + cookie}`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            
            this.playlist = result.data.playlist;
            let trackIds = result.data.playlist.trackIds;
            trackIds.forEach((ele, index) => {
              if (index == trackIds.length - 1) {
                this.trackIds += ele.id;
              } else {
                this.trackIds += ele.id + ",";
              }
            });
            this.getAllSongs();
          } else {
            Toast.clear();
            
          }
        })
        .catch((err) => {
          Toast.clear();
          Toast.fail("加载失败");
          setTimeout(() => {
            this.$router.push({
              name: "Discover",
            });
          }, 2000);
          
        });
    },
    // 获取歌单所有歌曲
    getAllSongs() {
      let cookie = localStorage.getItem("userCookie");
      if (cookie) {
        cookie = "&cookie=" + cookie;
      } else {
        cookie = "";
      }
      this.axios({
        method: "get",
        url: `song/detail?ids=${this.trackIds + cookie}`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            this.songListMsg = result.data.songs;
            
            Toast.clear();
          } else {
            
            Toast.clear();
          }
        })
        .catch((err) => {
          Toast.clear();
        });
    },
    // 获取专辑信息
    getAlbumList(targetId) {
      this.trackIds = "";
      //启动加载提示
      Toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        loadingType: "spinner",
        //不会自动关闭提示
        duration: 0,
      });
      let cookie = localStorage.getItem("userCookie");
      if (cookie) {
        cookie = "&cookie=" + cookie;
      } else {
        cookie = "";
      }
      this.axios({
        method: "get",
        url: `album?id=${targetId + cookie}`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            
            this.playlist = result.data.album;
            let trackIds = result.data.songs;
            trackIds.forEach((ele, index) => {
              if (index == trackIds.length - 1) {
                this.trackIds += ele.id;
              } else {
                this.trackIds += ele.id + ",";
              }
            });
            this.getAllSongs();
          } else {
            Toast.clear();
            
          }
        })
        .catch((err) => {
          Toast.clear();
          Toast.fail("加载失败");
          setTimeout(() => {
            this.$router.push({
              name: "Discover",
            });
          }, 2000);
          
        });
    },
    // 获取每日推荐
    getRecommendSong() {
      this.trackIds = "";
      //启动加载提示
      Toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        loadingType: "spinner",
        //不会自动关闭提示
        duration: 0,
      });
      let cookie = localStorage.getItem("userCookie");
      if (cookie) {
        cookie = "?cookie=" + cookie;
      } else {
        cookie = "";
      }
      this.axios({
        method: "get",
        url: `recommend/songs${cookie}`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            this.recommendSongList = result.data.data.dailySongs;
            
            this.playlist.coverImgUrl =
              result.data.data.dailySongs[0].al.picUrl;
            let trackIds = result.data.data.dailySongs;
            trackIds.forEach((ele, index) => {
              if (index == trackIds.length - 1) {
                this.trackIds += ele.id;
              } else {
                this.trackIds += ele.id + ",";
              }
            });
            
            this.getAllSongs();
          } else {
            Toast.clear();
            
          }
        })
        .catch((err) => {
          Toast.clear();
          Toast.fail("加载失败");
          setTimeout(() => {
            this.$router.push({
              name: "Discover",
            });
          }, 2000);
          
        });
    },
    // 跳转播放mv
    playMv(mv) {
      this.setOtherPlaySong({ otherPlaySong: false });
      this.$router.push({ name: "Video", params: { mvid: mv } });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    itemClick(a) {
      this.setNowPlaySongId({
        nowPlaySongId: a.id,
        isPlaySong: true,
      });
      this.setOtherPlaySong({ otherPlaySong: true });
      this.songListBtn();
    },
    songListBtn() {
      let nowSongListItem = [];
      this.songListMsg.forEach((ele) => {
        let obj = {
          song: {
            id: ele.id,
            name: ele.name,
          },
          artists: [
            {
              name: ele.ar[0].name,
            },
          ],
        };
        nowSongListItem.push(obj);
      });
      this.setNowSongListData({ nowSongListItem: nowSongListItem });
    },
    isHideClick(e) {
      this.isHide = e;
    },
    ...mapMutations([
      "setNowSongListData",
      "setNowPlaySongId",
      "setOtherPlaySong",
    ]),
  },
};
</script>

<style lang="less" scoped>
.Songlistall {
  .topNav {
    height: 73px;
    .topNavBg {
      height: 70px;
      position: fixed;
      top: -4px;
      left: 0;
      right: 0;
      z-index: 1;
      background-size: cover;
      background-position: 0 4px;
      filter: blur(4px) brightness(90%);
    }
  }
  .songList {
    background-color: #fff;
    position: fixed;
    top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: scroll;
    .songListMsg {
      position: relative;
      .songListImg {
        width: 100%;
        height: 280px;
        overflow: hidden;
        img {
          position: relative;
          z-index: -1;
          filter: blur(4px) brightness(90%);
        }
      }
      .title {
        width: 100%;
        position: absolute;
        left: 0;
        top: 34%;
        color: #fff;
        font-size: 18px;
        display: flex;
        padding: 0 22px;
        box-sizing: border-box;
        .titleImg {
          width: 50%;
          margin-right: 18px;
          overflow: hidden;
          border-radius: 10px;
        }
        .titleText {
          width: 50%;
        }
      }
    }
    .songListContent {
      padding: 14px 14px 40px;
      .songListItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        .left {
          display: flex;
          align-items: center;
          .itemNum {
            color: #9a9a9a;
            font-size: 16px;
            margin-right: 10px;
          }
          .itemSongName {
            font-size: 16px;
          }
          .itemSingerName {
            color: #989898;
          }
        }
      }
    }
  }
  .bottomNav {
    height: 41px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
/deep/ .van-nav-bar--fixed {
  padding-top: 26px;
  background-color: transparent;
}
/deep/ .van-hairline--bottom::after {
  border-bottom: none;
}
/deep/ .van-nav-bar__title {
  color: #fff;
}
</style>