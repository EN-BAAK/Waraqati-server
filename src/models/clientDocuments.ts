import { DataTypes, Model, Sequelize } from "sequelize";
import { ClientDocumentAttributes, ClientDocumentCreationAttributes } from "../types/models";
import fs from "fs"
import path from "path";

export class ClientDocument
  extends Model<ClientDocumentAttributes, ClientDocumentCreationAttributes>
  implements ClientDocumentAttributes {
  public id!: number;
  public clientId!: number;
  public docId!: number;
  public url!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


  public toJSON(): object {
    const values: Partial<ClientDocumentAttributes> = { ...this.get() };
    return values;
  }

  static associate(models: any) {
    ClientDocument.belongsTo(models.Client, { foreignKey: "clientId", as: "client", onDelete: "CASCADE" });
    models.Client.hasMany(ClientDocument, { foreignKey: "clientId", as: "documents" });
    ClientDocument.belongsTo(models.RequiredDoc, { foreignKey: "docId", as: "document", onDelete: "CASCADE" });
    models.RequiredDoc.hasMany(ClientDocument, { foreignKey: "docId", as: "clients" });
  }
}

export default (sequelize: Sequelize) => {
  ClientDocument.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      clientId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      docId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: "client_document",
      timestamps: true,
      hooks: {
        beforeDestroy: async (docs: ClientDocument) => {
          if (docs.url) {
            const filePath = path.join(process.cwd(), docs.url);
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

  return ClientDocument;
};
