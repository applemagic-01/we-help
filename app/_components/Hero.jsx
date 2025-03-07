import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'


function Hero() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            router.push(`/search/${encodeURIComponent(searchTerm)}`);
        }
    };

    const toTitleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className='flex items-center gap-3 flex-col justify-center pt-14 pb-7'>
            <h2 className='font-bold text-[46px] text-center'>
                Find Home
                <span className='text-primary'> Service/Repair</span>
                <br></br>Near You
            </h2>
            <h2 className='text-xl text-gray-400'>Explore Best Home Service & Repair near you</h2>
            <div className='mt-4 flex gap-4 items-center'>
                <Input
                    type="text"
                    placeholder={toTitleCase('Search')}  // Correctly use toTitleCase here
                    className="rounded-full md:w-[350px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="rounded-full h-[46px]" onClick={handleSearch}>
                    <Search className='h-4 w-4' />
                </Button>
            </div>
        </div>
    )
}

export default Hero