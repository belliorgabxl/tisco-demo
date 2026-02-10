# TISCO API - Bruno Collection

Bruno API testing collection for TISCO Coupon System

## 📁 Structure

```
tisco-api/
├── Auth/
│   ├── Register.bru
│   ├── Login.bru
│   ├── Get Me (Current User).bru
│   └── Logout.bru
├── Credits/
│   ├── Get My Credits.bru
│   └── Add Points (Testing).bru
├── Coupons/
│   ├── List Coupons.bru
│   ├── Create Coupon.bru
│   ├── Get Coupon by ID.bru
│   ├── Update Coupon.bru
│   ├── Delete Coupon.bru
│   ├── Redeem Coupon (Keep).bru
│   ├── Use Coupon.bru
│   ├── Get Coupon History.bru
│   └── Get My Coupons.bru
├── History/
│   └── Get User History.bru
├── environment.bru
└── bruno.json
```

## 🚀 Getting Started

1. **Install Bruno**
   ```bash
   # macOS
   brew install bruno
   
   # Or download from https://www.usebruno.com/
   ```

2. **Open Collection**
   - Open Bruno app
   - Click "Open Collection"
   - Select the `tisco-api` folder

3. **Start Your Dev Server**
   ```bash
   npm run dev
   # Server should be running on http://localhost:3000
   ```

## 🔑 Authentication Setup

Most endpoints require authentication. The API supports two authentication methods:

### Authentication Methods

**A) Cookie Authentication (Automatic)**
- Login sets `auth_token` in httpOnly cookie
- Works automatically in browsers
- Used by default in Bruno collection

**B) Authorization Header**
- Send token in header: `Authorization: Bearer {token}`
- Works everywhere (mobile, CLI, etc.)
- Token is returned in login response body

### Quick Start - First Time Setup

1. **Register a New Account**
   - Request: `Auth/Register`
   - Create your test account
   - Save your username/password

2. **Login**
   - Request: `Auth/Login`
   - Use your username/password
   - Response includes token in body: `{ "success": true, "token": "...", "user": {...} }`
   - Bruno auto-saves token to `{{auth_token}}` environment variable
   - Token also set in httpOnly cookie automatically

3. **Verify Login**
   - Request: `Auth/Get Me (Current User)`
   - Should return your user profile and points
   - Save your userId for testing

4. **Ready to Test!**
   - All authenticated endpoints will now work automatically
   - Token is available as `{{auth_token}}` variable
   - You can use either cookie OR Authorization header

## 📝 Complete Testing Flow

### Step 0: Authentication (First Time)
**Request:** `Auth/Register`
```json
{
  "username": "testuser",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "dateOfBirth": "1990-01-15",
  "consentAccepted": true
}
```

**Request:** `Auth/Login`
```json
{
  "username": "testuser",
  "password": "password123"
}
```
✅ Auth token is automatically saved!

**Request:** `Auth/Get Me (Current User)`
- Verify you're logged in
- Check your initial point balance (should be 0,0,0)

### Step 1: Add Points for Testing
**Request:** `Credits/Add Points (Testing)`
```json
{
  "tiscoPoint": 1000,
  "twealthPoint": 500,
  "tinsurePoint": 300,
  "description": "Testing points"
}
```

**Request:** `Credits/Get My Credits`
- Verify points were added successfully
- You should see: 1000, 500, 300

### Step 2: Create a Coupon
**Request:** `Create Coupon`
```json
{
  "coupon_type": "discount",
  "title": "20% Off Next Purchase",
  "stock": 100,
  "expired": "2026-12-31T23:59:59.999Z",
  "pointCost": 100,
  "applicableBU": "tisco"
}
```

**Copy the `_id` from response** - you'll need it for other requests.

### Step 3: List All Coupons
**Request:** `List Coupons`
- No auth required
- Use query params to filter:
  - `status=new`
  - `applicableBU=tisco`
  - `limit=20`

### Step 4: Redeem a Coupon (Keep)
**Request:** `Redeem Coupon (Keep)`
- Replace `:id` in URL with actual **coupon template ID**
- Set auth token in headers
```json
{
  "pointType": "tisco"
}
```

This will:
- ✅ Deduct points from user
- ✅ Create a new UserCoupon instance
- ✅ Generate unique code (format: TIS-XXXXXXXXXXXX)
- ✅ Decrease coupon stock
- ✅ Log to history

**Save the `uniqueCode` from response** - you'll need it for Step 5!

### Step 5: Use the Coupon
**Request:** `Use Coupon`
- Replace `:uniqueCode` with actual **uniqueCode** (TIS-XXXXXXXXXXXX)
- Get uniqueCode from Step 4 redeem response or "Get My Coupons"
- Set auth token in headers
- This changes UserCoupon status: REDEEMED → USED
- ✅ Logs to history

Example URL: `/api/coupons/TIS-123456789012/use`

### Step 6: Check History
**Request:** `Get User History`
- See all your transactions
- Filter by type: `?type=coupon_redeem`
- Filter by status: `?status=success`

### Step 7: Get My Coupons
**Request:** `Get My Coupons`
- See all UserCoupons you've redeemed
- Default: Shows only REDEEMED status (unused coupons)
- Filter by status: `?status=used` (to see used coupons)
- Each coupon includes uniqueCode for Step 5

## 🎯 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login and get token |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| POST | `/api/auth/logout` | ✅ | Logout (clear token) |

### Credits (Points)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/credits` | ✅ | Get points balance |
| POST | `/api/credits` | ✅ | Add points (testing only) |

### Coupon CRUD
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/coupons` | ❌ | List all coupons |
| POST | `/api/coupons` | ❌ | Create new coupon |
| GET | `/api/coupons/:id` | ❌ | Get single coupon |
| PATCH | `/api/coupons/:id` | ❌ | Update coupon |
| DELETE | `/api/coupons/:id` | ❌ | Delete coupon |

### Coupon Actions (Require Auth)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/coupons/:id/redeem` | ✅ | Redeem coupon (NEW → KEEP) |
| POST | `/api/coupons/:id/use` | ✅ | Use coupon (KEEP → USED) |
| GET | `/api/coupons/:id/history` | ✅ | Get coupon usage history |
| GET | `/api/coupons/my` | ✅ | Get user's coupons |

### History

### History
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/history` | ✅ | Get user's complete history |

## 🔍 Query Parameters

### List Coupons
- `status` - new, keep, used, suspend
- `tierId` - Filter by tier ID
- `coupon_type` - Filter by type
- `applicableBU` - tisco, twealth, tinsure, all
- `limit` - Items per page (default: 50)
- `skip` - Pagination offset (default: 0)

### Get History
- `type` - coupon_redeem, coupon_use, point_earn, point_spend
- `status` - success, failed, pending, cancelled
- `limit` - Items per page (default: 50)
- `skip` - Pagination offset (default: 0)

### Get My Coupons
- `status` - keep, used
- `limit` - Items per page (default: 50)
- `skip` - Pagination offset (default: 0)

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "pagination": {
    "total": 100,
    "limit": 50,
    "skip": 0,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* validation errors */ }
}
```

## 💡 Tips

1. **Use Variables**
   - Set common values in `environment.bru`
   - Use `{{baseUrl}}`, `{{auth_token}}`, etc.

2. **Test in Order**
   - Create → List → Get → Redeem → Use → History
   - This ensures all endpoints work correctly

3. **Point Type Matching**
   - Check coupon's `applicableBU` field
   - Use matching point type when redeeming

4. **Stock Check**
   - Monitor `stock` field
   - Cannot redeem when stock = 0

5. **Expiration**
   - Check `expired` date
   - Cannot redeem/use expired coupons

## 🐛 Troubleshooting

### "Unauthorized" Error
- Make sure auth_token is set in Cookie header
- Token might be expired, login again

### "Invalid coupon ID" Error
- Check if ID is valid MongoDB ObjectId
- Copy ID directly from create/list response

### "Insufficient points" Error
- User doesn't have enough points
- Check point balance first

### "Coupon out of stock" Error
- No more coupons available
- Create new coupon or increase stock

## 📚 Related Models

### Coupon Status Flow
```
NEW → KEEP → USED
      ↓
   SUSPEND (admin action)
```

### Point Types
- **tiscoPoint** - TISCO Bank points
- **twealthPoint** - TWealth points
- **tinsurePoint** - TInsure points

Each user has all 3 types of points.
