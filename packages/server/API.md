# Forum API Documentation

## Base URL
```
http://localhost:3001/api
```

## Topics API

### Get all topics
```
GET /api/topics
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Topic title",
    "author": "Author name",
    "authorBadge": "Badge",
    "date": "01.01.24 12:00",
    "preview": "Topic preview text",
    "tags": ["tag1", "tag2"],
    "likes": 5,
    "comments": 10
  }
]
```

### Get topic by ID
```
GET /api/topics/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "Topic title",
  "author": "Author name",
  "authorBadge": "Badge",
  "date": "01.01.24 12:00",
  "preview": "Topic preview text",
  "tags": ["tag1", "tag2"],
  "likes": 5,
  "comments": 10
}
```

### Create new topic
```
POST /api/topics
```

**Request Body:**
```json
{
  "title": "Topic title",
  "author": "Author name",
  "author_badge": "Badge",
  "preview": "Topic preview text",
  "tags": ["tag1", "tag2"]
}
```

**Response:** 201 Created
```json
{
  "id": 1,
  "title": "Topic title",
  "author": "Author name",
  "authorBadge": "Badge",
  "date": "01.01.24 12:00",
  "preview": "Topic preview text",
  "tags": ["tag1", "tag2"],
  "likes": 0,
  "comments": 0
}
```

### Update topic
```
PUT /api/topics/:id
```

**Request Body:**
```json
{
  "title": "Updated title",
  "preview": "Updated preview",
  "tags": ["tag1", "tag2"]
}
```

### Delete topic
```
DELETE /api/topics/:id
```

**Response:** 200 OK
```json
{
  "message": "Topic deleted successfully"
}
```

## Posts (Comments) API

### Get all posts (comments) for a topic
```
GET /api/topics/:topicId/posts
```

**Response:**
```json
[
  {
    "id": 1,
    "text": "Comment text",
    "author": "Author name",
    "date": "01.01.24 12:00",
    "author_id": 1,
    "topic_id": 1,
    "replies_count": 2,
    "replies": [
      {
        "id": 2,
        "text": "Reply text",
        "author": "Author name",
        "date": "01.01.24 12:05",
        "author_id": 2,
        "topic_id": 1,
        "parent_id": 1
      }
    ]
  }
]
```

### Create new post (comment) in a topic
```
POST /api/topics/:topicId/posts
```

**Request Body:**
```json
{
  "content": "Comment text",
  "author": "Author name",
  "author_id": 1
}
```

**Response:** 201 Created
```json
{
  "id": 1,
  "text": "Comment text",
  "author": "Author name",
  "date": "01.01.24 12:00",
  "author_id": 1,
  "topic_id": 1
}
```

### Create reply to a comment
```
POST /api/topics/:topicId/posts
```

**Request Body:**
```json
{
  "content": "Reply text",
  "author": "Author name",
  "author_id": 2,
  "parent_id": 1
}
```

**Response:** 201 Created
```json
{
  "id": 2,
  "text": "Reply text",
  "author": "Author name",
  "date": "01.01.24 12:05",
  "author_id": 2,
  "topic_id": 1,
  "parent_id": 1
}
```

### Get post by ID
```
GET /api/posts/:id
```

**Response:**
```json
{
  "id": 1,
  "text": "Comment text",
  "author": "Author name",
  "date": "01.01.24 12:00",
  "author_id": 1,
  "topic_id": 1,
  "parent_id": null,
  "replies_count": 2
}
```

### Get replies for a post
```
GET /api/posts/:postId/replies
```

**Response:**
```json
[
  {
    "id": 2,
    "text": "Reply text",
    "author": "Author name",
    "date": "01.01.24 12:05",
    "author_id": 2,
    "topic_id": 1,
    "parent_id": 1
  }
]
```

### Update post
```
PUT /api/posts/:id
```

**Request Body:**
```json
{
  "content": "Updated comment text"
}
```

### Delete post
```
DELETE /api/posts/:id
```

**Response:** 200 OK
```json
{
  "message": "Post deleted successfully"
}
```

## Reactions API

### Add reaction to topic
```
POST /api/topics/:topicId/reactions
```

**Request Body:**
```json
{
  "user_id": 1,
  "emoji": "👍"
}
```

**Response:** 201 Created
```json
{
  "id": 1,
  "topic_id": 1,
  "user_id": 1,
  "emoji": "👍",
  "created_at": "2024-01-01T12:00:00.000Z"
}
```

### Get all reactions for a topic
```
GET /api/topics/:topicId/reactions
```

**Response:**
```json
{
  "topic_id": 1,
  "stats": [
    {
      "emoji": "👍",
      "count": 5,
      "users": [1, 2, 3, 4, 5]
    }
  ],
  "reactions": [
    {
      "id": 1,
      "topic_id": 1,
      "user_id": 1,
      "emoji": "👍",
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Remove reaction
```
DELETE /api/topics/:topicId/reactions
```

**Request Body:**
```json
{
  "user_id": 1,
  "emoji": "👍"
}
```

**Response:** 200 OK
```json
{
  "message": "Reaction removed successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

- **400 Bad Request** - Invalid request data
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists (e.g., duplicate reaction)
- **500 Internal Server Error** - Server error

**Error Response Format:**
```json
{
  "error": "Error message"
}
```
