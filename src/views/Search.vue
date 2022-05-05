<template>
  <div class="search">
    <div class="searchTop">
      <form action="/">
        <van-search
          v-model="value"
          show-action
          shape="round"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="onCancel"
          @input="onInput"
          background="rgb(250, 250, 250)"
          ref="seach_input"
        />
      </form>
    </div>
    <div class="searchContent" v-if="!value">
      <div class="historySearch" v-if="isHistory">
        <div class="historyDel">
          <h3>历史</h3>
          <van-icon
            name="delete-o"
            size="20"
            color="rgb(161, 161, 161)"
            @click="delHistory"
          />
        </div>
        <div class="historyBox">
          <div
            class="historyBoxItem"
            v-for="(item, index) in historySearch"
            :key="index"
            @click="hotSearchBtn(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="hotSearch">
        <div class="generalTop" style="padding: 0">
          <h3>热搜榜</h3>
          <div class="generalBtn" :style="{ paddingLeft: '4px' }">
            <van-icon name="play" />
            <div>播放</div>
          </div>
        </div>
        <div class="hotBox">
          <div
            class="hotItem"
            v-for="(item, index) in hotList"
            :key="index"
            @click="hotSearchBtn(item.searchWord)"
          >
            <span class="num">{{ index + 1 }}</span>
            {{ item.searchWord }}
            <div class="img" v-if="item.iconType == 1">
              <img class="auto-img" :src="item.iconUrl" alt="" />
            </div>
          </div>
          <div class="loading">
            <van-loading v-show="hotList[0] ? false : true" size="24px" vertical
              >加载中...</van-loading
            >
          </div>
        </div>
      </div>
    </div>
    <div class="searchSuggests" v-else>
      <van-loading
        v-show="searchSuggests[0] ? false : true"
        size="24px"
        vertical
        >加载中...</van-loading
      >
      <div
        class="suggestItem"
        v-for="(item, index) in searchSuggests"
        :key="index"
        @click="hotSearchBtn(item.keyword)"
      >
        <van-icon name="search" size="18" color="#b1b1b6" />
        <div class="suggestName">{{ item.keyword }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { Dialog } from "vant";
export default {
  name: "Search",
  data() {
    return {
      value: "",
      fromPage: null,
      //热搜榜
      hotList: [],
      //历史搜索记录
      historySearch: [],
      //搜索建议列表
      searchSuggests: [],
      // 是否显示历史搜索记录
      isHistory: true,
    };
  },
  created() {
    this.getHotList();
  },
  activated() {
    this.value = this.$route.params.val;
    this.setLocalStorage();
    this.showsearch();
  },
  methods: {
    //获取热搜榜
    getHotList() {
      this.axios({
        url: `search/hot/detail`,
        method: "get",
      })
        .then((result) => {
          // status请求成功
          if (result.status == 200) {
            if (result.data.code == 200) {
              this.hotList = result.data.data;
            } else {
              this.hotList = [];
            }
          } else {
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 点击热搜榜搜索内容
    hotSearchBtn(item) {
      this.onSearch(item);
      this.onInput(item);
    },
    //搜索事件
    onSearch(val) {
      if (!val) {
        // val = this.placeholder;
        Toast("请输入搜索内容");
        return;
      }
      if (this.historySearch.indexOf(val) == -1) {
        this.historySearch.push(val);
        localStorage.setItem(
          "musichistorysearch",
          JSON.stringify(this.historySearch)
        );
      }
      this.$router.push({
        name: "SearchContent",
        params: { val: val, fromPage: "Search" },
      });
      this.isHistory = true;
      this.value = "";
    },
    // 取消事件
    onCancel() {
      if (!this.fromPage) {
        this.$router.push("Discover");
        return;
      }
      this.$router.push(this.fromPage);
    },
    // 输入关键字事件
    onInput(val) {
      if (!val && this.value) {
        return;
      }
      this.searchSuggests = [];
      this.axios({
        method: "get",
        url: `search/suggest`,
        params: {
          keywords: val,
          type: "mobile",
        },
      })
        .then((result) => {
          if (result.status == 200) {
            
            if (result.data.code == 200) {
              this.searchSuggests = result.data.result.allMatch;
              if (!this.searchSuggests) {
                this.searchSuggests = [{ keyword: this.value }];
              }
            }
          }
        })
        .catch((err) => {
          
        });
    },
    // 进入搜索页面自动获取焦点
    showsearch() {
      this.fromPage = this.$route.params.fromPage;
      this.$nextTick(() => {
        let inputBox =
          this.$refs.seach_input.children[0].children[0].children[1].children[0]
            .children[0];
        inputBox.focus();
      });
    },
    // 获取历史搜索记录
    setLocalStorage() {
      this.historySearch = localStorage.getItem("musichistorysearch");
      this.historySearch = JSON.parse(this.historySearch);
      if (!this.historySearch) {
        this.historySearch = [];
        this.isHistory = false;
      }
    },
    // 删除历史记录
    delHistory() {
      Dialog.confirm({
        message: "确定要清空历史记录吗?",
      })
        .then(() => {
          localStorage.removeItem("musichistorysearch");
          this.historySearch = [];
          this.isHistory = false;
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.searchTop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: 26px;
  background-color: rgb(250, 250, 250);
}
.searchContent {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(250, 250, 250);
  h3 {
    margin: 8px 0;
  }
  .historySearch {
    padding: 0 20px;
    .historyDel {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .historyBox {
      display: flex;
      flex-flow: row wrap;
      .historyBoxItem {
        color: rgb(63, 63, 63);
        background-color: rgb(243, 243, 243);
        margin-right: 12px;
        margin-bottom: 12px;
        border-radius: 20px;
        padding: 4px 12px;
      }
    }
  }
  .hotSearch {
    padding: 0 20px;

    .hotBox {
      width: 94%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      flex-flow: row wrap;
      background-color: #fff;
      border-radius: 16px;
      padding: 10px 0;
      .hotItem {
        width: 50%;
        box-sizing: border-box;
        padding: 7px 20px;
        font-size: 13px;
        display: flex;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:first-child,
        &:nth-child(2),
        &:nth-child(3) {
          font-weight: bold;
        }
        &:first-child .num,
        &:nth-child(2) .num,
        &:nth-child(3) .num {
          color: #ec2a15;
        }
        .num {
          font-weight: bold;
          font-size: 14px;
          color: rgb(187, 187, 187);
          margin-right: 4px;
        }
        .img {
          width: 24px;
          display: flex;
          align-items: center;
          margin-left: 4px;
        }
      }
      .loading {
        display: flex;
        justify-content: center;
      }
    }
  }
}
.searchSuggests {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(250, 250, 250);
  padding: 10px 12px 12px;
  .suggestItem {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 2px solid #f3f3f3;
    .suggestTag {
    }
    .suggestName {
      font-size: 15px;
      margin-left: 10px;
    }
  }
}
/deep/ .van-search__content {
  background-color: rgb(243, 243, 243);
}
</style>