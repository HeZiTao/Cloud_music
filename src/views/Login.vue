<template>
  <div class="login" :style="{ backgroundColor: isLogin ? '#c93d2d' : '#fff' }">
    <div class="experience" v-if="isLogin" @click="experienceBtn">立即体验</div>
    <div class="loginLogo">
      <van-icon
        class="iconfont"
        class-prefix="iconfont"
        name="yinle"
        size="60"
        color="#fff"
      />
    </div>
    <div class="loginContent" v-if="isLogin">
      <form action="">
        <div class="loginPhone allInput">
          <input
            type="text"
            placeholder="请输入手机号码"
            autocomplete="off"
            v-model="loginPhone"
          />
        </div>
        <div class="loginPassword allInput">
          <input
            type="password"
            placeholder="请输入登录密码"
            autocomplete="off"
            v-model="loginPassword"
          />
        </div>
        <div class="loginBtn" @click="checkPhone">登录</div>
      </form>

      <div class="registeredBtn" @click="registeredBtn">注册</div>
    </div>
    <div class="loginContent" v-else>
      <van-nav-bar left-arrow fixed @click-left="returnBtn">
        <template #left>
          <van-icon name="arrow-left" color="#c93d2d" size="24" />
        </template>
      </van-nav-bar>
      <div class="registeredTitle">注册</div>
      <form action="">
        <div
          class="loginPhone allInput"
          :style="{
            border: isLogin ? '2px solid #fff' : '2px solid #c93d2d',
          }"
        >
          <input
            type="text"
            placeholder="请输入手机号码"
            autocomplete="off"
            value=""
          />
        </div>
        <div
          class="loginPassword allInput"
          :style="{
            border: isLogin ? '2px solid #fff' : '2px solid #c93d2d',
          }"
        >
          <input
            type="password"
            placeholder="请输入注册密码"
            autocomplete="off"
            value=""
          />
        </div>
        <div
          class="loginBtn"
          :style="{
            backgroundColor: isLogin ? '#fff' : '#c93d2d',
            color: isLogin ? '#c93d2d' : '#fff',
          }"
        >
          注册
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Toast } from "vant";
export default {
  name: "Login",
  data() {
    return {
      isLogin: true,
      loginPhone: null,
      loginPassword: null,
      cookie: null,
    };
  },
  methods: {
    returnBtn() {
      this.isLogin = true;
    },
    registeredBtn() {
      this.isLogin = false;
    },
    experienceBtn() {
      this.$router.push("Discover");
    },
    // 检测手机号码是否已经注册
    checkPhone() {
      if (!this.loginPhone) {
        Toast("请输入手机号码");
        return;
      } else if (!this.loginPassword) {
        Toast("请输入密码");
        return;
      } else if (this.loginPhone.length < 11) {
        Toast("请输入正确的手机号码");
        return;
      }
      Toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        loadingType: "spinner",
        //不会自动关闭提示
        duration: 0,
      });
      let timestamp = Date.now();
      this.axios({
        url: `cellphone/existence/check`,
        method: "post",
        //参数
        data: {
          phone: this.loginPhone,
          timestamp: timestamp,
        },
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            
            if (result.data.code == 200) {
              if (result.data.exist >= 1) {
                this.userLogin();
              } else {
                Toast.clear();
                Toast("该手机号码未注册，请先注册");
              }
            }
          } else {
            Toast.clear();
            
          }
        })
        .catch((err) => {
          Toast.clear();
          
        });
    },
    // 手机密码登录账号
    userLogin() {
      // 获取时间戳
      let timestamp = Date.now();
      
      this.axios({
        url: `login/cellphone`,
        method: "post",
        //参数
        data: {
          phone: this.loginPhone,
          password: this.loginPassword,
          timestamp: timestamp,
        },
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            Toast.clear();
            
            if (result.data.code == 200) {
              let cookie = result.data.cookie;
              let userId = result.data.profile.userId;
              localStorage.setItem("userCookie", cookie);
              localStorage.setItem("userId", userId);
              // this.setUserCookie({ cookie: cookie, userId: userId });
              this.loginPhone = null;
              this.loginPassword = null;
              this.$router.push("My");
            } else if (result.data.code == 502) {
              Toast(result.data.msg);
            } else {
              if (result.data.msg) {
                Toast(result.data.msg);
              } else {
                Toast("登录失败");
              }
            }
          } else {
            Toast.clear();
            
          }
        })
        .catch((err) => {
          Toast.clear();
          
        });
    },
    // ...mapMutations({
    //   setUserCookie(commit, params) {
    //     commit("setUserCookie", params);
    //   },
    // }),
  },
};
</script>

<style lang="less" scoped>
input {
  border: none;
  width: 100%;
  font-size: 14px;
}
.login {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .experience {
    position: absolute;
    top: 18px;
    right: 10px;
    font-size: 14px;
    color: #e6ada7;
  }
  .loginLogo {
    width: 60px;
    height: 60px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin: 0 auto;
    margin-top: 150px;
    background-color: #da3f32;
    border-radius: 50%;
    margin-bottom: 80px;
  }
  .loginContent {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    position: relative;
    .allInput {
      width: 230px;
      padding: 8px 20px;
      background-color: #fff;
      margin-bottom: 18px;
      border-radius: 10px;
    }
    .loginBtn {
      width: 200px;
      background-color: #fff;
      padding: 6px 0px;
      text-align: center;
      font-size: 16px;
      border-radius: 20px;
      margin: 26px auto;
      color: #c93d2d;
      font-weight: bold;
    }
    .registeredBtn {
      padding: 0 2px;
      color: #fff;
      font-size: 15px;
      border-bottom: 2px solid #fff;
      margin-top: 100px;
    }
  }
}
.registeredTitle {
  font-size: 30px;
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  color: #c93d2d;
}
/deep/ .van-nav-bar {
  background-color: transparent;
}
/deep/.van-hairline--bottom::after {
  border-bottom: none;
}
</style>