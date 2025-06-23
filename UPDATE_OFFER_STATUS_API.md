# Update Offer Status API

## Overview

This document describes the new update offer status functionality that allows administrators to approve or reject quotation offers.

## API Endpoint

- **URL**: `{{base_url}}/admin/quotation/updateOfferStatus`
- **Method**: `POST`
- **Authentication**: Bearer Token required

## Request Body

```json
{
  "quotation_offer_id": 7,
  "status": "approved"
}
```

### Parameters

- `quotation_offer_id` (number, required): The ID of the quotation offer to update
- `status` (string, required): The new status. Valid values:
  - `"approved"` - Approve the offer
  - `"rejected"` - Reject the offer
  - `"pending"` - Set back to pending status

## Response

The API will return a success response with the updated offer details.

## Frontend Implementation

### Service Function

The functionality is implemented in `src/services/quotationController.js`:

```javascript
export const updateOfferStatus = async (token, quotationOfferId, status) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/quotation/updateOfferStatus`,
      {
        quotation_offer_id: quotationOfferId,
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### UI Integration

The functionality is integrated into the Quotation Details page (`src/pages/QuotationDetails.jsx`):

1. **Import**: Added `updateOfferStatus` to the imports from quotationController
2. **State Management**: Added `updatingOfferStatus` state to track loading
3. **Handler Function**: Created `handleUpdateOfferStatus` function
4. **UI Updates**:
   - Added Actions column to the offers table
   - Added Approve/Reject buttons with conditional rendering
   - Added loading states and success/error notifications
   - Updated status styling to include rejected status

### Usage

1. Navigate to a quotation details page
2. Scroll to the "Offers" section
3. For each offer, you'll see Approve/Reject buttons (if not already approved/rejected)
4. Click the appropriate button to update the offer status
5. The status will be updated and the offers list will refresh automatically

## Error Handling

- Network errors are caught and displayed as toast notifications
- Loading states prevent multiple simultaneous requests
- Success messages confirm the action was completed

## Security

- Requires admin authentication (Bearer token)
- Only administrators can update offer statuses
- All requests are validated on the backend
