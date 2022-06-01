<template>
  <div class="recommendlist">
    <div class="navTop">
      <van-nav-bar title="歌单广场" @click-left="onClickLeft">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#999" />
        </template>
      </van-nav-bar>
    </div>
    <div class="recommendlistContent" ref="recommendlistContent">
      <div class="title">热门推荐</div>
      <div class="worldList">
        <div
          class="worldListItem"
          v-for="(a, b) in recommendList"
          :key="b"
          @click="itemClick(a)"
        >
          <van-image radius="10px" width="100%" fit="cover" :src="a.picUrl" />
          <div class="itemName">
            {{ a.name }}
          </div>
        </div>
      </div>
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecommendList",
  data() {
    return {
      limit: 30,
      isSuccess: false,
      recommendList: [],
    };
  },
  created() {
    this.getRecommendList();
  },
  mounted() {
    // 为disconverContent添加一个滚动事件
    let recommendlistContent = this.$refs.recommendlistContent;
    recommendlistContent.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    getRecommendList() {
      this.axios({
        url: "personalized",
        methods: "get",
        params: {
          limit: this.limit,
        },
      })
        .then((result) => {
          if (result.status == 200) {
            result.data.result.forEach((ele) => {
              this.recommendList.push(ele);
            });

            this.isSuccess = false;
          } else {
          }
        })
        .catch((err) => {
          Toast.clear();
        });
      // this.axios({
      //   url: "personalized",
      //   methods: "get",
      //   params: {
      //     limit: this.limit,
      //   },
      // })
      //   .then((result) => {
      //     if (result.status == 200) {
      //       result.data.result.forEach((ele) => {
      //         this.recommendList.push(ele);
      //       });

      //       this.isSuccess = false;
      //     } else {

      //     }
      //   })
      //   .catch((err) => {
      //     Toast.clear();
      //   });
    },
    // 点击返回按钮
    onClickLeft() {
      this.$router.go(-1);
    },
    handleScroll(e) {
      let scrollTop = e.target.scrollTop;
      var recomendBoxHeight = e.target.clientHeight;
      var scrollHeight = e.target.scrollHeight;
      if (Math.abs(scrollHeight - scrollTop - recomendBoxHeight) <= 1) {
        if (this.isSuccess) {
          return;
        }
        this.isSuccess = true;
        this.limit += 30;
        this.getRecommendList();
      }
    },
    itemClick(a) {
      let obj = {
        creativeId: a.id,
      };
      this.$router.push({
        name: "Songlistall",
        params: {
          songlist: obj,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.recommendlist {
  .navTop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-top: 26px;
    background-color: #fff;
  }
  .recommendlistContent {
    position: fixed;
    top: 72px;
    left: 8px;
    right: 8px;
    bottom: 41px;
    overflow: scroll;
    .title {
      font-size: 18px;
      font-weight: bold;
      padding: 10px 14px 8px;
    }
    .worldList {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      background-color: #fff;
      border-radius: 10px;
      padding: 14px 6px;
      .worldListItem {
        width: 115px;
        height: 160px;
        box-sizing: border-box;
        padding: 0 4px 10px;
        position: relative;
        .itemName {
          height: 39px;
          font-size: 14px;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
}
</style>