import ErrorHandler from "../middlewares/error";
import { RequiredDoc } from "../models/requiredDocs";
import { RequiredDocCreationAttributes } from "../types/models";

export const getRequiredDocuments = async () => {
  return RequiredDoc.findAll({ order: [["id", "DESC"]] });
};

export const getRequiredDocumentById = async (id: number) => {
  const doc = await RequiredDoc.findByPk(id);

  if (!doc) throw new ErrorHandler("There is no required document", 404);
  return doc;
};

export const findRequiredDocumentById = async (id: number) => {
  const doc = await RequiredDoc.findByPk(id)
  if (!doc) throw new ErrorHandler("There is no required document", 404)
  return doc
}

export const createRequiredDocument = async (data: RequiredDocCreationAttributes) => {
  const doc = await RequiredDoc.create(data);
  return doc
};

export const updateRequiredDocument = async (id: number, data: RequiredDocCreationAttributes) => {
  const doc = await findRequiredDocumentById(id)
  doc.label = data.label
  doc.save()

  return doc
};

export const deleteRequiredDocument = async (id: number) => {
  const doc = await findRequiredDocumentById(id);
  await doc.destroy();

  return { message: "Required document deleted successfully" };
};