import api from "../../api/api_message";

const state = {
  message: {
    title: "",
    content: ""
  },
  pagination: {
    page: 0,
    limit: 10,
    total: 0,
  },
  messagedata:[],
  messageList:[]
};

const getters = {};

const actions = {
  getForumMessage({
    commit,
    state
  }, params) {
    api.getMessage(params).then((result) => {
      const pagination = {
        page: params.page,
        total: result.count,
        limit: params.limit
      }
      commit("setMessagePaginfo", pagination);

      if (result.count == 0) {
        return
      }

      const messagedata = result.rows.map((item) => {
        return {
          title: item.title,
          content: item.messageitem.length > 0 ? item.messageitem[item.messageitem.length - 1].description : '',
          time: item.lastUpdateTime
        }
      });
      commit("setMessageData", messagedata);
    })
  },
  addmessage() {},
  pushMessageFrom({commit,state}, newMessage) {
    let messagedata = state.messagedata;
    messagedata.push(newMessage);
    commit("setMessageData", messagedata);
  },
  getMessageByTime({
    commit,
    state
  }, params) {
    api.getMessageByTime(params).then((result) => {
      const pagination = {
        page: params.page,
        total: result.count,
        limit: params.limit
      }
      commit("setMessagePaginfo", pagination);

      if (result.count == 0) {
        return
      }

      const messagedata = result.rows.map((item) => {
        return {
          title: item.title,
          content: item.messageitem.length > 0 ? item.messageitem[item.messageitem.length - 1].description : '',
          time: item.lastUpdateTime
        }
      });
      commit("setMessageData", messagedata);
    })
  },
  getMessageByTitle({
    commit,
    state
  }, params) {
    api.getMessageByTitle(params).then((result) => {
      const pagination = {
        page: params.page,
        total: result.count,
        limit: params.limit
      }
      commit("setMessagePaginfo", pagination);

      if (result.count == 0) {
        return
      }

      const messagedata = result.rows.map((item) => {
        return {
          title: item.title,
          content: item.messageitem.length > 0 ? item.messageitem[item.messageitem.length - 1].description : '',
          time: item.lastUpdateTime
        }
      });
      commit("setMessageData", messagedata);
    })
  },
  getMessageList({commit,state}, params) {
    api.getMessage(params).then((result) => {
      if (result.count == 0) {
        return
      }

      const messagedata = result.rows.map((item) => {
        return {
          title: item.title,
          content: item.messageitem.length > 0 ? item.messageitem[item.messageitem.length - 1].description : '',
          time: item.lastUpdateTime
        }
      });
      commit("setMessageList", messagedata);
    })
  },
  setMessage({commit,state}, newMessage){
    commit("setMessage", newMessage);
  }
};

const mutations = {
  setMessagePaginfo(state, entity) {
    const pagination = state.pagination;
    state.pagination = {
      ...pagination,
      ...entity
    };
  },
  setMessageData(state, entity) {
    state.messagedata = entity
  },
  setMessageList(state, entity) {
    state.messageList = entity
  },
  setMessage(state, entity) {
    state.message = entity
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
