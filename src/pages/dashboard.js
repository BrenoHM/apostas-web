import AppLayout from '@/components/Layouts/AppLayout'
import Match from '@/components/Match'
import Head from 'next/head'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const Dashboard = () => {

    const [matches, setMatches] = useState([])

    useEffect(() => {
        loadMatchesToday()
    }, [])

    const loadMatchesToday = async () => {
        const result = await axios.get('/api/matches/today')
        setMatches(result.data)
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Partidas de hoje
                </h2>
            }>

            <Head>
                <title>Laravel - Partidas de hoje</title>
            </Head>

            <div className="py-9">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {matches && matches.map(matche => (
                                <Match matche={matche} key={matche.id} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Dashboard
