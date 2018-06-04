 import * as API from './'

 export default {
   addMessage: (title, message) => {
     const params = {
       title,
       message
     }

     return API.POST('/messageboard/message', params);
   },
 }
