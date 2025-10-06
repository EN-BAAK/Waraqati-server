import { DataTypes, Model, Sequelize } from "sequelize";
import { CategoryAttributes, CategoryCreationAttributes } from "../types/models";
import fs from "fs";
import path from "path";

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public title!: string;
  public desc!: string;
  public imgUrl!: string | null;

  public toJSON(): object {
    const values: Partial<CategoryAttributes> = { ...this.get() };
    return values;
  }
}

export default (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      desc: { type: DataTypes.TEXT, allowNull: false },
      imgUrl: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: false,
      indexes: [{ name: "title_index", unique: false, fields: ["title"] }],
      hooks: {
        beforeDestroy: async (category: Category) => {
          if (category.imgUrl) {
            const filePath = path.join(process.cwd(), category.imgUrl);
            fs.unlink(filePath, (err) => {
              if (err && err.code !== "ENOENT") {
                console.error(`Error deleting file ${filePath}:`, err);
              }
            });
          }
        },
      },
    },
  );

  return Category;
};
