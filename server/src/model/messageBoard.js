import { sequelize, Sequelize } from "./sequelize_helper";

const messageBoard = sequelize.define("messageBoard", {
  id: { type: Sequelize.UUID, primaryKey: true },
  title: Sequelize.STRING,
  ip: Sequelize.STRING,
  description: Sequelize.TEXT,
  time: Sequelize.DATE
});
export default messageBoard;
