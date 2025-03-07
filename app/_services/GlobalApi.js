const { gql, request } = require("graphql-request");

const MASTER_URL = 'https://ap-south-1.cdn.hygraph.com/content/cm20o00wa009107wfw0gf9zzl/master';
const HYGRAPH_API_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MzIwMzYzNjQsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtMjBvMDB3YTAwOTEwN3dmdzBnZjl6emwvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiJiYWM0M2E3ZC01YTdjLTQ2NDItYjY0OC1iNzc1MjcxY2EyY2UiLCJqdGkiOiJjbTNvcHFjYm4wMXc3MDdwaGdvYmcxM3owIn0.K91U-ZW0eW9Nb8m9I5FESjIvUbspYn6syq3qPZPjn2C1EH4KL0Q2ztOuoVAejH-gWYNPRlcFBqOWNPSFSimPUz1qvVG0uQCJnfyPB40k258yLykBFAIC2TToP9KXsAjkzxOPknUfd2C_RfZKaGKgvTkxek3bt_T2qCNNjdsS0_WCeA5jB9kpvV87DhpzERBiQW99T1yPPpALqEiv4UhBovY-Qiyptjx6cHcLjUq6t5dSwjwZ9o72Fue3A9Ct4rRVZCYdZ7wLFhnBWjiDUvOS8LgLCNGkMNDz_yD9bPcVbicUSb9SHLWgH-TMir68oTT8Y4e6Qzp4GdV1NJdcD8QTdNQufubpc8KYrjVnAptrQJc-kCOdFcBzDcSbb0UPfPMj4ZQUxvL1bDOFNgjIOlayKa1dVAlnkXOHLGHo7vZiCvok6cwVTpCefUbMX0BrxNsv_hE75yHjRBWB5CB_fntEB-1cLxvcEmpCiPcXq024BSaBhBeh4sTSRAiShJYa0kM_WbpC2XD_kUgmwkzeuvIuN3XfUpmkIQosLMXdwer_bNbeMoRcsHffEvYet2vSga1G6rFXUXqAQwzS166O2wVEonlOhnRDnLnMIiU5PW6kmXYS4S8oyvZbyn8Zv0Ed5UccIV1_0diJOG_WKrAz3gWNFDT7FuTvSCaLge8PfPNVa_A";
const HYGRAPH_API_URL="https://api-ap-south-1.hygraph.com/v2/cm20o00wa009107wfw0gf9zzl/master"

// Fetch all categories
const getCategory = async () => {
  const query = gql`
    query Category {
      categories {
        bgcolor {
          hex
        }
        id
        name
        icon {
          url
        }
      }
    }
  `;
  return await request(MASTER_URL, query);
};

// Fetch all businesses
const getAllBusinessList = async () => {
  const query = gql`
    query BusinessList {
      businessLists {
        about
        address
        category {
          name
        }
        contactPerson
        email
        images {
          url
        }
        id
        name
      }
    }
  `;
  return await request(MASTER_URL, query);
};

// Fetch businesses by category
const getBusinessByCategory = async (category) => {
  const query = gql`
    query BusinessByCategory {
      businessLists(where: { category: { name: "${category}" } }) {
        about
        address
        category {
          name
        }
        contactPerson
        email
        id
        name
        images {
          url
        }
      }
    }
  `;
  return await request(MASTER_URL, query);
};

// Fetch business by ID
const getBusinessById = async (id) => {
  const query = gql`
    query GetBusinessById {
      businessList(where: { id: "${id}" }) {
        about
        address
        category {
          name
        }
        contactPerson
        email
        id
        name
        images {
          url
        }
      }
    }
  `;
  return await request(MASTER_URL, query);
};

// Create a new booking
const createNewBooking = async (businessId, date, time, userEmail, userName) => {
  const mutationQuery = gql`
    mutation CreateBooking {
      createBooking(
        data: {
          bookingStatus: booked
          business: { connect: { id: "${businessId}" } }
          date: "${date}"
          time: "${time}"
          userEmail: "${userEmail}"
          userName: "${userName}",
          published: true,
        }
      ) {
        id
      }
    }
  `;
  return await request(MASTER_URL, mutationQuery);
};

// Publish many bookings
const publishManyBookings = async (bookingIds) => {
  const mutationQuery = gql`
    mutation PublishManyBookings {
      publishManyBookings(where: { id_in: ${bookingIds} }) {
        count
      }
    }
  `;
  return await request(MASTER_URL, mutationQuery);
};

// Fetch booked slots for a business on a specific date
const BusinessBookedSlot = async (businessId, date) => {
  const query = gql`
    query BusinessBookedSlot {
      bookings(where: { business: { id: "${businessId}" }, date: "${date}" }) {
        date
        time
      }
    }
  `;
  return await request(MASTER_URL, query);
};

// Fetch user booking history
const GetUserBookingHistory = async (userEmail) => {
  const query = gql`
    query GetUserBookingHistory {
      bookings(
        where: { userEmail: "${userEmail}" }
        orderBy: publishedAt_DESC
      ) {
        business {
          name
          images {
            url
          }
          contactPerson
          address
        }
        date
        time
        id
      }
    }
  `;
  return await request(MASTER_URL, query);
};

// Delete a booking
const deleteBooking = async (bookingId) => {
  const mutationQuery = gql`
    mutation DeleteBooking {
      deleteBooking(where: { id: "${bookingId}" }) {
        id
      }
    }
  `;
  return await request(MASTER_URL, mutationQuery);
};

// Fetch all booking history
const GetAllBookingHistory = async () => {
  const query = gql`
    query GetAllBookingHistory {
      bookings(orderBy: publishedAt_DESC) {
        id
        date
        time
        userEmail
        userName
        bookingStatus
        business {
          name
          images {
            url
          }
          contactPerson
          address
        }
      }
    }
  `;
  return await request(MASTER_URL, query);
};


const getPresignedUrlMutation = gql`
  mutation getPresignedUrl($fileName: String!, $content_type: String!) {  // Correct field name
    createAsset(data: { fileName: $fileName, content_type: $content_type }) {  // Correct field name
      id
      url // Or whatever field in your Hygraph response contains the pre-signed URL
    }
  }
`;

async function getPresignedUrl(filename, contentType) {
  console.log("Requesting pre-signed URL for:", filename, contentType);
  

  try {
      const variables = {
          filename: filename,
          contentType: contentType
      };
      const response = await request(HYGRAPH_ENDPOINT, getPresignedUrlMutation, variables, {
          'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      });

      //Extract the pre-signed URL from Hygraph's response. This depends on your Hygraph API response
      const presignedUrl = response.createAsset.url;  //This might be wrong. Check your Hygraph response!

      if (!presignedUrl) {
        throw new Error("Pre-signed URL not found in Hygraph response");
      }
      console.log("Pre-signed URL received:", presignedUrl);
      return presignedUrl;
  } catch (error) {
      console.error("Error getting pre-signed URL:", error);
      throw error; // Re-throw for handling upstream
  }
}
//2. Upload File to Pre-signed URL
async function uploadFileToHygraph(presignedUrl, file) {
  console.log("Uploading file to:", presignedUrl);
  try {
      const response = await fetch(presignedUrl, {
          method: 'PUT',
          body: file
      });

      if (!response.ok) {
          const errorText = await response.text().catch(() => 'Failed to parse error response');
          throw new Error(`Hygraph upload failed: ${response.status} ${errorText}`);
      }
      const data = await response.json(); // Parse the response to get the Asset ID
      console.log("Upload successful. Response:", data);
      return data.id; //Check Hygraph's response for the correct field name.
  } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
  }
}

//3. Get the Asset ID
async function getAssetId(uploadResponse){
  //This depends on your Hygraph setup; check the API documentation for asset creation
  return uploadResponse.id; // replace with actual field name if different
}



async function uploadImageToStorage(imageFile) {
    const filename = imageFile.name;
    const fileType = imageFile.type;
    try {
        const presignedUrl = await getPresignedUrl(filename, fileType);
        const uploadResponse = await uploadFileToHygraph(presignedUrl, imageFile);
        const assetId = await getAssetId(uploadResponse);
        return assetId;
    } catch (error) {
        console.error("Error uploading asset:", error);
        throw error;
    }
}

// ... rest of your GlobalApi.js code ...


// Export all functions
const HYGRAPH_ENDPOINT = 'https://api-ap-south-1.hygraph.com/v2/cm20o00wa009107wfw0gf9zzl/master'; // Replace with your Hygraph endpoint
const HYGRAPH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MzIwMzYzNjQsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtMjBvMDB3YTAwOTEwN3dmdzBnZjl6emwvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiJiYWM0M2E3ZC01YTdjLTQ2NDItYjY0OC1iNzc1MjcxY2EyY2UiLCJqdGkiOiJjbTNvcHFjYm4wMXc3MDdwaGdvYmcxM3owIn0.K91U-ZW0eW9Nb8m9I5FESjIvUbspYn6syq3qPZPjn2C1EH4KL0Q2ztOuoVAejH-gWYNPRlcFBqOWNPSFSimPUz1qvVG0uQCJnfyPB40k258yLykBFAIC2TToP9KXsAjkzxOPknUfd2C_RfZKaGKgvTkxek3bt_T2qCNNjdsS0_WCeA5jB9kpvV87DhpzERBiQW99T1yPPpALqEiv4UhBovY-Qiyptjx6cHcLjUq6t5dSwjwZ9o72Fue3A9Ct4rRVZCYdZ7wLFhnBWjiDUvOS8LgLCNGkMNDz_yD9bPcVbicUSb9SHLWgH-TMir68oTT8Y4e6Qzp4GdV1NJdcD8QTdNQufubpc8KYrjVnAptrQJc-kCOdFcBzDcSbb0UPfPMj4ZQUxvL1bDOFNgjIOlayKa1dVAlnkXOHLGHo7vZiCvok6cwVTpCefUbMX0BrxNsv_hE75yHjRBWB5CB_fntEB-1cLxvcEmpCiPcXq024BSaBhBeh4sTSRAiShJYa0kM_WbpC2XD_kUgmwkzeuvIuN3XfUpmkIQosLMXdwer_bNbeMoRcsHffEvYet2vSga1G6rFXUXqAQwzS166O2wVEonlOhnRDnLnMIiU5PW6kmXYS4S8oyvZbyn8Zv0Ed5UccIV1_0diJOG_WKrAz3gWNFDT7FuTvSCaLge8PfPNVa_A'; // Replace with your Hygraph token


async function createAsset(file){
  //This is a placeholder. It depends entirely on your Hygraph configuration.
  //It should make an API call to Hygraph to upload the asset and get back the asset ID.
  try{
    const res = await fetch('https://api-ap-south-1.hygraph.com/v2/cm20o00wa009107wfw0gf9zzl/master/upload',{
      method: 'POST',
      body: file,
      headers: {
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    const data = await res.json();
    return data.id;
  }catch(error){
    console.error('Error creating asset:',error);
    throw error;
  }
}

const createBusinessMutation = gql`
  mutation createBusiness($data: BusinessListCreateInput!) {
    createBusinessList(data: $data) {
      id
      name
      # ... other fields to return
    }
  }
`;

async function createBusiness(formData) {
  try {
    const assetIds = await Promise.all(formData.images.map(createAsset)); // Get asset IDs

    const variables = {
      data: {
        name: formData.name,
        contactPerson: formData.contactPerson,
        address: formData.address,
        about: formData.about,
        email: formData.email,
        category: { connect: { id: formData.categoryId } },
        images: {
          connect: assetIds.map(id => ({id}))
        }
      }
    };

    const response = await request(HYGRAPH_ENDPOINT, createBusinessMutation, variables, {
      'Authorization': `Bearer ${HYGRAPH_TOKEN}`
    });
    console.log('Business created successfully:', response);
    return response.createBusinessList.id;
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
}


export { createBusiness, uploadImageToStorage };

export default {
  getCategory,
  getAllBusinessList,
  getBusinessByCategory,
  getBusinessById,
  createNewBooking,
  BusinessBookedSlot,
  GetUserBookingHistory,
  deleteBooking,
  publishManyBookings,
  GetAllBookingHistory,
  createBusiness
};
