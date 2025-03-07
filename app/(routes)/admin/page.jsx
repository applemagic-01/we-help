"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingHistoryList from "../mybooking/_component/BookingHistoryList";
import GlobalApi from "@/app/_services/GlobalApi";
import { useRouter } from "next/navigation";
import BusinessList from "@/app/_components/BusinessList";
import {uploadImageToStorage,createBusiness} from '@/app/_services/GlobalApi'





function Admin() {
  const router = useRouter();
  const [businessList, setBusinessList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    address: "",
    about: "",
    email: "",
    category: "",
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);  // For error messages

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    GlobalApi.getAllBusinessList()
      .then((data) => {
        setBusinessList(data.businessLists || []);
      })
      .catch((error) => {
        console.error("Error fetching businesses", error);
      });

    // Fetch booking history on load
    GlobalApi.GetAllBookingHistory()
      .then((data) => {
        setBookingHistory(data.bookings || []);
      })
      .catch((error) => {
        console.error("Error fetching booking history", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // Reset error message before submission

    if (
      !formData.name ||
      !formData.contactPerson ||
      !formData.address ||
      !formData.about ||
      !formData.email ||
      !formData.category ||
      formData.images.length === 0
    ) {
      setErrorMessage("Please fill in all fields and upload at least one image.");
      setIsLoading(false);
      return;
    }

    try {
      // Handle image uploads
      const uploadedImages = await Promise.all(formData.images.map(uploadImageToStorage));
      
      // Now send the uploaded images as URLs
      const createdBusinessId = await GlobalApi.createBusiness({
        ...formData,
        images: uploadedImages,  // Use the image URLs here
      });

      alert("Business uploaded successfully!");
      
      // Reset the form after successful submission
      setFormData({
        name: "",
        contactPerson: "",
        address: "",
        about: "",
        email: "",
        category: "",
        images: [],
      });
    } catch (error) {
      console.error("Error uploading business:", error.message || error.response || error);
      setErrorMessage("Failed to upload business. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = (status) => {
    return bookingHistory.filter((booking) => booking.bookingStatus === status);
  };

  return (
    <div className="my-10 mx-5 md:mx-36">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-[20px] my-2">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <Tabs defaultValue="allServices" className="w-full mt-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="allServices">All Services</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="booked">Booked Services</TabsTrigger>
          <TabsTrigger value="completed">Completed Services</TabsTrigger>
        </TabsList>

        <TabsContent value="allServices">
          <BusinessList businessList={businessList} />
        </TabsContent>

        <TabsContent value="upload">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block font-bold">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block font-bold">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block font-bold">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
                required
              ></textarea>
            </div>
            <div>
              <label className="block font-bold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block font-bold">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block font-bold">Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400" : "bg-blue-500"
              } text-white px-4 py-2 rounded`}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </TabsContent>

        <TabsContent value="booked">
          <BookingHistoryList bookingHistory={filterData("booked")} type="booked" />
        </TabsContent>

        <TabsContent value="completed">
          <BookingHistoryList
            bookingHistory={filterData("completed")}
            type="completed"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Admin;
