<template>
  <ul style="padding-left: 0px">
    <li v-for="item in messagedata" :key="item.id">
      <el-col :span="23">
        <img src="../../assets/icon/comment-white.png" />
        <a href="javascript:void(0)" @click="openDetails(item)" style="margin-left:5px;color: white">{{item.title}}</a>
      </el-col>
      <el-col :span="1">
        <img src="../../assets/icon/arrow-right.png" />
      </el-col>
    </li>
  </ul>
</template>

<style>
</style>

<script>
import util from "../../common/util";
export default {
  data: function() {
    return {};
  },
  mounted() {
    this.getMessageData(1);
  },
  methods: {
    getMessageData(page) {
      const params = {
        page,
        limit: 5
      };
      this.$store.dispatch("getMessageList", params);
    },
    openDetails(item) {
      this.$router.push({
        name: "forumdetail"
      });
      this.$store.dispatch("setMessage", item);
    }
  },
  computed: {
    messagedata() {
      return this.$store.state.forum.messageList;
    }
  }
};
</script>

