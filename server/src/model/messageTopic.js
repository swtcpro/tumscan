import {
    sequelize,
    Sequelize
} from "./sequelize_helper";

const messageTopic = sequelize.define("messageTopic", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.STRING,
    lastUpdateTime: Sequelize.DATE
});


export default messageTopic;
