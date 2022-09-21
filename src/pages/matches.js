import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Match from '@/components/Match'

const Matches = () => {

    const router = useRouter()

    const [matches, setMatches] = useState([])

    useEffect(() => {
        loadMatches()
    }, [router.query.season_id])

    const loadMatches = async () => {
        const result = await axios.get('/api/matches')
        setMatches(result.data)
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Partidas Realizadas
                </h2>
            }>

            <Head>
                <title>Apostas - Partidas</title>
            </Head>

            <div className="py-9">
                <div className="sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Partidas {router.query.season_id} */}
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
export default Matches