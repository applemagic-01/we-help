"use client"
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingHistoryList from './_component/BookingHistoryList'
import GlobalApi from '@/app/_services/GlobalApi'
import { useSession } from 'next-auth/react'
import moment from 'moment'

function MyBooking() {

    const {data}=useSession();
    const [bookingHistory,setBookingHistory]=useState([]);

    /**
     * Used to Get User Booking History
     */
    useEffect(() => {
        data && GetUserBookingHistory();
    }, [data]);

    const GetUserBookingHistory = () => {
        GlobalApi.GetUserBookingHistory(data.user.email)
            .then(resp => {
                console.log("Full API Response:", resp); // Log the complete response
                if (resp && resp.bookings && resp.bookings.length > 0) {
                    console.log("Bookings Data:", resp.bookings);
                    console.log("First Booking:", resp.bookings[0]); // Inspect the first booking
                    setBookingHistory(resp.bookings);
                } else {
                    console.warn("No bookings found in API response or empty array", resp);
                }
            })
            .catch(error => {
                console.error("Error fetching booking history:", error);
            });
    };

    const filterData = (type) => {
        const now = new Date(); // Get the current date and time

        const results = bookingHistory.filter((item) => {
            const bookingDate = new Date(item.date); // Parse the booking date

            if (isNaN(bookingDate.getTime())) {
                console.warn(`Invalid date format for booking: ${item.date}`, item); //Log any issues.  This helps with debugging if the date format is invalid.
                return false; // Skip bookings with invalid date formats
            }


            if (type === 'booked') {
                return bookingDate > now; // Strictly greater than the current date and time
            } else if (type === 'completed') {
                return bookingDate <= now; // Less than or equal to the current date and time
            } else {
                console.error(`Invalid filter type: ${type}`);
                return false;
            }
        });

        return results;
    };

    return (
        <div className='my-10 mx-5 md:mx-36'>
           <h2 className='font-bold text-[20px] my-2'>My Bookings</h2>
            <Tabs defaultValue="booked" className="w-full">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="booked">Booked</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="booked">
                    <BookingHistoryList 
                    bookingHistory={filterData('booked')}
                    type='booked'
                    />
                </TabsContent>
                <TabsContent value="completed">
                <BookingHistoryList 
                bookingHistory={filterData('completed')}
                type='completed'/>
                    
                </TabsContent>
            </Tabs>

        </div>
            .
    )
}

export default MyBooking