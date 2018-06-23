<template>
    <el-row class="warp-body">
        <el-row class="breadcrumb">
            <el-col :md="20" :xl="20" :xs="20">
                <h4>留言详情</h4>
            </el-col>
            <el-col :md="4" :xl="4" :xs="4">
                <el-breadcrumb separator="/" style="margin-top: 12px">
                    <el-breadcrumb-item :to="{ path: '/' }">
                        <b>首页</b>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/forum' }">
                        <b>讨论</b>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <b>详情</b>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>

        <el-row>
            <el-card class="box-card">
                <div slot="header" class="title">
                    <span>{{title}}</span>
                </div>
                <div class="text item">
                    {{content}}
                </div>
                <el-row type="flex" justify="end">
                    {{time}}
                </el-row>
            </el-card>
        </el-row>
    </el-row>
</template>

<style>
.title {
  font-size: 16px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>


<script>
import util from "../../common/util";
export default {
  data: function() {
    return {
      title: "人工智能贸易革命！准备计划！软帽到了！ 去拿麦克斯奖金！",
      content:
        "确保在任何垃圾邮件中使用“拒绝投票”按钮，对有趣的对话使用“向上投票”按钮。"
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      const { row } = this.$route.params;
      this.title = row.title;
      this.content = row.content;
      this.time = "发表于" + util.formatDate.format(new Date(row.time));
    }
  }
};
</script>

