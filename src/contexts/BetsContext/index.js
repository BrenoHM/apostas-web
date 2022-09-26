import { createContext, useState, useEffect, useContext } from "react"
import axios from "@/lib/axios"
import { LoadingContext } from "../LoadingContext"
import Swal from 'sweetalert2'

export const BetsContext = createContext({})

export const BetsProvider = ({children}) => {

    const { setShowLoading } = useContext(LoadingContext)

    const [bets, setBets] = useState([])

    const [openBet, setOpenBet] = useState()

    useEffect(() => {
        console.log(bets)
        loadBets()
    }, [])

    useEffect(() => {
        console.log(openBet)
    }, [openBet])

    const loadBets = async () => {
        try {
            const result = await axios.get('/api/bets')
            setBets(result.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddBet = async (bet) => {

        setShowLoading(true)

        const data = {
            "match_id": bet.id,
            "home_id": bet.homeID,
            "away_id": bet.awayID,
            "name_home": bet.home_name,
            "name_away": bet.away_name,
            "odd": bet.bet == "home" ? bet.odds_ft_1 : bet.bet == "away" ? bet.odds_ft_2 : bet.odds_ft_x,
            "bet": bet.bet == "home" ? bet.homeID : bet.bet == "away" ? bet.awayID : -1,
            "bet_value": bet.betValue
        }

        try {

            const result = await axios.post('/api/bets', data)

            if( result.data.success ) {
                setBets([...bets, result.data.data])
                Swal.fire(
                    '',
                    'Sua aposta foi realizada com sucesso!',
                    'success'
                )
            }
            setShowLoading(false)
            
        } catch (error) {
            if( error.response.status == 422 || error.response.status == 400 ){
                Swal.fire(
                    'Opss',
                    error.response.data.errors.join('\n'),
                    'info'
                )
            }
            setShowLoading(false)
        }

    }

    return (
        <BetsContext.Provider value={{
            bets,
            handleAddBet,
            openBet,
            setOpenBet
        }}>
            {children}
        </BetsContext.Provider>
    )
}