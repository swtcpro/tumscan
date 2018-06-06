/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/4/14
 \* Time: 22:17
 \* Description:
 \*/
export default {
  // baseURL: 'http://state.jingtum.com',
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8081/api/v1"
      : "http://106.14.65.102:8081/api/v1",
  isDev: true
};
