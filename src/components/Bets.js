import { useContext } from "react"
import { BetsContext } from "@/contexts/BetsContext"

const Bets = () => {
    const {bets} = useContext(BetsContext)
    return (
        <>
            {bets && bets.map(bet => (
                <p key={bet.id}>{bet.id}</p>
            ))}
        </>
    )
}

export default Bets