<template>
  <div class="SearchContent">
    <div class="SearchContentTop">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        shape="round"
        @focus="returnSearchSuggest"
        background="rgb(250, 250, 250)"
      >
        <template #left>
          <van-icon
            name="arrow-left"
            color="#030303"
            size="26"
            @click="returnBtn"
          />
        </template>
      </van-search>
      <van-tabs
        v-model="active"
        background="rgb(250, 250, 250)"
        @change="changeType"
      >
        <van-tab
          v-for="(item, index) in tabsArray"
          :title="item.name"
          :key="index"
        ></van-tab>
      </van-tabs>
    </div>
    <div
      class="SearchContentContent"
      :style="{ bottom: nowPlaySongId ? '41px' : '0' }"
    >
      <div class="singleSong">
        <div
          class="singleSongItem"
          v-for="(item, index) in searchSongsArray"
          :key="index"
          @click="songItemClick(item)"
        >
          <div class="left">
            <van-icon
              v-if="item.id == nowPlaySongId"
              class="iconfont fontColor"
              class-prefix="iconfont"
              name="bofangzhong"
              size="12"
              :style="{ color: '#dd001b', marginRight: '18px' }"
            />
            <div>
              <div class="songName">{{ item.name }}</div>
              <div class="singer">
                <span class="sq" v-if="item.sq">SQ</span>
                <span class="singerSong">{{ item.ar[0].name }}</span>
                <span class="center">-</span>
                <span class="singerName">{{ item.name }}</span>
              </div>
              <div class="alia" v-for="(a, b) in item.alia" :key="b">
                {{ a }}
              </div>
            </div>
          </div>

          <div class="right" @click.stop="playMv(item.mv)">
            <van-icon
              v-if="item.mv !== 0"
              class="iconfont fontColor"
              class-prefix="iconfont"
              name="mv"
              size="22"
            />
          </div>
        </div>
        <van-loading v-show="isLoading" size="24px" vertical
          >加载中...</van-loading
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "SearchContent",
  data() {
    return {
      value: "",
      active: 0,
      tabsArray: [
        // {
        //   name: "综合",
        //   type: 1018,
        // },
        {
          name: "单曲",
          type: 1,
        },
        // {
        //   name: "专辑",
        //   type: 10,
        // },
        {
          name: "歌单",
          type: 1000,
        },
        {
          name: "视频",
          type: 1014,
        },
        // {
        //   name: "歌手",
        //   type: 100,
        // },
        // {
        //   name: "歌词",
        //   type: 1006,
        // },
        // {
        //   name: "用户",
        //   type: 1002,
        // },
        // {
        //   name: "MV",
        //   type: 1004,
        // },
        // {
        //   name: "电台",
        //   type: 1009,
        // },
        // {
        //   name: "声音",
        //   type: 2000,
        // },
      ],
      searchSongsArray: [],
      searchPlaylistsArray: [],
      searchVideosArray: [],

      nowSongListItem: [],
      isLoading: false,
    };
  },
  computed: {
    ...mapState(["nowPlaySongId", "nowSongListData"]),
  },
  created() {
    this.getSearchContent();
  },
  methods: {
    // 获取搜索内容
    getSearchContent() {
      this.isLoading = true;
      this.value = this.$route.params.val;
      let type = this.tabsArray[this.active].type;
      this.axios({
        url: `/cloudsearch`,
        method: "get",
        params: {
          keywords: this.value,
          limit: 30,
          type: type,
        },
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            if (result.data.code == 200) {
              if (result.data.result.songs) {
                result.data.result.songs.forEach((ele) => {
                  this.searchSongsArray.push(ele);
                });
              } else if (result.data.result.playlists) {
                result.data.result.playlists.forEach((ele) => {
                  this.searchPlaylistsArray.push(ele);
                });
              } else if (result.data.result.videos) {
                result.data.result.videos.forEach((ele) => {
                  this.searchVideosArray.push(ele);
                });
              }

              this.isLoading = false;
              
            }
          } else {
            
          }
        })
        .catch((err) => {
          
        });
    },
    //点击搜索框左侧按钮
    returnBtn() {
      this.$router.push("Search");
    },
    // 搜索框获得焦点
    returnSearchSuggest() {
      this.$router.push({
        name: "Search",
        params: { val: this.value },
      });
    },
    // 切换不同类型的标签
    changeType() {
      this.getSearchContent();
    },
    // 点击单曲Item
    songItemClick(item) {
      this.$emit("showPlaySongPage", true);
      this.setNowPlaySongId({
        nowPlaySongId: item.id,
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
        if (this.nowSongListData[i].song.id == item.id) {
          return;
        }
      }
      let obj = {
        song: {
          id: item.id,
          name: item.name,
        },
        artists: [
          {
            name: item.ar[0].name,
          },
        ],
      };
      this.nowSongListItem.unshift(obj);
      this.setNowSongListData({ nowSongListItem: this.nowSongListItem });
    },
    // 跳转播放mv
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
.SearchContent {
  .SearchContentTop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-top: 26px;
    background-color: #fafafa;
  }
  .SearchContentContent {
    position: fixed;
    top: 123px;
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
}
/deep/ .van-search__content {
  background-color: rgb(243, 243, 243);
}
</style>