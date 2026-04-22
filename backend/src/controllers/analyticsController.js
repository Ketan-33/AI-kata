const prisma = require('../config/database');

/**
 * Get analytics overview for the authenticated user
 * GET /api/analytics
 */
const getAnalytics = async (req, res) => {
  const userId = req.user.id;
  const { range } = req.validatedQuery;

  // Calculate date range
  let startDate;
  const now = new Date();
  switch (range) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
    default:
      startDate = new Date(0);
  }

  // Get episode counts by status
  const [
    totalEpisodes,
    draftCount,
    scriptedCount,
    publishedCount,
    totalGuests,
    scriptsGenerated,
    recentEpisodes,
    topGuests,
  ] = await Promise.all([
    prisma.episode.count({ where: { ownerId: userId } }),
    prisma.episode.count({ where: { ownerId: userId, status: 'draft' } }),
    prisma.episode.count({ where: { ownerId: userId, status: 'scripted' } }),
    prisma.episode.count({ where: { ownerId: userId, status: 'published' } }),
    prisma.guest.count({ where: { ownerId: userId } }),
    prisma.script.count({
      where: {
        episode: { ownerId: userId },
        createdAt: { gte: startDate },
      },
    }),
    // Recent episodes for chart data
    prisma.episode.findMany({
      where: {
        ownerId: userId,
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    // Top guests by episode count
    prisma.guest.findMany({
      where: { ownerId: userId },
      include: {
        _count: {
          select: { episodes: true },
        },
      },
      orderBy: {
        episodes: {
          _count: 'desc',
        },
      },
      take: 5,
    }),
  ]);

  // Calculate episodes created over time (for charts)
  const episodesByDate = await prisma.episode.groupBy({
    by: ['status'],
    where: {
      ownerId: userId,
    },
    _count: {
      id: true,
    },
  });

  // Format top guests
  const formattedTopGuests = topGuests.map(guest => ({
    id: guest.id,
    name: guest.name,
    avatar: guest.avatar,
    episodeCount: guest._count.episodes,
  }));

  res.json({
    overview: {
      totalEpisodes,
      publishedEpisodes: publishedCount,
      draftEpisodes: draftCount,
      scriptedEpisodes: scriptedCount,
      totalGuests,
      scriptsGenerated,
    },
    episodesByStatus: episodesByDate.map(item => ({
      status: item.status,
      count: item._count.id,
    })),
    recentEpisodes,
    topGuests: formattedTopGuests,
    range,
  });
};

/**
 * Get dashboard summary stats
 * GET /api/analytics/summary
 */
const getSummary = async (req, res) => {
  const userId = req.user.id;

  const [
    totalEpisodes,
    publishedCount,
    draftCount,
    totalGuests,
  ] = await Promise.all([
    prisma.episode.count({ where: { ownerId: userId } }),
    prisma.episode.count({ where: { ownerId: userId, status: 'published' } }),
    prisma.episode.count({ where: { ownerId: userId, status: 'draft' } }),
    prisma.guest.count({ where: { ownerId: userId } }),
  ]);

  res.json({
    totalEpisodes,
    publishedEpisodes: publishedCount,
    draftEpisodes: draftCount,
    totalGuests,
  });
};

module.exports = {
  getAnalytics,
  getSummary,
};
