<template>
  <div class="discover">
    <div class="search" @click="searchClick">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        input-align="center"
        shape="round"
        background="#f8f8f8"
      />
    </div>
    <div class="discoverContent" ref="discoverContent">
      <!-- 轮播图 -->
      <van-swipe :autoplay="3400" height="129" indicator-color="#fff">
        <van-swipe-item v-for="(image, index) in banner" :key="index">
          <div class="swipeItem" @click="bannerBtn(image)">
            <img class="swipeImg" v-lazy="image.imageUrl" />
            <div
              class="typeTitle"
              :style="{ backgroundColor: image.titleColor }"
            >
              {{ image.typeTitle }}
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
      <!-- 推荐图标 -->
      <div class="recommendIcon">
        <div
          class="iconItem"
          v-for="(a, b) in recommendIconArray"
          :key="b"
          @click="iconClick(a.title)"
        >
          <div class="icon">
            <van-icon
              class="iconfont"
              class-prefix="iconfont"
              :name="a.name"
              :size="a.name == 'gedan' ? 20 : 24"
              color="#fe373b"
            />
          </div>
          <div class="iconTitle">{{ a.title }}</div>
        </div>
      </div>
      <!-- 推荐歌单 -->
      <div class="recommendSong">
        <div class="generalTop">
          <div class="generalTitle">推荐歌单</div>
          <div class="generalBtn">
            <div>更多</div>
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="recommendSongContent">
          <div class="recommendSongSwipe">
            <div class="recommendSongSwipeItem">
              <van-swipe
                style="height: 100%"
                vertical
                :show-indicators="false"
                :autoplay="3000"
              >
                <van-swipe-item v-for="(a, b) in recommendSongFirst" :key="b">
                  <div class="reItemImg">
                    <img
                      class="auto-img"
                      :src="a.uiElement.image.imageUrl"
                      alt=""
                    />
                  </div>
                  <div class="reItemText">
                    {{ a.uiElement.mainTitle.title }}
                  </div>
                </van-swipe-item>
              </van-swipe>
            </div>
            <div
              class="recommendSongSwipeItem"
              v-for="(a, b) in recommendSong"
              :key="b"
              @click="songListClick(a)"
            >
              <div class="reItemImg">
                <img
                  class="auto-img"
                  :src="a.uiElement.image.imageUrl"
                  alt=""
                />
              </div>
              <div class="reItemText">
                {{ a.uiElement.mainTitle.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 为您定制 -->
      <div class="songList">
        <div class="generalTop">
          <div class="generalTitle">
            <van-icon name="replay" />
            {{ songListName }}
          </div>
          <div class="generalBtn" :style="{ paddingLeft: '4px' }">
            <van-icon name="play" />
            <div>播放</div>
          </div>
        </div>
        <div class="songListContent" @click="songListBtn">
          <Newsongdiscalbum
            @showPlaySongPage="showPlayPage"
            :data="songListData"
          />
        </div>
      </div>
      <!-- 雷达歌单 -->
      <Songlist :data="radarData" :dataName="radarDataName" />
      <!-- 热门博客/有声书 -->
      <div class="newSongDiscAlbum">
        <div class="generalTop">
          <div class="newSongDiscAlbumTopTitle">
            <div
              class="titleItem"
              :style="{ color: activePPIndex == b ? '#000' : '#999' }"
              v-for="(a, b) in popularPodcasts"
              :key="b"
              @click="changePopularActiveIndex(b)"
            >
              {{ a.name }}
            </div>
          </div>
          <div class="generalBtn">
            <div>更多</div>
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="newSongDiscAlbumContent">
          <div v-if="isPp">
            <div class="Newsongdiscalbum">
              <van-swipe
                :loop="false"
                width="340"
                initial-swipe="1"
                :show-indicators="false"
                ref="popularPodcastsBox"
                @change="onPopularPodcastsChange"
              >
                <van-swipe-item></van-swipe-item>
                <van-swipe-item
                  v-for="(item, index) in popularPodcastsData"
                  :key="index"
                >
                  <div
                    class="musicItem"
                    v-for="(a, b) in item.resources"
                    :key="b"
                    @click="hotBlog(a)"
                  >
                    <div class="itemImg">
                      <img
                        class="auto-img"
                        :src="a.uiElement.image.imageUrl"
                        alt=""
                      />
                    </div>
                    <div class="itemText">
                      <div class="textTop">
                        <div class="songName" :style="{ maxWidth: '270px' }">
                          {{ a.uiElement.mainTitle.title }}
                        </div>
                      </div>
                      <div class="introduce">
                        <span class="category">{{
                          a.resourceExtInfo.djProgram.secondCategory
                        }}</span>
                        {{
                          a.uiElement.subTitle ? a.uiElement.subTitle.title : ""
                        }}
                      </div>
                    </div>
                  </div>
                </van-swipe-item>
                <van-swipe-item></van-swipe-item>
              </van-swipe>
            </div>
          </div>
          <div v-else>
            <div class="Newsongdiscalbum">
              <van-swipe
                :loop="false"
                width="340"
                initial-swipe="1"
                :show-indicators="false"
                ref="popularPodcastsBox"
                @change="onPopularPodcastsChange"
              >
                <van-swipe-item></van-swipe-item>
                <van-swipe-item v-for="(item, index) in audioBook" :key="index">
                  <div
                    class="musicItem"
                    v-for="(a, b) in item.resources"
                    :key="b"
                  >
                    <div class="itemImg">
                      <img
                        class="auto-img"
                        :src="a.uiElement.image.imageUrl"
                        alt=""
                      />
                    </div>
                    <div class="itemText">
                      <div class="textTop">
                        <div class="songName">
                          {{ a.uiElement.mainTitle.title }}
                        </div>
                      </div>
                      <div class="introduce">
                        <span class="category">{{
                          a.uiElement.labelTexts[0]
                        }}</span>
                        {{
                          a.uiElement.subTitle ? a.uiElement.subTitle.title : ""
                        }}
                      </div>
                    </div>
                  </div>
                </van-swipe-item>
                <van-swipe-item></van-swipe-item>
              </van-swipe>
            </div>
          </div>
        </div>
      </div>
      <!-- 云村出品 -->
      <div class="manufacture">
        <div class="generalTop">
          <div class="generalTitle">云村出品</div>
          <div class="generalBtn">
            <div>更多</div>
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="manufactureContent">
          <div :style="{ width: manufactureData.length * 169 + 'px' }">
            <div
              class="manufactureItem"
              v-for="(a, b) in manufactureData"
              :key="b"
              @click="songListClick(a)"
            >
              <div class="manufactureItemImg">
                <div
                  class="manufactureItemImgBg"
                  :style="{
                    backgroundImage: `url(${a.uiElement.image.imageUrl})`,
                  }"
                ></div>
                <van-image
                  width="100%"
                  height="100%"
                  fit="contain"
                  :src="a.uiElement.image.imageUrl"
                />
              </div>
              <div class="manufactureItemText">
                {{ a.uiElement.mainTitle.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 热门话题 -->
      <div class="hotTopic">
        <div class="generalTop">
          <div class="generalTitle">热门话题</div>
        </div>
        <div class="hotTopicContent">
          <van-swipe
            :loop="false"
            width="352"
            initial-swipe="1"
            :show-indicators="false"
            ref="swipeHotTopic"
            @change="onHotTopicChange"
          >
            <van-swipe-item></van-swipe-item>
            <van-swipe-item v-for="(item, index) in hotTopicData" :key="index">
              <div
                class="hotTopicItem"
                v-for="(a, b) in item.resources"
                :key="b"
              >
                <div class="itemLeft">
                  <div class="itemIcon">
                    <img
                      class="auto-img"
                      :src="a.uiElement.mainTitle.titleImgUrl"
                      alt=""
                    />
                  </div>
                  <div class="itemText">{{ a.uiElement.mainTitle.title }}</div>
                </div>
                <div class="itemRight">{{ a.uiElement.subTitle.title }}</div>
              </div>
            </van-swipe-item>
            <van-swipe-item></van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!-- 专属场景歌单 -->
      <Songlist :data="sceneSong" :dataName="sceneSongName" />
      <!-- 新歌/新碟/数字专辑 -->
      <div class="newSongDiscAlbum">
        <div class="generalTop">
          <div class="newSongDiscAlbumTopTitle">
            <div
              class="titleItem"
              :style="{ color: activeIndex == b ? '#000' : '#999' }"
              v-for="(a, b) in newSongDiscAlbumTopTitle"
              :key="b"
              @click="changeActiveIndex(b)"
            >
              {{ a.name }}
            </div>
          </div>
          <div class="generalBtn">
            <div>更多</div>
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="newSongDiscAlbumContent">
          <div>
            <Newsongdiscalbum
              @showPlaySongPage="showPlayPage"
              v-if="isNewSong"
              :data="newSong"
            />
          </div>
          <div>
            <Newsongdiscalbum
              @showPlaySongPage="showPlayPage"
              v-if="isNewDisc"
              :data="newDisc"
            />
          </div>
          <div>
            <Newsongdiscalbum
              @showPlaySongPage="showPlayPage"
              v-if="isDiscAlbum"
              :data="discAlbum"
            />
          </div>
          <!-- <Newsongdiscalbum :data="showAllNewSongDiscAlbum" /> -->
        </div>
      </div>
      <!-- 云村日历 -->
      <div class="calendar">
        <div class="generalTop calendarTop">
          <div class="generalTitle">音乐日历</div>
          <div class="generalBtn">
            <div>今日8条</div>
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="calendarContent">
          <div class="calendarItem" v-for="(a, b) in calendarData" :key="b">
            <div class="left">
              <div class="itemTop">
                <div class="time">{{ b == 0 ? "今天" : "明天" }}</div>
                <div
                  v-for="(x, y) in a.resources[0].uiElement.labelTexts"
                  :key="y"
                  class="labelTexts"
                >
                  {{ x }}
                </div>
              </div>
              <div class="itemBottom">
                {{ a.resources[0].uiElement.mainTitle.title }}
              </div>
            </div>
            <div class="right">
              <img
                class="auto-img"
                :src="a.resources[0].uiElement.image.imageUrl"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Toast } from "vant";
import Newsongdiscalbum from "../components/Newsongdiscalbum.vue";
import Songlist from "../components/Songlist.vue";
export default {
  name: "Discover",
  components: {
    Newsongdiscalbum,
    Songlist,
  },
  data() {
    return {
      // 滚动距离
      scrollTop: 0,
      //搜索框
      value: "",
      // 轮播图
      banner: [],
      // 推荐图标
      recommendIconArray: [
        {
          name: "rili",
          title: "每日推荐",
        },
        {
          name: "shouyinji",
          title: "私人FM",
        },
        {
          name: "gedan",
          title: "歌单",
        },
        {
          name: "PCbofangye_paihangbang",
          title: "排行榜",
        },
      ],
      // 推荐歌单
      recommendSongFirst: null,
      recommendSong: [],
      // 为您推荐
      songListName: null,
      songListData: [],
      // 雷达歌单
      radarDataName: null,
      radarData: [],
      // 热门话题
      hotTopicData: [],
      //新歌/新碟/数字专辑
      newSongDiscAlbumTopTitle: [
        {
          name: "新歌",
        },
        {
          name: "新碟",
        },
        {
          name: "数字专辑",
        },
      ],
      activeIndex: 0,
      newSong: [],
      newDisc: [],
      discAlbum: [],
      isNewSong: true,
      isNewDisc: false,
      isDiscAlbum: false,
      // 云村日历
      calendarData: [],
      // 专属场景歌单
      sceneSongName: null,
      sceneSong: [],
      // 热门博客/有声书
      popularPodcasts: [{ name: "热门博客" }, { name: "有声书" }],
      popularPodcastsData: [],
      audioBook: [],
      isPp: true,
      activePPIndex: 0,
      // 云村出品
      manufactureData: [],
      // 当前播放歌曲列表id
      nowSongListData: [],
    };
  },
  created() {
    this.getBanner();
    this.getDiscover();
  },
  activated() {
    // 每次切换页面回来，滚动到原来的位置
    this.$nextTick(() => {
      let refs = this.$refs;
      refs.discoverContent.scrollTop = this.scrollTop;
    });
  },
  mounted() {
    // 为disconverContent添加一个滚动事件
    let discoverContent = this.$refs.discoverContent;
    discoverContent.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    // axios请求首页-发现轮播图数据
    getBanner() {
      this.axios({
        method: "get",
        url: `banner`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            // 获取轮播图数据
            this.banner = result.data.banners;
          } else {
            
          }
        })
        .catch((err) => {});
    },
    // 点击轮播图
    bannerBtn(item) {
      
      if (item.typeTitle == "新歌首发") {
        this.setNowPlaySongId({
          nowPlaySongId: item.encodeId,
          isPlaySong: true,
        });
        this.setOtherPlaySong({ otherPlaySong: true });
      } else if (item.typeTitle == "新碟首发") {
        this.$router.push({
          name: "Songlistall",
          params: { targetId: item.targetId },
        });
      }
    },
    // 点击推荐图标
    iconClick(title) {
      if (title == "每日推荐") {
        let cookie = localStorage.getItem("userCookie");
        if (!cookie) {
          Toast("请先登录");
          return;
        }
        this.$router.push({
          name: "Songlistall",
          params: { fromPage: "recommendSong" },
        });
      } else if (title == "排行榜") {
        this.$router.push({
          name: "Rankinglist",
        });
      } else if (title == "私人FM") {
        let cookie = localStorage.getItem("userCookie");
        this.axios({
          method: "get",
          url: `personal_fm`,
          params: {
            cookie: cookie,
          },
        })
          .then((result) => {
            // status请求成功
            if (result.status == 200) {
              let id = result.data.data[0].id;
              this.setNowPlaySongId({
                nowPlaySongId: id,
                isPlaySong: true,
              });
              this.setOtherPlaySong({ otherPlaySong: true });
              this.showPlayPage();

              let nowSongListItem = [];
              result.data.data.forEach((ele) => {
                let obj = {
                  song: {
                    id: ele.id,
                    name: ele.name,
                  },
                  artists: [
                    {
                      name: ele.artists[0].name,
                    },
                  ],
                };
                nowSongListItem.push(obj);
                this.setNowSongListData({ nowSongListItem: nowSongListItem });
              });
            } else {
              
            }
          })
          .catch((err) => {});
      } else if (title == "歌单") {
        this.$router.push({
          name: "RecommendList",
        });
      }
    },
    //axios请求首页-发现数据
    getDiscover() {
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
        url: `homepage/block/page`,
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            
            Toast.clear();
            // 获取推荐歌单
            result.data.data.blocks[1].creatives.forEach((ele, index) => {
              if (index == 0) {
                // 获取推荐歌单第一个数据
                this.recommendSongFirst = ele.resources;
              } else {
                // 获取推荐歌单其余数据
                this.recommendSong.push(ele);
              }
            });
            //获取为您推荐名称
            this.songListName =
              result.data.data.blocks[2].uiElement.subTitle.title;
            //获取为您推荐数据
            this.songListData = result.data.data.blocks[2].creatives;
            
            // 获取新歌/新碟/数字专辑
            let allNewSongDiscAlbum = result.data.data.blocks[3].creatives;
            // 获取新歌数据
            this.newSong = allNewSongDiscAlbum.filter((ele) => {
              return ele.creativeType == "NEW_SONG_HOMEPAGE";
            });
            // 获取新碟数据
            this.newDisc = allNewSongDiscAlbum.filter((ele) => {
              return ele.creativeType == "NEW_ALBUM_HOMEPAGE";
            });
            // 获取数字专辑数据
            this.discAlbum = allNewSongDiscAlbum.filter((ele) => {
              return ele.creativeType == "DIGITAL_ALBUM_HOMEPAGE";
            });
            // 获取热门话题数据
            this.hotTopicData = result.data.data.blocks[4].creatives;
            //获取云村日历数据
            this.calendarData = result.data.data.blocks[5].creatives;
            //获取雷达歌单名称
            this.radarDataName =
              result.data.data.blocks[7].uiElement.subTitle.title;
            // 获取雷达歌单数据
            this.radarData = result.data.data.blocks[7].creatives;
            // 获取专属场景名称
            this.sceneSongName =
              result.data.data.blocks[8].uiElement.subTitle.title;
            // 获取专属场景歌单
            this.sceneSong = result.data.data.blocks[8].creatives;
            // 获取热门博客数据
            this.popularPodcastsData =
              result.data.data.blocks[9].creatives.filter((ele) => {
                return ele.creativeType == "VOICE_LIST_HOMEPAGE";
              });
            // 获取有声书数据
            this.audioBook = result.data.data.blocks[9].creatives.filter(
              (ele) => {
                return ele.creativeType == "PODCAST_LIST_HOMEPAGE";
              }
            );
            // 获取云村出品数据
            this.manufactureData = result.data.data.blocks[10].creatives;
          } else {
            
          }
        })
        .catch((err) => {});
    },
    // 点击更换新歌/新碟/数字专辑
    changeActiveIndex(a) {
      if (this.activeIndex == a) {
        return;
      }
      this.activeIndex = a;

      this.isNewSong = false;
      this.isNewDisc = false;
      this.isDiscAlbum = false;
      if (a == 0) {
        this.isNewSong = true;
      } else if (a == 1) {
        this.isNewDisc = true;
      } else {
        this.isDiscAlbum = true;
      }
    },
    // 热门话题换页事件
    onHotTopicChange(index) {
      if (this.hotTopicData.length + 1 == index) {
        this.$refs.swipeHotTopic.swipeTo(index - 1);
      }
      if (index == 0) {
        this.$refs.swipeHotTopic.swipeTo(1);
      }
    },
    // 热门博客/有声书换页事件
    onPopularPodcastsChange(index) {
      if (this.popularPodcastsData.length + 1 == index) {
        this.$refs.popularPodcastsBox.swipeTo(index - 1);
      }
      if (index == 0) {
        this.$refs.popularPodcastsBox.swipeTo(1);
      }
    },
    // 点击更换热门博客/有声书
    changePopularActiveIndex(a) {
      this.$refs.popularPodcastsBox.swipeTo(1);
      if (this.activePPIndex == a) {
        return;
      }
      this.activePPIndex = a;
      if (a == 0) {
        this.isPp = true;
      } else {
        this.isPp = false;
      }
    },
    // 点击热门博客/有声书Item
    hotBlog(a) {
      
    },
    // 页面滚动事件
    handleScroll(e) {
      if (e.target.className == "discoverContent") {
        this.scrollTop = e.target.scrollTop;
      }
    },
    // 点击为您定制播放音乐
    songListBtn() {
      let nowSongListItem = [];
      this.songListData.forEach((ele) => {
        ele.resources.forEach((ele) => {
          nowSongListItem.push(ele.resourceExtInfo);
        });
      });
      this.setNowSongListData({ nowSongListItem: nowSongListItem });
    },
    // 点击歌单/点击云村出品
    songListClick(a) {
      if (a.creativeId) {
        this.$router.push({ name: "Songlistall", params: { songlist: a } });
      }
    },
    // 点解搜索框
    searchClick() {
      this.$router.push({ name: "Search", params: { fromPage: "Discover" } });
    },
    // 显示播放歌曲页面
    showPlayPage() {
      this.$emit("showPlaySongPage", true);
    },
    ...mapMutations([
      "setNowSongListData",
      "setNowPlaySongId",
      "setOtherPlaySong",
    ]),
  },
};
</script>

<style lang="less" scoped>
.discover {
  width: 100%;
  height: 100%;
}
// 通用背景颜色和间距
.bgmb {
  padding-top: 14px;
  background-color: #fff;
  margin-bottom: 10px;
}
// 搜索框
.search {
  position: fixed;
  top: 25px;
  left: 0;
  right: 0;
}
// 发现页面内容
.discoverContent {
  position: fixed;
  top: 79px;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: scroll;
}
// 轮播图图片
.swipeItem {
  background-color: #fff;
  position: relative;
  .swipeImg {
    width: 93%;
    display: block;
    margin: 0 auto;
    border-radius: 10px;
  }
  .typeTitle {
    background-color: #fb5340;
    border-radius: 10px 0 10px 0;
    padding: 2px 4px;
    color: #fff;
    position: absolute;
    bottom: 0;
    right: 13.5px;
  }
}
// 推荐图标
.recommendIcon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 14px 20px 10px;
  border-bottom: 1px solid rgb(231, 231, 231);
  .iconItem {
    .icon {
      width: 40px;
      height: 40px;
      background-color: #fff5f4;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .iconTitle {
      text-align: center;
    }
  }
}
// 推荐歌单&雷达歌单
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
//为您推荐
.songList {
  .bgmb();
  .songListContent {
    height: 170px;
  }
}
// 热门博客/有声书
.Newsongdiscalbum {
  padding-top: 2px;
  .musicItem {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 14px;
    .itemImg {
      width: 44px;
      height: 44px;
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
          max-width: 128px;
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
          max-width: 128px;
          display: flex;
          color: #b6b6b6;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .introduce {
        width: 270px;
        color: #b6b6b6;
        font-size: 13px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .category {
          border: 1px solid #dcdcdc;
          border-radius: 4px;
          padding: 0px 2px;
          font-size: 12px;
        }
      }
    }
  }
}
// 云村出品
.manufacture {
  .bgmb();
  .manufactureContent {
    overflow-x: scroll;
    overflow-y: hidden;
    margin-top: 10px;
    padding: 0 9px;
    height: 130px;
    .manufactureItem {
      width: 160px;
      height: 100%;
      display: inline-block;
      margin: 0 4px;
      .manufactureItemImg {
        height: 90px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        .manufactureItemImgBg {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center center;
          position: absolute;
          top: 0;
          left: 0;
          filter: blur(8px);
        }
      }
      .manufactureItemText {
        height: 34px;
        font-size: 13px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        padding-top: 4px;
      }
    }
  }
}
// 热门话题
.hotTopic {
  .bgmb();
  .hotTopicContent {
    height: 117px;
    padding: 8px 0;
    .hotTopicItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      padding-left: 14px;
      .itemLeft {
        display: flex;
        align-items: center;
        .itemIcon {
          width: 14px;
        }
        .itemText {
          font-size: 14px;
          margin-left: 2px;
        }
      }
      .itemRight {
        color: #9f9f9f;
      }
    }
  }
}
// 新歌/新碟/数字专辑
.newSongDiscAlbum {
  .bgmb();
  height: 200px;
  .newSongDiscAlbumTopTitle {
    display: flex;
    font-size: 15px;
    font-weight: bold;
    .titleItem {
      height: 16px;
      line-height: 16px;
      padding: 0 10px;
      border-left: 1px solid #eee;
      &:first-child {
        padding-left: 0;
        border-left: none;
      }
    }
    /deep/ .van-tab {
      font-weight: bold;
    }
  }
}
// 音乐日历
.calendar {
  padding-bottom: 16px;
  .bgmb();
  margin-bottom: 46px;
  .calendarTop {
    padding-bottom: 10px;
    border-bottom: 1px solid #ededed;
  }
  .calendarContent {
    height: 133px;
    padding: 0 14px;
    .calendarItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      &:first-child {
        border-bottom: 1px solid #ededed;
      }
      .left {
        .itemTop {
          display: flex;
          align-items: center;
          .time {
            color: #999;
            font-size: 13px;
          }
          .labelTexts {
            color: #ff8c54;
            background-color: #fef9f5;
            margin-left: 4px;
            padding: 0 2px;
          }
        }
        .itemBottom {
          font-size: 15px;
          padding-top: 4px;
          width: 210px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .right {
        width: 42px;
        border-radius: 8px;
        overflow: hidden;
      }
    }
  }
}

// 搜索框背景颜色
/deep/ .van-search__content {
  background-color: #fff;
}
// 轮播图指示器样式
/deep/ .van-swipe__indicators {
  bottom: 6px;
  .van-swipe__indicator {
    width: 10px;
    height: 2px;
    border-radius: 0;
  }
}
</style>