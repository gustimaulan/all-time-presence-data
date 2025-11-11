# Architecture Documentation

## Overview

This is a Node.js/Express.js application that serves as a RESTful API backend for fetching and serving presence/attendance data from Google Sheets. The application provides data pagination, caching mechanisms, and data validation while serving a frontend web interface.

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Express.js     │    │  Google Sheets  │
│   (HTML/JS)     │◄──►│   API Server     │◄──►│     API         │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  In-Memory   │
                       │    Cache     │
                       └──────────────┘
```

## Core Components

### 1. Express.js Server
- **Port**: Configurable via `PORT` environment variable (default: 3000)
- **Middleware**: 
  - CORS enabled for cross-origin requests
  - Static file serving from `/public` directory
- **Base URL**: `http://localhost:3000`

### 2. Google Sheets Integration
- **Data Source**: Google Sheets via Google Sheets API v4
- **Authentication**: API Key based authentication
- **Timezone**: Asia/Jakarta (GMT+7) for all datetime outputs
- **Configuration**:
  - `GOOGLE_SHEET_ID`: The spreadsheet ID
  - `GOOGLE_API_KEY`: API key for authentication
  - `GOOGLE_SHEET_RANGE`: Data range to fetch

#### Data Structure
The Google Sheets header contains the following columns:
- **Timestamp** (datetime): Entry timestamp in Asia/Jakarta timezone
- **Nama Tentor** (string): Teacher/tutor name
- **Hari dan Tanggal Les** (date): Lesson date in DD/MM/YYYY format
- **Jam Kegiatan Les** (time): Lesson time in HH:mm format
- **Nama Siswa** (string): Student name

### 3. Caching System
- **Type**: In-memory caching
- **Duration**: 5 minutes (300,000 ms)
- **Variables**:
  - `cachedData`: Stores processed data
  - `lastFetchTime`: Timestamp of last data fetch

### 4. Data Validation & Processing
- **Required Fields Validation**: Ensures data integrity
- **Empty Row Filtering**: Removes incomplete entries
- **Data Formatting**: Converts raw Google Sheets data to structured objects

## Data Flow

```
1. Client Request
   ↓
2. Cache Check (5-min TTL)
   ├── Cache Hit → Return Cached Data
   └── Cache Miss → Continue to Step 3
   ↓
3. Fetch from Google Sheets API
   ↓
4. Data Processing & Validation
   ├── Remove Empty Rows
   ├── Format Data Structure
   └── Validate Required Fields
   ↓
5. Apply Pagination
   ↓
6. Update Cache
   ↓
7. Return Response to Client
```

## API Endpoints

### GET `/api/data`
**Purpose**: Retrieve paginated attendance data

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 100)

**Response Structure**:
```json
{
  "cached": boolean,
  "data": [...],
  "pagination": {
    "currentPage": number,
    "pageSize": number,
    "totalItems": number,
    "totalPages": number,
    "hasNextPage": boolean,
    "hasPreviousPage": boolean
  }
}
```

**Examples**:
- `/api/data` - First 100 items
- `/api/data?page=2&pageSize=50` - Items 51-100 with page size 50
- `/api/data?page=3&pageSize=100` - Items 201-300

### GET `/api/refresh`
**Purpose**: Force refresh data from Google Sheets (bypasses cache)

**Response Structure**:
```json
{
  "message": "Data refreshed",
  "data": [...]
}
```

## Key Functions

### `fetchGoogleSheetData()`
- **Purpose**: Fetches and processes data from Google Sheets
- **Process**:
  1. Makes HTTP request to Google Sheets API
  2. Extracts headers from first row
  3. Filters out empty rows
  4. Maps data to objects
  5. Validates required fields
  6. Updates cache
- **Returns**: Array of validated data objects

### `paginateData(data, page, pageSize)`
- **Purpose**: Implements pagination logic
- **Parameters**:
  - `data`: Full dataset array
  - `page`: Current page number
  - `pageSize`: Number of items per page
- **Returns**: Object with paginated data and metadata

### `isRowEmpty(row, headers)`
- **Purpose**: Checks if a row has all required fields empty
- **Logic**: Returns true if ALL required fields are empty/missing
- **Used for**: Filtering out completely empty rows

### `isRowValid(obj)`
- **Purpose**: Validates that all required fields have values
- **Logic**: Returns true if ALL required fields have non-empty values
- **Used for**: Final validation after data processing

## Configuration

### Environment Variables
```env
PORT=3000                    # Server port
GOOGLE_SHEET_ID=your_id      # Google Sheets document ID
GOOGLE_API_KEY=your_key      # Google API key
GOOGLE_SHEET_RANGE=Sheet1!A:E # Data range to fetch
```

### Required Fields
The following fields are required and validated for each record:
```javascript
const REQUIRED_FIELDS = [
    "Nama Tentor",           // Teacher/tutor name (string)
    "Nama Siswa",            // Student name (string)
    "Hari dan Tanggal Les",  // Lesson date (DD/MM/YYYY format)
    "Jam Kegiatan Les",      // Lesson time (HH:mm format)
    "Timestamp"              // Entry timestamp (datetime in Asia/Jakarta timezone)
];
```

#### Field Specifications
- **Timestamp**: DateTime in Asia/Jakarta timezone (GMT+7)
- **Nama Tentor**: String - Teacher/tutor name
- **Hari dan Tanggal Les**: Date string in DD/MM/YYYY format
- **Jam Kegiatan Les**: Time string in HH:mm format
- **Nama Siswa**: String - Student name

### Cache Configuration
```javascript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

## Dependencies

### Production Dependencies
- **express**: Web framework for Node.js
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing middleware
- **path**: Node.js path utilities

### Development Dependencies
- **nodemon**: Development server with auto-restart

## Data Validation Rules

### Row-Level Validation
1. **Empty Row Check**: Filters rows where ALL required fields are empty
2. **Field Validation**: Ensures ALL required fields have non-empty values
3. **Trimming**: Removes whitespace from field values
4. **Format Validation**: 
   - Date fields must follow DD/MM/YYYY format
   - Time fields must follow HH:mm format
   - Timestamps are processed in Asia/Jakarta timezone (GMT+7)

### Data Processing Pipeline
1. Raw data from Google Sheets
2. Skip header row (first row)
3. Filter empty rows
4. Map to structured objects with proper data types
5. Apply field validation and format checking
6. Ensure timezone consistency (Asia/Jakarta)
7. Cache processed data

## Error Handling

### API Errors
- **500**: Internal server error (Google Sheets API failure)
- **400**: Invalid pagination parameters
- **No Data**: Returns error if Google Sheets returns empty data

### Validation Errors
- Empty rows are silently filtered out
- Invalid rows are removed from final dataset
- Logging provided for debugging

## Performance Considerations

### Caching Strategy
- **TTL**: 5-minute cache duration balances freshness vs performance
- **Memory Usage**: All data stored in memory (consider Redis for production)
- **Cache Invalidation**: Manual refresh endpoint available

### Pagination Benefits
- **Reduced Response Size**: Limits data transfer
- **Improved Performance**: Faster response times
- **Better UX**: Enables progressive loading

## Security Considerations

### API Key Management
- Google API key stored in environment variables
- No API key exposed in client-side code

### CORS Configuration
- CORS enabled for all origins (consider restricting in production)

### Data Validation
- Server-side validation prevents malformed data
- Required field validation ensures data integrity

## Deployment Architecture

### Development
```
Local Machine
├── Node.js Application (Port 3000)
├── Static Files (/public)
└── Environment Variables (.env)
```

### Production Recommendations
```
Load Balancer
├── Node.js Instance 1
├── Node.js Instance 2
├── Redis Cache (External)
└── Environment Configuration
```

## Monitoring & Logging

### Current Logging
- Data fetch operations
- Cache hit/miss status
- Row processing statistics
- Error conditions

### Recommended Additions
- Request/response logging
- Performance metrics
- Error tracking
- Cache statistics

## Future Enhancements

### Scalability
1. **External Cache**: Redis or Memcached
2. **Database Storage**: Consider database for better querying
3. **Rate Limiting**: Protect against abuse
4. **Load Balancing**: Multiple instance support

### Features
1. **Filtering**: Add field-based filtering
2. **Sorting**: Multiple sort options
3. **Real-time Updates**: WebSocket integration
4. **Export Features**: CSV/Excel export
5. **Authentication**: User management system

### Performance
1. **Compression**: Response compression
2. **CDN**: Static asset delivery
3. **Database Indexing**: If moving to database
4. **Connection Pooling**: Optimize HTTP requests 