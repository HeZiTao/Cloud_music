<template>
  <div class="Songlistall">
    <!-- <div class="topNav" v-show="isHide">
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
        :title="playlist.coverImgUrl ? '歌单' : '专辑'"
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
          <div class="itemNum">{{ y + 1 }}</div>
          <div class="itemAll">
            <div
              class="itemSongName"
              :style="{ color: x.id == nowPlaySongId ? '#dd001b' : '#444446' }"
            >
              {{ x.name }}
            </div>
            <div class="itemSingerName">
              {{ x.ar[0].name }} <span class="center">-</span> {{ x.name }}
            </div>
          </div>
          <van-icon
            v-if="x.id == nowPlaySongId"
            class="iconfont fontColor"
            class-prefix="iconfont"
            name="bofangzhong"
            size="22"
            :style="{ color: '#dd001b', marginLeft: '22px' }"
          />
        </div>
      </div>
    </div>
    <div class="bottomNav">
      <Playstatusnav @myclick="isHideClick" />
    </div> -->
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "RecommendSong",

  methods: {
    getRecommendSong() {
      let cookie = localStorage.getItem("userCookie");
      if (cookie) {
        cookie = "?cookie=" + cookie;
      } else {
        cookie = "";
      }
      this.axios({
        method: "get",
        url: `recommend/resource${cookie}`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            
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
      padding: 14px;
      .songListItem {
        display: flex;
        align-items: center;
        padding: 10px 0;
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