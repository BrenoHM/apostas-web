import { createContext, useState, useEffect } from "react"
import axios from "@/lib/axios"

export const BetsContext = createContext({})

export const BetsProvider = ({children}) => {

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
        console.log('load bets')
        try {
            const result = await axios.get('/api/bets')
            setBets(result.data.data)   
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddBet = async (bet) => {

        const data = {
            "match_id": bet.id,
            "home_id": bet.homeID,
            "away_id": bet.awayID,
            "odd": bet.bet == "home" ? bet.odds_ft_1 : bet.bet == "away" ? bet.odds_ft_2 : bet.odds_ft_x,
            "bet": bet.bet == "home" ? bet.homeID : bet.bet == "away" ? bet.awayID : -1,
            "bet_value": bet.betValue
        }

        try {

            const result = await axios.post('/api/bets', data)

            if( result.data.success ) {
                alert('Aposta realizada com sucesso')
                setBets([...bets, result.data.data])
            }else{
                alert('aposta nao realizada')
            }
            
        } catch (error) {
            if( error.response.status == 422 || error.response.status == 400 ){
                alert(error.response.data.errors.join('\n'))
            }
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