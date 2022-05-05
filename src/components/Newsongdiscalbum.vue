<template>
  <div class="Newsongdiscalbum">
    <van-swipe
      :loop="false"
      width="340"
      initial-swipe="1"
      :show-indicators="false"
      ref="swipeBox"
      @change="onChange"
    >
      <van-swipe-item></van-swipe-item>
      <van-swipe-item v-for="(item, index) in data" :key="index">
        <div
          class="musicItem"
          v-for="(a, b) in item.resources"
          :key="b"
          @click="itemClick(a)"
        >
          <div class="itemImg">
            <img class="auto-img" :src="a.uiElement.image.imageUrl" alt="" />
          </div>
          <div class="itemText">
            <div class="textTop">
              <div class="songName">{{ a.uiElement.mainTitle.title }}</div>
              <div class="center">-</div>
              <div class="songSinger">
                {{ a.resourceExtInfo.artists[0].name }}
              </div>
            </div>
            <div class="introduce">
              {{ a.uiElement.subTitle ? a.uiElement.subTitle.title : "" }}
            </div>
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item></van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Newsongdiscalbum",
  props: {
    data: {
      type: Array,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState(["nowPlaySongId"]),
  },
  methods: {
    onChange(index) {
      if (this.data.length + 1 == index) {
        this.$refs.swipeBox.swipeTo(index - 1);
      }
      if (index == 0) {
        this.$refs.swipeBox.swipeTo(1);
      }
    },
    itemClick(a) {
      
      if (a.resourceType == "song") {
        this.setNowPlaySongId({
          nowPlaySongId: a.resourceId,
          isPlaySong: true,
        });
        this.setOtherPlaySong({ otherPlaySong: true });
      } else if (a.resourceType == "album" || "digitalAlbum") {
        this.$router.push({
          name: "Songlistall",
          params: { targetId: a.resourceId },
        });
      }
    },
    ...mapMutations({
      setOtherPlaySong: "setOtherPlaySong",
      setNowPlaySongId(commit, params) {
        if (this.nowPlaySongId == params.nowPlaySongId) {
          this.$emit("showPlaySongPage", true);
        }
        commit("setNowPlaySongId", params);
      },
    }),
  },
};
</script>

<style lang="less" scoped>
.Newsongdiscalbum {
  padding-top: 2px;
  .musicItem {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 14px;
    .itemImg {
      width: 44px;
      margin: 6px 0;
      border-radius: 6px;
      overflow: hidden;
    }
    .itemText {
      margin-left: 8px;
      .textTop {
        display: flex;
        align-items: center;
        .songName {
          max-width: 160px;
          font-size: 14px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .center {
          margin: 0 4px;
          font-size: 14px;
          color: #b6b6b6;
        }
        .songSinger {
          display: flex;
          color: #b6b6b6;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .introduce {
        color: #b6b6b6;
      }
    }
  }
}
</style>