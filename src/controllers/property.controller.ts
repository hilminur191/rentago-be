import { Request, Response, NextFunction } from "express";
import * as propertyRepository from "../repositories/property.repository";
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
    const body = req.body as unknown as ICreatePropertyParam;

    const pictures = parseBodyField<string[]>(body.pictures) ?? [];
    const rooms = parseBodyField<any[]>(body.rooms) ?? [];

    const validationError = validatePropertyInput(body);
    if (validationError)
      return res.status(400).json({ error: validationError });

    // Upload file ke Cloudinary (jika ada)
    const files = req.files as Express.Multer.File[] | undefined;
    const uploadedUrls =
      files && files.length > 0
        ? await Promise.all(
            files.map((file) => uploadToCloudinary(file.buffer))
          )
        : [];

    // Simpan property + rooms ke DB
    const newProperty = await propertyRepository.createPropertyWithRooms({
      tenantId: body.tenantId,
      categoryId: body.categoryId,
      categoryName: body.categoryName,
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
    const properties = await propertyRepository.getAllProperties();
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

    const property = await propertyRepository.getPropertyById(id);
    return res.json({ data: property });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: "Property not found" });
    }
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function updatePropertyController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Invalid property id" });

    const updated = await propertyRepository.updateProperty(id, req.body);
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

    await propertyRepository.deleteProperty(id);
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

    const properties = await propertyRepository.getFilteredProperties(query);

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

export async function getMyProperties(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantId = (req as any).user?.id;
    if (!tenantId) {
      return res.status(401).json({ error: "Unauthorized: tenant not found" });
    }

    const properties = await propertyRepository.getPropertiesByTenant(tenantId);
    return res.json({ data: properties });
  } catch (error) {
    next(error);
  }
}