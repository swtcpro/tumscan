import entities from '../model/entities';

const {
    messageBoard,
    messageTopic
} = entities
/**
 * 留言业务类
 */
export default class messageService {
    /**
     * 获取留言
     * @param {int} id
     * @return {promises} 结果回调
     */
    getMessage(id) {
        return new Promise(function (resolve, reject) {
            messageTopic.findById(id, {
                include: [{
                    model: messageBoard,
                    as: 'messageitem'
                }]
            }).then(topic => {
                resolve(topic);
            }).catch((error) => {
                console.log(error)
                reject(error)
            });
        });
    }

    /**
     * 新增留言
     * @param {string} title
     * @param {string} message
     * @param {string} ip
     * @return {promises} 结果回调
     */
    addMessage(title, message, ip) {
        return messageTopic.create({
            title,
            lastUpdateTime: new Date(),
            messageitem: [{
                description: message,
                time: new Date(),
                ip
            }]
        }, {
            include: [{
                model: messageBoard,
                as: 'messageitem'
            }]
        })
    }

    /**
     * 更新留言
     */
    updateMessage() {
    }

    /**
     * 分页查询token
     * @param page
     * @param limit
     */
    getMessagePaging(page, limit) {
        return new Promise(function (resolve, reject) {
            let offset = (page - 1) * limit;
            messageTopic.findAndCountAll({
                offset,
                limit,
                include: [{
                    model: messageBoard,
                    as: 'messageitem'
                }],
                order: [['lastUpdateTime', 'asc']]
            }).then(function (array) {
                resolve(array);
            }).catch(function (error) {
                reject(error);
            })
        })
    }
}
