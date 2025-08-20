import { DataTypes, Model } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../types/models";
import { comparePassword, hashPassword } from "../utils/encrypt";
import db from "./index";
import fs from "fs";
import path from "path";

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public middleName!: string | null;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public identityNumber!: string;
  public password!: string;
  public imgUrl!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async checkPassword(password: string): Promise<boolean> {
    return comparePassword(password, this.password);
  }

  public toJSON(): object {
    const values: Partial<UserAttributes> = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING, allowNull: false },
    identityNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    imgUrl: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize: db.sequelize!,
    tableName: "users",
    timestamps: true,
    indexes: [{ name: "name_index", unique: false, fields: ["firstName", "lastName"] }],
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) user.password = await hashPassword(user.password);
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) user.password = await hashPassword(user.password);
      },
      beforeDestroy: async (user: User) => {
        if (user.imgUrl) {
          const filePath = path.join(__dirname, "../uploads/users", user.imgUrl);
          fs.unlink(filePath, (err) => {
            if (err && err.code !== "ENOENT") {
              console.error(`Error deleting file ${filePath}:`, err);
            }
          });
        }
      },
    },
  }
);

export default User;
