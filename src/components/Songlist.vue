<template>
  <div class="recommendSong">
    <div class="generalTop">
      <div class="generalTitle">{{ dataName }}</div>
      <div class="generalBtn">
        <div>更多</div>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="recommendSongContent">
      <div class="recommendSongSwipe">
        <div
          class="recommendSongSwipeItem"
          v-for="(a, b) in data"
          :key="b"
          @click="songListClick(a)"
        >
          <div class="reItemImg">
            <img class="auto-img" :src="a.uiElement.image.imageUrl" alt="" />
            <div class="playCount">
              <van-icon name="play" />
              {{ playCountArray[b] }}
            </div>
          </div>
          <div class="reItemText">
            {{ a.uiElement.mainTitle.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Songlist",
  props: {
    data: {
      type: Array,
      default() {
        return {};
      },
    },
    dataName: {
      type: String,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      playCountArray: [],
    };
  },
  activated() {
    this.getPlayCount();
  },
  methods: {
    getPlayCount() {
      this.data.forEach((ele) => {
        let playCount = ele.resources[0].resourceExtInfo.playCount;
        playCount = playCount.toString();
        if (playCount.length >= 5) {
          playCount = playCount.slice(0, -4);
          playCount = playCount.toString();
          if (playCount.length >= 5) {
            playCount = playCount.slice(0, -4);
            playCount += "亿";
            this.playCountArray.push(playCount);
          } else {
            playCount += "万";
            this.playCountArray.push(playCount);
          }
        }
      });
    },
    songListClick(a) {
      this.$router.push({ name: "Songlistall", params: { songlist: a } });
    },
  },
};
</script>

<style lang="less" scoped>
// 通用背景颜色和间距
.bgmb {
  padding-top: 14px;
  background-color: #fff;
  margin-bottom: 10px;
}
.recommendSong {
  .bgmb();
  .recommendSongContent {
    height: 144px;
    margin-top: 6px;
    padding: 0 9px;
    overflow-x: scroll;
    overflow-y: hidden;
    .recommendSongSwipe {
      width: calc(110px * 6);
      height: 136px;
      overflow: hidden;
      .recommendSongSwipeItem {
        width: 102px;
        height: 100%;
        display: inline-block;
        margin: 0 4px;
        .reItemImg {
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          .playCount {
            position: absolute;
            top: 4px;
            right: 6px;
            color: #fff;
            border-radius: 10px;
            padding: 0 2px;
            background-color: rgba(150, 150, 150, 0.4);
          }
        }
        .reItemText {
          height: 30px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          padding-top: 4px;
        }
      }
    }
  }
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