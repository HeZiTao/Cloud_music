<template>
  <div class="my" ref="myBox">
    <div
      class="myTop"
      :style="{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      }"
    >
      <van-nav-bar @click-left="onClickLeft">
        <template #left>
          <van-icon name="wap-nav" color="#4a4a4a" size="24" badge="1" />
        </template>
        <template #title>
          <div class="titleTop" :style="{ opacity: opacity }">
            <div class="titleImg">
              <img
                class="auto-img"
                :src="
                  !isLogin
                    ? 'http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg'
                    : avatarUrl
                "
                alt=""
              />
            </div>
            <div class="titleImgName">
              {{ !isLogin ? "" : userMsg.profile.nickname }}
            </div>
          </div>
        </template>
        <template #right>
          <van-icon name="search" color="#4a4a4a" size="24" />
        </template>
      </van-nav-bar>
    </div>
    <div class="userImgBox" @click="loginNowBtn" v-if="!isLogin">
      <div class="userPosition">
        <div class="userNotLoginImg">
          <img
            class="auto-img"
            src="http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg"
            alt=""
          />
        </div>
        <div class="loginNow">
          立即登录
          <van-icon name="arrow" size="16" />
        </div>
      </div>
    </div>
    <div class="userImgBox" v-else>
      <div class="userPosition">
        <div class="userNotLoginImg">
          <img class="auto-img" :src="userMsg.profile.avatarUrl" alt="" />
        </div>
        <div class="loginNow">
          <div class="userName">
            {{ userMsg.profile.nickname }}
          </div>
          <div class="userMsg">
            <div>{{ userMsg.profile.follows }} 关注</div>
            <div>{{ userMsg.profile.followeds }} 粉丝</div>
            <div>LV.{{ userMsg.level }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="userIcons">
      <div
        class="iconText"
        v-for="(item, index) in userIcons"
        :key="index"
        @click="iconItem(item.title)"
      >
        <van-icon
          class="iconfont fontColor"
          class-prefix="iconfont"
          :name="item.name"
          size="26"
          :style="{ color: 'linear-gradient(45deg, #fd373e ,#fd9ea0)' }"
        />
        <div class="iconTitle">{{ item.title }}</div>
      </div>
    </div>
    <div class="userLike" @click="createSongListClick(likeSongsList)">
      <div class="likeLeft">
        <div class="likeImg">
          <van-icon v-if="!isLogin" name="like" color="#fff" size="22" />
          <img
            v-else
            class="auto-img"
            :src="likeSongsList.coverImgUrl"
            alt=""
          />
        </div>
        <div class="likeMusic">
          <div>我喜欢的音乐</div>
          <div>{{ isLogin ? likeSongsList.trackCount : "0" }}首</div>
        </div>
      </div>
      <div class="likeRight">
        <van-icon name="like-o" />
        心动模式
      </div>
    </div>
    <div class="userSongs">
      <van-tabs
        v-model="active"
        scrollspy
        sticky
        offset-top="71"
        @scroll="tabsScroll"
        ref="tabsScroll"
      >
        <van-tab title="创建歌单">
          <div class="createSongs">
            <div class="createSongsTitle">
              创建歌单<span v-if="isLogin"
                >({{ createSongsList.length }}个)</span
              >
            </div>
            <div v-if="!isLogin" class="createSongsContet">暂无创建的歌单</div>
            <div v-else class="loginCreateSongsContet">
              <div
                class="createSongsItem"
                v-for="(a, b) in createSongsList"
                :key="b"
                @click="createSongListClick(a)"
              >
                <div class="createSongsItemImg">
                  <img class="auto-img" :src="a.coverImgUrl" alt="" />
                </div>
                <div class="createSongsItemMsg">
                  <div class="createSongsItemMsgName">{{ a.name }}</div>
                  <div class="createSongsItemMsgCount">
                    {{ a.trackCount }}首
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="收藏歌单">
          <div class="collectSongs createSongs">
            <div class="createSongsTitle">收藏歌单</div>
            <div class="createSongsContet">暂无收藏的歌单</div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import { mapState, mapMutations } from "vuex";
export default {
  name: "My",
  data() {
    return {
      // 图标信息
      userIcons: [
        {
          name: "24gf-playCircle",
          title: "最近播放",
        },
        {
          name: "24gf-musicAlbum",
          title: "本地/下载",
        },
        {
          name: "huiyunpan",
          title: "云盘",
        },
        {
          name: "iocn_yigoumaide",
          title: "已购",
        },
        {
          name: "renqun",
          title: "我的好友",
        },
        {
          name: "xingxing",
          title: "收藏和赞",
        },
        {
          name: "tubiaozhizuomobanyihuifu-",
          title: "我的播客",
        },
        {
          name: "yinle2",
          title: "音乐罐子",
        },
      ],
      active: 0,
      scrollTop: 0,
      opacity: 0,
      // 用户信息
      userMsg: {
        profile: {
          avatarUrl: null,
          nickname: null,
          follows: null,
          followeds: null,
        },
      },
      // 是否登录
      isLogin: false,
      // 用户cookie
      cookie: null,
      // 用户id
      userId: null,
      // 用户喜欢的音乐
      likeSongsList: { coverImgUrl: null },
      // 用户创建的歌单
      createSongsList: [],
      avatarUrl: null,
    };
  },
  computed: {
    // ...mapState(["userId"]),
    // ...mapState(["cookie"]),
  },
  created() {
    
    this.getUserMsg();
    // this.getUserAccount();
  },
  activated() {
    // 每次切换页面回来，滚动到原来的位置
    this.$nextTick(() => {
      let refs = this.$refs;
      refs.myBox.scrollTop = this.scrollTop;
    });
    // this.getNowPlaySongMsg({ trueFalse: true });
    // this.getUserAccount();
  },
  mounted() {
    let myBox = this.$refs.myBox;
    myBox.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    // 立即登录按钮事件
    loginNowBtn() {
      this.$router.push("Login");
    },
    // 获取用户信息
    getUserMsg() {
      if (this.userMsg.profile.avatarUrl) {
        this.isLogin = true;
        return;
      }
      this.cookie = localStorage.getItem("userCookie");
      this.userId = localStorage.getItem("userId");
      if (!this.userId) {
        Toast("请先登录");
        return;
      }
      // 获取时间戳
      let timestamp = Date.now();
      Toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        loadingType: "spinner",
        //不会自动关闭提示
        duration: 0,
      });
      if (this.userId) {
        this.axios({
          url: `user/detail`,
          method: "post",
          //参数
          data: {
            uid: this.userId,
            timestamp: timestamp,
          },
        })
          .then((result) => {
            // status请求成功
            if (result.status == 200) {
              this.userMsg = result.data;
              this.avatarUrl = this.userMsg.profile.avatarUrl;
              this.isLogin = true;
              Toast.clear();
              Toast("登录成功");
              this.getUserAccount();
            } else {
              
              Toast.clear();
            }
          })
          .catch((err) => {
            Toast.clear();
            
          });
      }
    },
    // 获取用户歌单
    getUserAccount() {
      // if (this.userMsg.profile.avatarUrl) {
      //   this.isLogin = true;
      //   return;
      // }
      this.axios({
        url: `user/playlist`,
        method: "post",
        //参数
        data: {
          uid: this.userId,
        },
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            
            result.data.playlist.forEach((ele, index) => {
              if (index == 0) {
                this.likeSongsList = ele;
              } else {
                this.createSongsList.push(ele);
              }
            });
          } else {
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 滚动事件
    handleScroll(e) {
      this.scrollTop = e.target.scrollTop;
      if (this.scrollTop <= 100) {
        this.opacity = this.scrollTop / 100;
      }
    },
    // 标签栏的滚动事件
    tabsScroll(a) {
      let tabsScroll = this.$refs.tabsScroll;
      if (a.isFixed) {
        tabsScroll.$children[0].style.backgroundColor = "#fff";
      }
    },
    // 点击汉堡菜单
    onClickLeft() {
      let cookie = localStorage.getItem("userCookie");
      if (!cookie) {
        return;
      }
      Dialog.confirm({
        message: "确定要退出登录吗?",
      })
        .then(() => {
          this.axios({
            url: `logout`,
            method: "post",
            //参数
            data: {
              cookie: cookie,
            },
          })
            .then((result) => {
              // status请求成功
              if (result.status == 200) {
                
                if (result.data.code == 200) {
                  
                  localStorage.removeItem("userCookie");
                  localStorage.removeItem("userId");
                  this.userMsg = null;
                  this.isLogin = false;
                }
              } else {
                
              }
            })
            .catch((err) => {
              
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    createSongListClick(a) {
      if (!this.isLogin) {
        Toast("请先登录");
        return;
      }
      
      this.$router.push({
        name: "Songlistall",
        params: { songlist: { creativeId: a.id } },
      });
    },
    iconItem(title) {
      if (title == "最近播放") {
        let cookie = localStorage.getItem("userCookie");
        if (cookie) {
          this.$router.push("RecentPlay");
        }
      }
    },
    // ...mapMutations(["getNowPlaySongMsg"]),
  },
};
</script>

<style lang="less" scoped>
// 通用
.widthBg {
  width: 90%;
  background-color: #fff;
  border-radius: 16px;
  margin: 14px auto 0;
}
.my {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  // 顶部导航栏
  .myTop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-top: 25px;
    z-index: 1;
    .titleTop {
      display: flex;
      align-items: center;
      .titleImg {
        width: 24px;
        height: 24px;
        padding: 2px;
        background-color: #f7f2f1;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        img {
          position: relative;
          top: 2px;
        }
      }
      .titleImgName {
        margin-left: 4px;
        font-size: 13px;
      }
    }
  }
  // 用户头像信息
  .userImgBox {
    .widthBg();
    height: 90px;
    margin-top: 100px;
    padding-bottom: 10px;
    position: relative;
    .userPosition {
      position: absolute;
      top: -50px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      .userNotLoginImg {
        width: 60px;
        height: 60px;
        background-color: #f7f2f1;
        border-radius: 50%;
        padding: 8px;
        margin-bottom: 14px;
        overflow: hidden;
        img {
          position: relative;
          top: 10px;
        }
      }
      .loginNow {
        text-align: center;
        font-size: 22px;
        .userMsg {
          width: 136px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #999999;
          margin-top: 4px;
        }
      }
    }
  }
  // 用户图标栏
  .userIcons {
    .widthBg();
    height: 130px;
    padding: 16px 0;
    display: flex;
    flex-flow: row wrap;
    .iconText {
      width: 25%;
      height: 50%;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
      .fontColor {
        background-image: -webkit-linear-gradient(45deg, #dd001b, #f4a8a6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .iconTitle {
        color: #717171;
      }
    }
  }
  // 用户喜欢音乐
  .userLike {
    .widthBg();
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    box-sizing: border-box;
    .likeLeft {
      display: flex;
      align-items: center;
      .likeImg {
        width: 50px;
        height: 50px;
        background-color: rgba(120, 120, 120, 0.4);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .likeMusic {
        margin-left: 6px;
        div:first-child {
          font-size: 16px;
        }
        div:nth-child(2) {
          color: #a7a7a7;
        }
      }
    }
    .likeRight {
      border: 1px solid #e3e3e3;
      padding: 2px 6px;
      border-radius: 10px;
    }
  }
  // 创建歌单/收藏歌单
  .userSongs {
    margin-bottom: 14px;
    .createSongs {
      .widthBg();
      // position: relative;
      // z-index: -1;
      padding: 14px;
      box-sizing: border-box;
      .createSongsTitle {
        color: #9e9e9e;
        font-size: 13px;
      }
      .createSongsContet {
        height: 90px;
        line-height: 90px;
        text-align: center;
        color: #9f9f9f;
        font-size: 14px;
      }
      .loginCreateSongsContet {
        padding-top: 12px;
        .createSongsItem {
          display: flex;
          align-items: center;
          padding-bottom: 10px;
          .createSongsItemImg {
            width: 46px;
            height: 46px;
            border-radius: 6px;
            overflow: hidden;
          }
          .createSongsItemMsg {
            margin-left: 10px;
            .createSongsItemMsgName {
              font-size: 14px;
            }
            .createSongsItemMsgCount {
              margin-top: 2px;
              color: #9f9f9f;
            }
          }
        }
      }
    }
    .collectSongs {
      .widthBg();
    }
  }
}
/deep/ .van-nav-bar {
  background-color: transparent;
}
/deep/.van-hairline--bottom::after {
  border-bottom: none;
}
/deep/ .van-tabs__nav {
  background-color: transparent;
}
</style>