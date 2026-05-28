import { Request, Response } from "express";
import prisma from "../prisma/client";
import { Role } from "@prisma/client";


export const getEvents = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("GET EVENTS HIT");

    const events = await prisma.events.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tickets: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Error fetching events",
    });
  }
};

//////////////////////////////////////////////////
// ✅ GET EVENT BY ID
//////////////////////////////////////////////////
export const getEventById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const event = await prisma.events.findUnique({
      where: { id },
      include: {
        users: true,
        tickets: true,
        reviews: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//////////////////////////////////////////////////
// ✅ CREATE EVENT (ORGANIZER ONLY)
//////////////////////////////////////////////////
export const createEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    // 🔥 ROLE CHECK
    if (!user || user.role !== Role.ORGANIZER) {
      return res.status(403).json({
        message: "Only organizer can create event",
      });
    }

    const {
      title,
      description,
      start_date,
      end_date,
      category,
      location,
      venue_name,
      venue_address,
      latitude,
      longitude,
      tickets,
    } = req.body;

    // 🔥 VALIDATION
    if (!title || !start_date || !end_date) {
      return res.status(400).json({
        message: "Title, start_date, end_date are required",
      });
    }

    const event = await prisma.events.create({
      data: {
        title,
        description,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        category,
        location,
        venue_name,
        venue_address,
        latitude,
        longitude,
        organizer_id: user.id,

        // 🔥 CREATE TICKETS
        tickets: tickets
          ? {
              create: tickets.map((t: any) => ({
                name: t.name,
                price: Number(t.price),
                quota: Number(t.quota),
              })),
            }
          : undefined,
      },
      include: {
        tickets: true,
      },
    });

    res.status(201).json({
      message: "Event created successfully",
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Error creating event",
    });
  }
};

//////////////////////////////////////////////////
// ✅ UPDATE EVENT
//////////////////////////////////////////////////
export const updateEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const user = (req as any).user;

    const event = await prisma.events.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // OWNER CHECK
    if (event.organizer_id !== user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const {
      title,
      description,
      start_date,
      end_date,
      category,
      location,
      venue_name,
      venue_address,
      latitude,
      longitude,
    } = req.body;

    const updated = await prisma.events.update({
      where: { id },
      data: {
        title,
        description,
        category,
        location,
        venue_name,
        venue_address,
        latitude,
        longitude,
        start_date: start_date
          ? new Date(start_date)
          : undefined,
        end_date: end_date
          ? new Date(end_date)
          : undefined,
      },
    });

    res.status(200).json({
      message: "Event updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Failed to update event",
    });
  }
};

//////////////////////////////////////////////////
// ✅ DELETE EVENT
//////////////////////////////////////////////////
export const deleteEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const user = (req as any).user;

    const event = await prisma.events.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // 🔥 OWNER CHECK
    if (event.organizer_id !== user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await prisma.events.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Event deleted",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};