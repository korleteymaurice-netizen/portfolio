# API Reference

Complete documentation of all API endpoints.

## Authentication

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}
```

### Logout
```
POST /api/auth/logout
Authorization: Requires valid session cookie

Response: 200 OK
```

### Get Current User
```
GET /api/auth/me
Authorization: Requires valid session cookie

Response: 200 OK
{
  "id": "uuid",
  "email": "admin@example.com"
}
```

## Profile

### Get Profile (Public)
```
GET /api/about

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  "title": "Full Stack Developer",
  "bio": "I build web applications...",
  "profile_image": "data:image/jpeg;base64,...",
  "location": "San Francisco, CA",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "github_url": "https://github.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "other_socials": [],
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Update Profile (Admin)
```
PUT /api/about
Authorization: Requires admin session
Content-Type: application/json

{
  "name": "Jane Doe",
  "title": "Senior Developer",
  "bio": "Updated bio...",
  "profile_image": "data:image/jpeg;base64,...",
  "location": "New York, NY",
  "email": "jane@example.com",
  "phone": "+1-555-0124",
  "github_url": "https://github.com/janedoe",
  "linkedin_url": "https://linkedin.com/in/janedoe"
}

Response: 200 OK
{ /* updated profile */ }
```

## Skills

### List Skills (Public)
```
GET /api/skills

Response: 200 OK
[
  {
    "id": "uuid-1",
    "name": "React",
    "category": "Frontend",
    "proficiency": 90,
    "icon": "react",
    "display_order": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "uuid-2",
    "name": "Node.js",
    "category": "Backend",
    "proficiency": 85,
    "icon": "nodejs",
    "display_order": 2,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Skill (Admin)
```
POST /api/skills
Authorization: Requires admin session
Content-Type: application/json

{
  "name": "PostgreSQL",
  "category": "Database",
  "proficiency": 85,
  "icon": "postgres",
  "display_order": 3
}

Response: 201 Created
{ /* created skill */ }
```

### Update Skill (Admin)
```
PUT /api/skills/:id
Authorization: Requires admin session
Content-Type: application/json

{
  "proficiency": 90
}

Response: 200 OK
{ /* updated skill */ }
```

### Delete Skill (Admin)
```
DELETE /api/skills/:id
Authorization: Requires admin session

Response: 200 OK
{ "ok": true }
```

## Experience

### List Experience (Public)
```
GET /api/experience

Response: 200 OK
[
  {
    "id": "uuid",
    "job_title": "Senior Developer",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "start_date": "2022-01-01",
    "end_date": null,
    "current": true,
    "description": "Leading development team...",
    "achievements": ["Achievement 1", "Achievement 2"],
    "display_order": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Experience (Admin)
```
POST /api/experience
Authorization: Requires admin session
Content-Type: application/json

{
  "job_title": "Developer",
  "company": "StartupXYZ",
  "location": "Remote",
  "start_date": "2023-01-01",
  "end_date": "2023-12-31",
  "current": false,
  "description": "Built web applications",
  "achievements": ["Built 3 features", "Improved performance"],
  "display_order": 1
}

Response: 201 Created
```

### Update Experience (Admin)
```
PUT /api/experience/:id
Authorization: Requires admin session
```

### Delete Experience (Admin)
```
DELETE /api/experience/:id
Authorization: Requires admin session
```

## Education

### List Education (Public)
```
GET /api/education
```

### Create/Update/Delete Education (Admin)
```
POST /api/education
PUT /api/education/:id
DELETE /api/education/:id
```

Fields:
- `institution` (required)
- `degree` (required)
- `field`
- `start_date`
- `end_date`
- `grade`
- `description`
- `display_order`

## Certifications

### List Certifications (Public)
```
GET /api/certifications
```

### Create/Update/Delete Certifications (Admin)
```
POST /api/certifications
PUT /api/certifications/:id
DELETE /api/certifications/:id
```

Fields:
- `name` (required)
- `issuer` (required)
- `issue_date`
- `credential_id`
- `credential_url`
- `description`
- `icon`
- `display_order`

## Services

### List Services (Public)
```
GET /api/services

Filters published items automatically
```

### Create/Update/Delete Services (Admin)
```
POST /api/services
PUT /api/services/:id
DELETE /api/services/:id
```

Fields:
- `title` (required)
- `description` (required)
- `icon`
- `display_order`
- `published`

## Projects

### List Projects (Public)
```
GET /api/projects

Filters published items automatically
```

### Get Project Details
```
GET /api/projects/:id
```

### Create Project (Admin)
```
POST /api/projects
Authorization: Requires admin session
Content-Type: application/json

{
  "title": "E-commerce Platform",
  "slug": "ecommerce-platform",
  "short_description": "Full-stack e-commerce solution",
  "case_study": "Built a complete e-commerce platform...",
  "image_url": "https://example.com/image.jpg",
  "technologies": ["React", "Node.js", "PostgreSQL"],
  "github_url": "https://github.com/user/project",
  "live_demo_url": "https://demo.example.com",
  "status": "Completed",
  "featured": true,
  "published": true,
  "display_order": 1
}

Response: 201 Created
```

### Update Project (Admin)
```
PUT /api/projects/:id
Authorization: Requires admin session
```

### Delete Project (Admin)
```
DELETE /api/projects/:id
Authorization: Requires admin session
```

## Messages

### List Messages (Admin)
```
GET /api/messages
Authorization: Requires admin session
```

### Create Message (Public - Contact Form)
```
POST /api/messages
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Website Inquiry",
  "message": "I'd like to discuss a project..."
}

Response: 201 Created
```

### Mark Message as Read (Admin)
```
PUT /api/messages/:id
Authorization: Requires admin session

{
  "is_read": true
}
```

### Delete Message (Admin)
```
DELETE /api/messages/:id
Authorization: Requires admin session
```

## Resume

### Get Resume URL (Public)
```
GET /api/resume

Response: 200 OK
{
  "id": 1,
  "file_url": "https://example.com/resume.pdf",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Update Resume (Admin)
```
PUT /api/resume
Authorization: Requires admin session
Content-Type: application/json

{
  "file_url": "https://example.com/new-resume.pdf"
}

Response: 200 OK
```

## File Upload

### Upload File (Admin)
```
POST /api/upload
Authorization: Requires admin session
Content-Type: multipart/form-data

file: <binary file data>

Response: 200 OK
{
  "url": "data:image/jpeg;base64,...",
  "filename": "profile.jpg"
}
```

Supported formats: JPG, PNG, WEBP, GIF
Max size: 2MB

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Not found"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error"
}
```

## Rate Limiting

No rate limiting implemented. For production, consider adding:
- Per-IP rate limiting
- Per-user rate limiting
- API key authentication

## CORS

CORS is configured for:
- Development: `http://localhost:5173`
- Production: Your Vercel domain

Update Express server configuration if deploying to different domain.

## Authentication Notes

- All admin endpoints require valid session cookie
- Cookie name: `oc_admin`
- Cookie expires: 8 hours
- Password hashed with bcryptjs (10 salt rounds)
- JWT tokens signed with AUTH_SECRET

## Data Types

- `uuid`: UUID v4 string
- `date`: ISO 8601 date (YYYY-MM-DD)
- `timestamp`: ISO 8601 datetime with timezone
- `jsonb`: JSON array or object
- `boolean`: true/false
- `integer`: 0-100 for proficiency

## Pagination

Currently not implemented. All endpoints return all results.

## Sorting

Results sorted by:
- `display_order ASC` (primary)
- `created_at DESC` (secondary)

---

**Last Updated**: September 26, 2026
