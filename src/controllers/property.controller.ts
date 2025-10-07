import { Request, Response } from "express";
import {
  createPropertyWithRooms,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getFilteredProperties
} from "../repositories/property.repository";
import { ICreatePropertyParam } from "../interfaces/property.types";

export async function createProperty(req: Request, res: Response) {
  try {
    const {
      tenantId,
      categoryId,
      categoryName,
      name,
      description,
      address,
      city,
      province,
      pictures,
      rooms,
    } = req.body as ICreatePropertyParam;

    if (!tenantId) return res.status(400).json({ error: "tenantId is required" });
    if (!categoryId && !categoryName) {
      return res.status(400).json({ error: "Either categoryId or categoryName is required" });
    }
    if (!name) return res.status(400).json({ error: "name is required" });
    if (!description) return res.status(400).json({ error: "description is required" });
    if (!address) return res.status(400).json({ error: "address is required" });
    if (!city) return res.status(400).json({ error: "city is required" });
    if (!province) return res.status(400).json({ error: "province is required" });

    const newProperty = await createPropertyWithRooms({
      tenantId,
      ...(categoryId && { categoryId }),
      ...(categoryName && { categoryName }),
      name,
      description,
      address,
      city,
      province,
      pictures: pictures ?? [],
      rooms: rooms ?? [],
    });

    return res.status(201).json({
      message: "Property created successfully",
      data: newProperty,
    });
  } catch (error: any) {
    console.error("Error creating property:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function getProperties(req: Request, res: Response) {
  try {
    const properties = await getAllProperties();
    return res.json({ data: properties });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal server error" });
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
    if (!id) {
      return res.status(400).json({ error: "Invalid property id" });
    }

    const updated = await updateProperty(id, req.body);
    return res.json({
      message: "Property updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function deletePropertyController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Invalid property id" });
    }

    await deleteProperty(id);
    return res.json({ message: "Property deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function getAllFilteredProperties(req: Request, res: Response) {
  try {
    const {
      search,
      city,
      province,
      categoryId,
      minPrice,
      maxPrice,
      page,
      limit,
    } = req.query;

    const query = {
      search: search ? String(search) : undefined,
      city: city ? String(city) : undefined,
      province: province ? String(province) : undefined,
      categoryId: categoryId ? String(categoryId) : undefined,
      page: page ? String(page) : "1",
      limit: limit ? String(limit) : "9",
      minPrice: minPrice ? String(minPrice) : undefined,
      maxPrice: maxPrice ? String(maxPrice) : undefined,
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