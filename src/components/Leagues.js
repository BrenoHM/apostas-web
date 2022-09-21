import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Leagues = () => {

    const router = useRouter()

    const [leagues, setLeagues] = useState([])

    useEffect(() => {
        loadLeagues()
    }, [])

    const loadLeagues = async () => {
        const result = await axios.get('/leagues')
        setLeagues(result.data)
    }

    return (
        <>
            { leagues && leagues.map(league => (
                <Link
                    key={league.name}
                    href={`/matches?season_id=${league.season[0].id}`}
                    className="bg-black">
                    <div className={`border-b-2 border-gray cursor-pointer flex items-center hover:bg-gray-200 p-1 ${router.asPath === '/matches?season_id='+league.season[0].id ? `bg-gray-200` : ''}`}>
                        <span className='mr-2'><img src='brasil.png' /></span>
                        <span>{league.league_name}</span>
                    </div>
                </Link>
            )) }
            
            
        </>
    )
}

export default Leagues
