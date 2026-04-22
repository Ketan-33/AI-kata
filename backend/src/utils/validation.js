const { z } = require('zod');

// Auth schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Episode schemas
const createEpisodeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  episodeNumber: z.number().int().positive().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(['draft', 'scripted', 'published']).default('draft'),
  scheduledDate: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  coverArt: z.string().url().optional().nullable(),
  guestId: z.string().uuid().optional().nullable(),
});

const updateEpisodeSchema = createEpisodeSchema.partial();

const episodeFilterSchema = z.object({
  status: z.enum(['all', 'draft', 'scripted', 'published']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

// Guest schemas
const createGuestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  bio: z.string().max(1000).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  expertise: z.array(z.string()).optional().nullable(),
});

const updateGuestSchema = createGuestSchema.partial();

const guestFilterSchema = z.object({
  search: z.string().optional(),
  expertise: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

// Script generation schema
const generateScriptSchema = z.object({
  episodeId: z.string().uuid('Invalid episode ID'),
  contentType: z.enum(['full_script', 'interview_questions', 'outline', 'show_notes']).default('full_script'),
  tone: z.enum(['casual', 'professional', 'storytelling', 'educational']).default('casual'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  customPrompt: z.string().max(2000).optional().nullable(),
});

// Analytics filter schema
const analyticsFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  range: z.enum(['7d', '30d', '90d', 'all']).default('30d'),
});

/**
 * Validate request body against schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { badRequest } = require('./errors');
      badRequest('Validation failed', error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })));
    }
    next(error);
  }
};

/**
 * Validate query parameters against schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => (req, res, next) => {
  try {
    req.validatedQuery = schema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { badRequest } = require('./errors');
      badRequest('Invalid query parameters', error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })));
    }
    next(error);
  }
};

module.exports = {
  // Schemas
  registerSchema,
  loginSchema,
  createEpisodeSchema,
  updateEpisodeSchema,
  episodeFilterSchema,
  createGuestSchema,
  updateGuestSchema,
  guestFilterSchema,
  generateScriptSchema,
  analyticsFilterSchema,
  // Validators
  validate,
  validateQuery,
};
