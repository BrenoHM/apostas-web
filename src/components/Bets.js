import { useContext } from "react"
import { BetsContext } from "@/contexts/BetsContext"

const Bets = () => {
    const {bets} = useContext(BetsContext)
    return (
        <>
            {bets && bets.map(bet => (
                <div key={bet.id} className="border-b-2 border-gray py-5 last:border-0">
                    <span className={`${bet.bet == bet.home_id ? 'font-bold bg-green-100 rounded p-1' : ''}`}>{bet.name_home}</span> 
                    <span className={`mx-2 ${bet.bet == -1 ? 'font-bold bg-green-100 rounded p-1' : ''}`}>X</span>
                    <span className={`${bet.bet == bet.away_id ? 'font-bold bg-green-100 rounded p-1' : ''}`}>{bet.name_away}</span>
                </div>
            ))}
        </>
    )
}

export default Bets