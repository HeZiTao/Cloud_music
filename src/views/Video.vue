<template>
  <div class="video">
    <div class="navTop">
      <van-nav-bar title="Mv" @click-left="onClickLeft">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#999" />
        </template>
      </van-nav-bar>
    </div>
    <div class="videoBox">
      <video
        autoplay
        loop
        controls
        width="100%"
        height="216px"
        :src="mvUrl"
      ></video>
    </div>
    <div class="videoContent">
      <div class="videoMsg">
        <div class="userMsg">
          <div class="left">
            <div class="userImg">
              <van-image
                round
                width="40px"
                height="40px"
                fit="cover"
                :src="mvMsg.artists[0].img1v1Url"
              />
            </div>
            <div class="userName">{{ mvMsg.artistName }}</div>
          </div>
          <div class="rigth">+关注</div>
        </div>
        <div class="mvMsg">
          <div class="mvOne">
            <div class="mv">MV</div>
            <div class="mvName">{{ mvMsg.name }}</div>
          </div>
          <div class="mvTwo">{{ mvMsg.desc }}</div>
        </div>
      </div>
      <div class="otherVideo">
        <h2>相关MV推荐</h2>
        <div
          class="otherViedoItem"
          v-for="(a, b) in otherMvArray"
          :key="b"
          @click="playMv(a.id)"
        >
          <div class="itemImg">
            <van-image width="150px" fit="contain" :src="a.cover" />
          </div>
          <div class="itemMsg">
            <div>
              <span class="mv">MV</span>
              {{ a.name }}
            </div>
            <div>{{ a.artistName }}</div>
            <div>{{ a.playCount }}次播放</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "Video",
  data() {
    return {
      mvUrl: null,
      mvMsg: { artists: [{ img1v1Url: null }] },
      otherMvArray: [],
      mvid: null,
    };
  },
  created() {
    this.mvid = this.$route.params.mvid;
    this.getMvMsg();
    this.getMvMsgUrl();
    this.getOtherMv();
  },
  watch: {
    mvid(nv) {
      this.getMvMsg();
      this.getMvMsgUrl();
      this.getOtherMv();
    },
  },
  methods: {
    onClickLeft() {
      this.$router.push("Discover");
      //   this.$router.go(-1);
    },
    getMvMsg() {
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
        url: `mv/detail?mvid=${this.mvid + cookie}`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            Toast.clear();
            
            this.mvMsg = result.data.data;
            
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
    getMvMsgUrl() {
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
        url: `mv/url?id=${this.mvid + cookie}`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            Toast.clear();
            
            this.mvUrl = result.data.data.url;
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
    getOtherMv() {
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
        url: `simi/mv?mvid=${this.mvid + cookie}`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            Toast.clear();
            
            this.otherMvArray = result.data.mvs;
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
    playMv(mv) {
      this.mvid = mv;
    },
  },
};
</script>

<style lang="less" scoped>
.video {
  .navTop {
    padding-top: 26px;
    background-color: #fff;
  }
  .videoBox {
    width: 100%;
    height: 216px;
    background-color: #000;
  }
  .videoContent {
    position: fixed;
    top: 290px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
    .videoMsg {
      padding: 10px 14px;
      .userMsg {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          .userImg {
            width: 40px;
            height: 40px;
          }
          .userName {
            margin-left: 8px;
            font-size: 14px;
          }
        }
        .rigth {
          background-color: #dc3b29;
          color: #fff;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 13px;
        }
      }
      .mvMsg {
        padding-top: 14px;
        .mvOne {
          display: flex;
          align-items: center;

          .mvName {
            font-size: 16px;
            margin-left: 4px;
          }
        }
        .mvTwo {
          padding-top: 10px;
          font-size: 15px;
        }
      }
    }
    .otherVideo {
      padding: 0px 14px;
      h2 {
        margin-bottom: 0;
      }
      .otherViedoItem {
        height: 88px;
        display: flex;
        align-items: center;
        padding: 6px;
        .itemImg {
          border-radius: 10px;
          overflow: hidden;
        }
        .itemMsg {
          height: 100%;
          padding: 8px 6px;
          box-sizing: border-box;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-between;
          div:first-child {
            font-size: 16px;
          }
          div:nth-child(2) {
            color: rgb(164, 164, 164);
          }
          div:nth-child(3) {
            color: rgb(164, 164, 164);
          }
        }
      }
    }
  }
  .mv {
    color: #dc3b29;
    border: 1px solid #dc3b29;
    border-radius: 4px;
    padding: 0 2px;
    font-size: 12px;
  }
}
</style>