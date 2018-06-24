 import * as API from './'

 export default {
   addMessage: (title, message) => {
     const params = {
       title,
       message
     }

     return API.POST('/messageboard/message', params);
   },
   getMessage: (params) => {
     return API.GET('/messageboard/message', params)
   },
   getMessageByTime: (params) => {
     return API.GET('/messageboard/messagetime', params)
   },
   getMessageByTitle: (params) => {
     return API.GET('/messageboard/message/title', params)
   }
 }
