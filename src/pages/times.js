import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const Dashboard = () => {

    const [times, setTimes] = useState([])

    useEffect(() => {
        loadTimes()
    }, [])

    const loadTimes = async () => {
        const result = await axios.get('/times')
        setTimes(result.data)
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Times
                </h2>
            }>

            <Head>
                <title>Laravel - Times</title>
            </Head>

            <div className="py-12">
                <div className="sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {times.map(time => (
                                <p key={time.name}>{time.name}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
        </AppLayout>
    )
}

export default Dashboard
