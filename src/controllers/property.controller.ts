import { Request, Response } from "express";
import { createPropertyWithRooms } from "../repositories/property.repository";
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
      picture,
      rooms,
    } = req.body as ICreatePropertyParam;

    if (!tenantId) {
      return res.status(400).json({ error: "tenantId is required" });
    }
    if (!categoryId && !categoryName) {
      return res.status(400).json({
        error: "Either categoryId or categoryName is required",
      });
    }
    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }
    if (!description) {
      return res.status(400).json({ error: "description is required" });
    }
    if (!address) {
      return res.status(400).json({ error: "address is required" });
    }
    if (!city) {
      return res.status(400).json({ error: "city is required" });
    }
    if (!province) {
      return res.status(400).json({ error: "province is required" });
    }

    const newProperty = await createPropertyWithRooms({
      tenantId,
      categoryId,
      categoryName,
      name,
      description,
      address,
      city,
      province,
      picture: picture ?? null,
      rooms: rooms ?? [],
    });

    return res.status(201).json({
      message: "Property created successfully",
      data: newProperty,
    });
  } catch (error: any) {
    console.error("Error creating property:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

