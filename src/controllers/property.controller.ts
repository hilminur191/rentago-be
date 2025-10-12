import { Request, Response } from "express";
import {
  createPropertyWithRooms,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getFilteredProperties,
} from "../repositories/property.repository";
import { ICreatePropertyParam } from "../interfaces/property.types";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

function parseBodyField<T>(field: unknown): T | undefined {
  if (typeof field === "string") {
    try {
      return JSON.parse(field) as T;
    } catch {
      return [field] as unknown as T;
    }
  }
  return field as T;
}

function validatePropertyInput(
  body: Partial<ICreatePropertyParam>
): string | null {
  if (!body.tenantId) return "tenantId is required";
  if (!body.categoryId && !body.categoryName)
    return "Either categoryId or categoryName is required";
  if (!body.name) return "name is required";
  if (!body.description) return "description is required";
  if (!body.address) return "address is required";
  if (!body.city) return "city is required";
  if (!body.province) return "province is required";
  return null;
}

export async function createProperty(req: Request, res: Response) {
  try {
    let body = req.body as unknown as ICreatePropertyParam;

    // 🔍 Parse field yang mungkin dikirim dalam bentuk string JSON
    const pictures = parseBodyField<string[]>(body.pictures) ?? [];
    const rooms = parseBodyField<any[]>(body.rooms) ?? [];

    // 🧾 Validasi input
    const validationError = validatePropertyInput(body);
    if (validationError)
      return res.status(400).json({ error: validationError });

    // ☁️ Upload file jika ada
    const files = req.files as Express.Multer.File[] | undefined;
    const uploadedUrls =
      files && files.length > 0
        ? await Promise.all(
            files.map((file) => uploadToCloudinary(file.buffer))
          )
        : [];

    // 🏗️ Simpan ke DB
    const newProperty = await createPropertyWithRooms({
      tenantId: body.tenantId,
      ...(body.categoryId && { categoryId: body.categoryId }),
      ...(body.categoryName && { categoryName: body.categoryName }),
      name: body.name,
      description: body.description,
      address: body.address,
      city: body.city,
      province: body.province,
      pictures: [...pictures, ...uploadedUrls],
      rooms,
    });

    return res.status(201).json({
      message: "Property created successfully",
      data: newProperty,
    });
  } catch (error: any) {
    console.error("❌ Error creating property:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function getProperties(req: Request, res: Response) {
  try {
    const properties = await getAllProperties();
    return res.json({ data: properties });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function getProperty(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Invalid property id" });

    const property = await getPropertyById(id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    return res.json({ data: property });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function updatePropertyController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Invalid property id" });

    const updated = await updateProperty(id, req.body);
    return res.json({
      message: "Property updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function deletePropertyController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Invalid property id" });

    await deleteProperty(id);
    return res.json({ message: "Property deleted successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function getAllFilteredProperties(req: Request, res: Response) {
  try {
    const query = {
      search: req.query.search?.toString(),
      city: req.query.city?.toString(),
      province: req.query.province?.toString(),
      categoryId: req.query.categoryId?.toString(),
      page: req.query.page?.toString() ?? "1",
      limit: req.query.limit?.toString() ?? "9",
      minPrice: req.query.minPrice?.toString(),
      maxPrice: req.query.maxPrice?.toString(),
    };

    const properties = await getFilteredProperties(query);

    return res.json({
      message: "Filtered properties fetched successfully",
      ...properties,
    });
  } catch (error: any) {
    console.error("Error filtering properties:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
