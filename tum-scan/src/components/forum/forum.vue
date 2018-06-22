<template>
  <el-row class="warp-body">
    <el-row class="breadcrumb">
      <el-col :md="20" :xl="20" :xs="20">
        <h4>讨论留言</h4>
      </el-col>
      <el-col :md="4" :xl="4" :xs="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }">
            <b>首页</b>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <b>讨论</b>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row class="messageboard">
      <el-form ref="form" label-width="50px">
        <el-form-item label="标题">
          <el-input v-model="title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="3" v-model="content" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-row type="flex" class="row-bg" justify="center">
          <el-form-item>
            <el-button type="primary" @click="add()">添加</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>

        <el-row class="pagination-row" v-show="pageShow">
          <el-col :offset="16" :md="8" :xl="8" :xs="12">
            <el-pagination background layout="prev, pager, next,total" :page-size="pagination.limit" @current-change="flipOver" :total="pagination.total" :current-page="pagination.page">
            </el-pagination>
          </el-col>
        </el-row>

        <el-table border :data="messagedata" highlight-current-row @row-click="openDetails">
          <el-table-column label="编号" type="index" :index="indexMethod" width="50">
          </el-table-column>
          <el-table-column prop="title" label="标题">
          </el-table-column>
          <el-table-column prop="content" label="内容">
          </el-table-column>
          <!-- <el-table-column label="操作">
            <span>
              <el-button size="small" @click="showDialog()">删除</el-button>
            </span>
          </el-table-column> -->
        </el-table>
      </el-form>

      <el-dialog title="提示" v-model="dialogVisible" size="tiny">
        <span v-if="nowIndex==-2">删除全部条留言</span>
        <span v-else>删除此条留言</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="del(nowIndex)">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
  </el-row>
</template>

<script>
import api from "../../api/api_message";

export default {
  data: function() {
    return {
      title: "",
      content: "",
      dialogVisible: false,
      nowIndex: -100
    };
  },
  methods: {
    add() {
      if (this.title == "") {
        this.$message({
          message: "请填写标题",
          type: "warning"
        });
      } else if (this.content == "") {
        this.$message({
          message: "请填写内容",
          type: "warning"
        });
      } else {
        api.addMessage(this.title, this.content).then(data => {
          this.$message("增加信息成功");
          this.title = "";
          this.content = "";
          this.flipOver(this.pagination.total / this.pagination.limit + 1);
        });
      }
    },
    showDialog() {
      this.dialogVisible = true;
    },
    showDelallDialog() {
      this.dialogVisible = true;
      this.nowIndex = -2;
    },
    del(n) {
      if (n == -2) {
        this.mydata = [];
      } else {
        this.mydata.splice(n, 1);
      }
      this.nowIndex = -100;
      this.dialogVisible = false;
    },
    handleReset() {
      this.title = "";
      this.content = "";
    },
    indexMethod(index) {
      return index + 1;
    },
    flipOver(page) {
      const params = {
        page,
        limit: 10
      };
      this.$store.dispatch("getForumMessage", params);
    },
    openDetails(row) {
      console.log(row);
    }
  },
  computed: {
    pagination() {
      return this.$store.state.forum.pagination;
    },
    messagedata() {
      return this.$store.state.forum.messagedata;
    },
    pageShow() {
      if (
        this.$store.state.forum.pagination.total > 0 ||
        this.$store.state.forum.messagedata.length > 0
      ) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    this.flipOver(1);
  }
};
</script>

