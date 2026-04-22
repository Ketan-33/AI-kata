const prisma = require('../config/database');
const { notFound, forbidden } = require('../utils/errors');

/**
 * Get all guests for the authenticated user
 * GET /api/guests
 */
const getGuests = async (req, res) => {
  const { search, expertise, page, pageSize } = req.validatedQuery;
  const skip = (page - 1) * pageSize;

  // Build where clause
  const where = {
    ownerId: req.user.id,
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { bio: { contains: search } },
    ];
  }

  if (expertise) {
    // Search for expertise tag in JSON array
    where.expertise = { contains: expertise };
  }

  // Get guests with pagination
  const [guests, total] = await Promise.all([
    prisma.guest.findMany({
      where,
      include: {
        _count: {
          select: { episodes: true },
        },
      },
      orderBy: { name: 'asc' },
      skip,
      take: pageSize,
    }),
    prisma.guest.count({ where }),
  ]);

  // Parse JSON fields and format response
  const data = guests.map(guest => ({
    ...guest,
    expertise: guest.expertise ? JSON.parse(guest.expertise) : [],
    episodeCount: guest._count.episodes,
    _count: undefined,
  }));

  res.json({
    data,
    page,
    pageSize,
    total,
  });
};

/**
 * Get a single guest by ID
 * GET /api/guests/:id
 */
const getGuest = async (req, res) => {
  const { id } = req.params;

  const guest = await prisma.guest.findUnique({
    where: { id },
    include: {
      episodes: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!guest) {
    notFound('Guest not found');
  }

  // Ownership check
  if (guest.ownerId !== req.user.id) {
    forbidden('You do not have access to this guest');
  }

  // Parse JSON fields
  res.json({
    ...guest,
    expertise: guest.expertise ? JSON.parse(guest.expertise) : [],
  });
};

/**
 * Create a new guest
 * POST /api/guests
 */
const createGuest = async (req, res) => {
  const { expertise, ...data } = req.validated;

  const guest = await prisma.guest.create({
    data: {
      ...data,
      expertise: expertise ? JSON.stringify(expertise) : null,
      ownerId: req.user.id,
    },
  });

  res.status(201).json({
    ...guest,
    expertise: guest.expertise ? JSON.parse(guest.expertise) : [],
    episodeCount: 0,
  });
};

/**
 * Update a guest
 * PUT /api/guests/:id
 */
const updateGuest = async (req, res) => {
  const { id } = req.params;
  const { expertise, ...data } = req.validated;

  // Find guest and verify ownership
  const existing = await prisma.guest.findUnique({ where: { id } });

  if (!existing) {
    notFound('Guest not found');
  }

  if (existing.ownerId !== req.user.id) {
    forbidden('You do not have access to this guest');
  }

  const updateData = { ...data };
  if (expertise !== undefined) {
    updateData.expertise = expertise ? JSON.stringify(expertise) : null;
  }

  const guest = await prisma.guest.update({
    where: { id },
    data: updateData,
    include: {
      _count: {
        select: { episodes: true },
      },
    },
  });

  res.json({
    ...guest,
    expertise: guest.expertise ? JSON.parse(guest.expertise) : [],
    episodeCount: guest._count.episodes,
    _count: undefined,
  });
};

/**
 * Delete a guest
 * DELETE /api/guests/:id
 */
const deleteGuest = async (req, res) => {
  const { id } = req.params;

  // Find guest and verify ownership
  const existing = await prisma.guest.findUnique({ where: { id } });

  if (!existing) {
    notFound('Guest not found');
  }

  if (existing.ownerId !== req.user.id) {
    forbidden('You do not have access to this guest');
  }

  await prisma.guest.delete({ where: { id } });

  res.status(204).send();
};

module.exports = {
  getGuests,
  getGuest,
  createGuest,
  updateGuest,
  deleteGuest,
};
