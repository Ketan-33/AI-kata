# API Contract - Podcast Episode Planner

Base URL: `http://localhost:3000/api`

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via Bearer token.

```
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints

### POST /auth/register
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-04-22T10:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### POST /auth/login
Authenticate user and receive JWT.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-04-22T10:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### GET /auth/me
Get current user profile.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-04-22T10:00:00.000Z",
  "updatedAt": "2026-04-22T10:00:00.000Z"
}
```

---

## Episodes Endpoints

### GET /episodes
Get all episodes for the authenticated user.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | all | Filter by: `all`, `draft`, `scripted`, `published` |
| search | string | - | Search in title/description |
| page | number | 1 | Page number |
| pageSize | number | 10 | Items per page (max 100) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Episode Title",
      "episodeNumber": 1,
      "description": "Episode description",
      "status": "draft",
      "scheduledDate": null,
      "tags": ["AI", "Tech"],
      "coverArt": null,
      "createdAt": "2026-04-22T10:00:00.000Z",
      "updatedAt": "2026-04-22T10:00:00.000Z",
      "guest": {
        "id": "uuid",
        "name": "Guest Name",
        "avatar": null
      },
      "script": {
        "id": "uuid",
        "contentType": "full_script"
      }
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 25
}
```

### GET /episodes/:id
Get a single episode with all related data.

**Response (200):**
```json
{
  "id": "uuid",
  "title": "Episode Title",
  "episodeNumber": 1,
  "description": "Episode description",
  "status": "draft",
  "scheduledDate": null,
  "tags": ["AI", "Tech"],
  "coverArt": null,
  "createdAt": "2026-04-22T10:00:00.000Z",
  "updatedAt": "2026-04-22T10:00:00.000Z",
  "guest": { ... },
  "script": { ... },
  "outline": { ... },
  "questions": [ ... ]
}
```

### POST /episodes
Create a new episode.

**Request Body:**
```json
{
  "title": "My New Episode",
  "episodeNumber": 5,
  "description": "Episode about...",
  "status": "draft",
  "scheduledDate": "2026-05-01T10:00:00.000Z",
  "tags": ["Marketing", "Growth"],
  "coverArt": "https://example.com/cover.jpg",
  "guestId": "guest-uuid"
}
```

**Response (201):** Episode object

### PUT /episodes/:id
Update an episode.

**Request Body:** Partial episode object (all fields optional)

**Response (200):** Updated episode object

### DELETE /episodes/:id
Delete an episode.

**Response (204):** No content

---

## Guests Endpoints

### GET /guests
Get all guests for the authenticated user.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| search | string | - | Search in name/bio |
| expertise | string | - | Filter by expertise tag |
| page | number | 1 | Page number |
| pageSize | number | 10 | Items per page (max 100) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Sarah Chen",
      "bio": "Tech entrepreneur...",
      "avatar": null,
      "expertise": ["AI", "Machine Learning"],
      "episodeCount": 3,
      "createdAt": "2026-04-22T10:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 15
}
```

### GET /guests/:id
Get a single guest with their episodes.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Sarah Chen",
  "bio": "Tech entrepreneur...",
  "avatar": null,
  "expertise": ["AI", "Machine Learning"],
  "createdAt": "2026-04-22T10:00:00.000Z",
  "episodes": [
    {
      "id": "uuid",
      "title": "Episode Title",
      "status": "published",
      "createdAt": "2026-04-22T10:00:00.000Z"
    }
  ]
}
```

### POST /guests
Create a new guest.

**Request Body:**
```json
{
  "name": "New Guest",
  "bio": "Guest bio...",
  "avatar": "https://example.com/avatar.jpg",
  "expertise": ["Marketing", "SaaS"]
}
```

**Response (201):** Guest object

### PUT /guests/:id
Update a guest.

**Response (200):** Updated guest object

### DELETE /guests/:id
Delete a guest.

**Response (204):** No content

---

## Scripts Endpoints

### POST /scripts/generate
Generate AI content for an episode.

**Request Body:**
```json
{
  "episodeId": "episode-uuid",
  "contentType": "full_script",
  "tone": "casual",
  "length": "medium",
  "customPrompt": "Focus on practical tips..."
}
```

**Content Types:** `full_script`, `interview_questions`, `outline`, `show_notes`

**Tones:** `casual`, `professional`, `storytelling`, `educational`

**Lengths:** `short` (5 min), `medium` (15 min), `long` (30+ min)

**Response (201):**
```json
{
  "id": "uuid",
  "content": "# Episode Script\n\n...",
  "contentType": "full_script",
  "tone": "casual",
  "length": "medium",
  "prompt": "Focus on practical tips...",
  "episodeId": "episode-uuid",
  "createdAt": "2026-04-22T10:00:00.000Z",
  "episode": {
    "id": "episode-uuid",
    "title": "Episode Title"
  }
}
```

### GET /scripts/:episodeId
Get script for an episode.

**Response (200):** Script object

### PUT /scripts/:episodeId
Update script content manually.

**Request Body:**
```json
{
  "content": "Updated script content..."
}
```

**Response (200):** Updated script object

### DELETE /scripts/:episodeId
Delete script for an episode (reverts episode to draft).

**Response (204):** No content

---

## Analytics Endpoints

### GET /analytics
Get full analytics dashboard data.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| range | string | 30d | Date range: `7d`, `30d`, `90d`, `all` |

**Response (200):**
```json
{
  "overview": {
    "totalEpisodes": 24,
    "publishedEpisodes": 18,
    "draftEpisodes": 4,
    "scriptedEpisodes": 2,
    "totalGuests": 31,
    "scriptsGenerated": 17
  },
  "episodesByStatus": [
    { "status": "draft", "count": 4 },
    { "status": "scripted", "count": 2 },
    { "status": "published", "count": 18 }
  ],
  "recentEpisodes": [ ... ],
  "topGuests": [
    {
      "id": "uuid",
      "name": "Sarah Chen",
      "avatar": null,
      "episodeCount": 5
    }
  ],
  "range": "30d"
}
```

### GET /analytics/summary
Get quick summary stats for dashboard cards.

**Response (200):**
```json
{
  "totalEpisodes": 24,
  "publishedEpisodes": 18,
  "draftEpisodes": 4,
  "totalGuests": 31
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [ ... ]
  }
}
```

**Common Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| BAD_REQUEST | 400 | Invalid request data |
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | No access to resource |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| INTERNAL_SERVER_ERROR | 500 | Server error |

---

## Test Credentials

For development and testing:
- **Email:** test@example.com
- **Password:** password123
