import { ClientDocument } from "../models/clientDocuments";
import { ClientDocumentCreationAttributes } from "../types/models";
import { RequiredDoc } from "../models/requiredDocs";
import { Client } from "../models/client";
import ErrorHandler from "../middlewares/error";
import path from "path";

export const createDocument = async (data: ClientDocumentCreationAttributes, t?: any) => {
  const answer = await ClientDocument.create(data, { transaction: t });
  return answer
};

export const getAllClientDocuments = async (userId: number) => {
  const client = await Client.findOne({ where: { userId } });
  if (!client) throw new ErrorHandler("Client not found", 404);

  const docs = await ClientDocument.findAll({
    where: { clientId: client.id },
    include: [
      {
        model: RequiredDoc,
        as: "document",
        attributes: ["id", "label"],
      },
    ],
  });

  const data = docs.map(d => d.toJSON() as any)
  return data.map((d) => ({
    id: d.document.id,
    label: d.document.label
  }));
};

export const downloadClientDocument = async (userId: number, docId: number) => {
  const client = await Client.findOne({ where: { userId } });
  if (!client) throw new ErrorHandler("Client not found", 404);

  const doc = await ClientDocument.findOne({
    where: { id: docId, clientId: client.id },
  });

  if (!doc) throw new ErrorHandler("Document not found", 404);

  return path.resolve(
    process.cwd(),
    doc.url.replace(/^\/?uploads\//, "")
  );
}