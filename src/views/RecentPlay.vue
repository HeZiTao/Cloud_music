<template>
  <div class="recentplay">
    <div class="navTop">
      <van-nav-bar title="最近播放" @click-left="onClickLeft">
        <template #left>
          <van-icon name="arrow-left" size="24" color="#999" />
        </template>
      </van-nav-bar>
    </div>
    <div
      class="SearchContentContent"
      :style="{ bottom: nowPlaySongId ? '41px' : '0' }"
    >
      <div class="singleSong">
        <div
          class="singleSongItem"
          v-for="(item, index) in recentPlayList"
          :key="index"
          @click="songItemClick(item)"
        >
          <div class="left">
            <van-icon
              v-if="item.data.id == nowPlaySongId"
              class="iconfont fontColor"
              class-prefix="iconfont"
              name="bofangzhong"
              size="12"
              :style="{ color: '#dd001b', marginRight: '18px' }"
            />
            <div>
              <div class="songName">{{ item.data.name }}</div>
              <div class="singer">
                <span class="sq" v-if="item.data.sq">SQ</span>
                <span class="singerSong">{{ item.data.ar[0].name }}</span>
                <span class="center">-</span>
                <span class="singerName">{{ item.data.name }}</span>
              </div>
              <div class="alia" v-for="(a, b) in item.data.alia" :key="b">
                {{ a }}
              </div>
            </div>
          </div>

          <div class="right" @click.stop="playMv(item.mv)">
            <van-icon
              v-if="item.data.mv !== 0"
              class="iconfont fontColor"
              class-prefix="iconfont"
              name="mv"
              size="22"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "RecentPlay",
  data() {
    return {
      recentPlayList: [],
      nowSongListItem: [],
    };
  },
  computed: {
    ...mapState(["nowPlaySongId", "nowSongListData"]),
  },
  created() {
    this.getRecentPlay();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getRecentPlay() {
      let cookie = localStorage.getItem("userCookie");
      this.axios({
        url: "record/recent/song",
        methods: "get",
        params: {
          limit: this.limit,
          cookie: cookie,
        },
      })
        .then((result) => {
          if (result.status == 200) {
            
            result.data.data.list.forEach((ele) => {
              this.recentPlayList.push(ele);
            });
            
          } else {
            
          }
        })
        .catch((err) => {
          Toast.clear();
        });
    },
    songItemClick(item) {
      this.$emit("showPlaySongPage", true);
      this.setNowPlaySongId({
        nowPlaySongId: item.data.id,
        isPlaySong: true,
      });
      this.setOtherPlaySong({ otherPlaySong: true });
      this.songListBtn(item);
    },
    songListBtn(item) {
      if (this.nowSongListData.length > 0) {
        this.nowSongListItem = this.nowSongListData;
      }
      for (let i = 0; i < this.nowSongListData.length; i++) {
        if (this.nowSongListData[i].song.id == item.data.id) {
          return;
        }
      }
      let obj = {
        song: {
          id: item.data.id,
          name: item.data.name,
        },
        artists: [
          {
            name: item.data.ar[0].name,
          },
        ],
      };
      this.nowSongListItem.unshift(obj);
      this.setNowSongListData({ nowSongListItem: this.nowSongListItem });
    },
    playMv(mv) {
      this.setOtherPlaySong({ otherPlaySong: false });
      this.$router.push({ name: "Video", params: { mvid: mv } });
    },
    ...mapMutations({
      setNowSongListData: "setNowSongListData",
      setOtherPlaySong: "setOtherPlaySong",
      setNowPlaySongId(commit, params) {
        if (this.nowPlaySongId == params.nowPlaySongId) {
          return;
        }
        commit("setNowPlaySongId", params);
      },
    }),
  },
};
</script>

<style lang="less" scoped>
.navTop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: 26px;
  background-color: #fff;
}
.SearchContentContent {
  position: fixed;
  top: 72px;
  left: 0;
  right: 0;
  bottom: 41px;
  overflow: scroll;
  .singleSong {
    .singleSongItem {
      width: 92%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0px;
      border-bottom: 1px solid rgb(230, 230, 230);
      .left {
        display: flex;
        align-items: center;
        .songName {
          font-size: 16px;
        }
        .singer {
          margin: 4px 0;
          .sq {
            border: 1px solid #c93d2d;
            color: #c93d2d;
            border-radius: 3px;
            padding: 0 2px;
            margin-right: 4px;
          }
          .singerSong {
            color: rgb(68, 116, 205);
          }
          .center {
            font-size: 13px;
            margin: 0 2px;
            color: #8a8a8a;
          }
          .singerName {
            color: #8a8a8a;
          }
        }
        .alia {
          color: #8a8a8a;
        }
      }
    }
  }
}
</style>