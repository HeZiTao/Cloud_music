<template>
  <div class="rankinglist">
    <div class="navTop">
      <van-nav-bar title="排行榜" @click-left="onClickLeft">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#999" />
        </template>
      </van-nav-bar>
    </div>
    <div class="rankinglistContetn">
      <!-- <van-tabs v-model="active" sticky offset-top="72px"> -->
      <!-- <van-tab title="官方榜"> -->
      <div class="officialList">
        <div class="artistToplist">
          <div class="listTitle">
            <div class="listName">{{ artistToplist.name }}</div>
            <div class="upateFrequency">
              {{ artistToplist.upateFrequency }}
            </div>
          </div>
          <div class="listContent">
            <van-image
              width="60px"
              height="60px"
              fit="cover"
              radius="10px"
              :src="artistToplist.coverUrl"
            />
            <div class="listItems">
              <div
                class="listItem"
                v-for="(a, b) in artistToplist.artists"
                :key="b"
              >
                <div class="num">{{ b + 1 }}.</div>
                <div>
                  {{ a.first }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="officialTitle">
          <div class="loginLogo">
            <van-icon
              class="iconfont"
              class-prefix="iconfont"
              name="yinle"
              size="16"
              color="#fff"
            />
          </div>
          <div class="officialName">官方榜</div>
        </div>
        <div
          class="officialItem"
          v-for="(a, b) in officialList"
          :key="b"
          :style="{ backgroundColor: officialListColor[b].bgcolor }"
          @click="itemClick(a)"
        >
          <div class="itemTop">{{ a.updateFrequency }}</div>
          <div class="itemContent">
            <div class="itemLeft">
              <div :style="{ color: officialListColor[b].color }">
                {{ a.name }}
              </div>
              <van-image
                width="70px"
                height="70px"
                fit="cover"
                radius="10px"
                :src="a.coverImgUrl"
              />
            </div>
            <div class="itemRight">
              <div class="itemTrack" v-for="(a, b) in a.tracks" :key="b">
                <div>{{ b + 1 }}.</div>
                <div>{{ a.first }}</div>
                <div>-</div>
                <div>{{ a.second }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="officialTitle">
          <div class="loginLogo">
            <van-icon
              class="iconfont"
              class-prefix="iconfont"
              name="yinle"
              size="16"
              color="#fff"
            />
          </div>
          <div class="officialName">全球榜</div>
        </div>
        <div class="worldList">
          <div
            class="worldListItem"
            v-for="(a, b) in worldList"
            :key="b"
            @click="itemClick(a)"
          >
            <van-image
              radius="10px"
              width="100%"
              fit="cover"
              :src="a.coverImgUrl"
            />
            <div class="itemName">
              {{ a.name }}
            </div>
            <div class="newTime">{{ a.updateFrequency }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "rankinglist",
  data() {
    return {
      active: 0,
      artistToplist: {
        name: null,
        upateFrequency: null,
        coverUrl: null,
      },
      officialList: [],
      worldList: [],
      officialListColor: [
        { color: "#e82e77", bgcolor: "#f9eaef" },
        { color: "#1f9587", bgcolor: "#e9f2f1" },
        { color: "#376dc0", bgcolor: "#ebeef5" },
        { color: "#e42021", bgcolor: "#f8e8e8" },
      ],
    };
  },
  created() {
    this.getRankingList();
  },
  methods: {
    getRankingList() {
      Toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        loadingType: "spinner",
        //不会自动关闭提示
        duration: 0,
      });
      this.axios({
        method: "get",
        url: "toplist/detail",
      })
        .then((result) => {
          if (result.status == 200) {
            this.artistToplist = result.data.artistToplist;
            result.data.list.forEach((ele) => {
              if (ele.tracks.length !== 0) {
                this.officialList.push(ele);
              } else {
                this.worldList.push(ele);
              }
            });
            
            Toast.clear();
          } else {
            Toast.clear();
            
          }
        })
        .catch((err) => {
          Toast.clear();
        });
    },
    // 点击排行榜
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
    // 点击返回按钮
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.rankinglist {
  padding-bottom: 46px;
  .navTop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-top: 26px;
    background-color: #fff;
  }
  .rankinglistContetn {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    .officialList {
      padding: 0 14px;
      .artistToplist {
        box-sizing: border-box;
        padding: 10px;
        border-radius: 10px;
        margin: 16px auto 0;
        background-color: #eddbf5;
        .listTitle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .listName {
            font-size: 17px;
            font-weight: bold;
          }
          .upateFrequency {
            color: #b9b9b9;
          }
        }
        .listContent {
          display: flex;
          align-items: center;
          padding: 10px 10px 4px;
          .listItems {
            height: 100%;
            display: flex;
            padding-left: 10px;
            .listItem {
              display: flex;
              align-items: center;
              font-size: 16px;
              margin-left: 10px;
              .num {
                color: #8851b9;
                font-size: 18px;
                font-weight: bold;
                margin-right: 4px;
              }
            }
          }
        }
      }
      .officialTitle {
        display: flex;
        align-items: center;
        padding: 10px 0 8px;
        .loginLogo {
          width: 16px;
          height: 16px;
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #df2a21;
          border-radius: 50%;
        }
        .officialName {
          font-size: 16px;
          font-weight: bold;
          margin-left: 4px;
        }
      }
      .officialItem {
        padding: 4px 10px 10px;
        background-color: aquamarine;
        margin-bottom: 8px;
        border-radius: 10px;
        .itemTop {
          text-align: right;
          color: #c5c4c4;
        }
        .itemContent {
          display: flex;
          align-items: center;
          .itemLeft {
            width: 36%;
            box-sizing: border-box;
            padding-right: 24px;
            text-align: center;
            div:first-child {
              font-size: 20px;
              margin-bottom: 2px;
            }
          }
          .itemRight {
            width: 64%;
            height: 80px;
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
            .itemTrack {
              display: flex;
              align-items: center;
              div {
                font-size: 13px;
              }
              div:first-child {
                margin-right: 2px;
                font-size: 14px;
              }
              div:nth-child(3) {
                margin: 0 3px;
                font-size: 16px;
                color: #90878a;
              }
              div:nth-child(4) {
                width: 90px;
                color: #90878a;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
      .worldList {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        background-color: #fff;
        border-radius: 10px;
        padding: 10px 0;
        .worldListItem {
          width: 115px;
          height: 160px;
          box-sizing: border-box;
          padding: 0 4px 10px;
          position: relative;
          .itemName {
            height: 39px;
            font-size: 14px;
          }
          .newTime {
            position: absolute;
            top: 4px;
            right: 8px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 6px;
            padding: 0 4px;
          }
        }
      }
    }
  }
}
</style>