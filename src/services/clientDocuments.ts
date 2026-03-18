import { ClientDocument } from "../models/clientDocuments";
import { ClientDocumentCreationAttributes } from "../types/models";

export const createDocument = async (data: ClientDocumentCreationAttributes, t?: any) => {
  const answer = await ClientDocument.create(data, { transaction: t });
  return answer
};