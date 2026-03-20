import prisma from "../config/db.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: { addresses },
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      data: { address },
    });
  } catch (error) {
    console.error("Get address by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching address",
      error: error.message,
    });
  }
};

export const createAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;

    if (!street || !city || !state || !zipCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide street, city, state, and zipCode",
      });
    }

    // If this is the first address, make it default
    const addressCount = await prisma.address.count({
      where: { userId: req.user.id },
    });

    const shouldBeDefault = isDefault || addressCount === 0;

    // If setting as default, unset other defaults
    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        street,
        city,
        state,
        zipCode,
        country: country || "USA",
        isDefault: shouldBeDefault,
      },
    });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: { address },
    });
  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating address",
      error: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, zipCode, country, isDefault } = req.body;

    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If setting as default, unset other defaults
    if (isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updates = {};
    if (street !== undefined) updates.street = street;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (zipCode !== undefined) updates.zipCode = zipCode;
    if (country !== undefined) updates.country = country;
    if (isDefault !== undefined) updates.isDefault = isDefault;

    const address = await prisma.address.update({
      where: { id },
      data: updates,
    });

    res.json({
      success: true,
      message: "Address updated successfully",
      data: { address },
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await prisma.address.delete({
      where: { id },
    });

    // If we deleted the default address, make the most recent one default if it exists
    if (address.isDefault) {
      const latestAddress = await prisma.address.findFirst({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
      });

      if (latestAddress) {
        await prisma.address.update({
          where: { id: latestAddress.id },
          data: { isDefault: true },
        });
      }
    }

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
      error: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: req.user.id, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);

    res.json({
      success: true,
      message: "Default address updated",
    });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({
      success: false,
      message: "Error setting default address",
      error: error.message,
    });
  }
};
