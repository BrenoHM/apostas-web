import { useContext, useState } from "react"
import { BetsContext } from "@/contexts/BetsContext"
import Button from "./Button"
import Input from "./Input"
import Alert from "./Alert"

const Bet = () => {
    const {openBet, setOpenBet, handleAddBet} = useContext(BetsContext)
    const [valueBet, setValueBet] = useState(0.0)
    const [showMessage, setShowMessage] = useState(false)

    const handleBet = () => {
        if( !valueBet ) {
            setShowMessage(true)
            return
        }

        openBet['betValue'] = parseFloat(valueBet)
        handleAddBet(openBet)
        clearBet(true)
    }

    const clearBet = (clearValueBet = false) => {
        if( clearValueBet ) {
            if( openBet['betValue'] ){
                openBet['betValue'].delete
            }
        }
        setOpenBet(null)
        setValueBet(0.0)
    }

    const closeMessage = () => {
        setShowMessage(false)
    }

    return (
        <>
            {openBet ? (
                <div>

                    { showMessage && <Alert message={'Favor inserir um valor.'} close={closeMessage} /> }
                    
                    <p>{openBet.home_name} x {openBet.away_name}</p>

                    <div className="flex justify-between mt-2 mb-2">
                        <span className="font-bold">{openBet.bet == 'home' ? openBet.home_name : (openBet.bet == 'away' ? openBet.away_name : 'Empate')}</span>
                        <span className="bg-green-200 rounded p-1">{openBet.bet == 'home' ? openBet.odds_ft_1 : (openBet.bet == 'away' ? openBet.odds_ft_2 : openBet.odds_ft_x)}</span>
                    </div>

                    <Input
                        type="number"
                        onKeyUp={(e) => setValueBet(e.target.value)}
                        onChange={(e) => setValueBet(e.target.value)}
                        className="mr-2 mb-2 p-1 border-black"
                        placeholder="Valor da aposta"
                        autoFocus
                    />
                    <div className="flex justify-between">
                        <span>Valor total da aposta</span>
                        <span>R$ {valueBet}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span>Ganho total</span>
                        <span>R$ {(valueBet * (openBet.bet == 'home' ? openBet.odds_ft_1 : (openBet.bet == 'away' ? openBet.odds_ft_2 : openBet.odds_ft_x))).toFixed(2)}</span>
                    </div>

                    <Button onClick={handleBet} className="mr-2">Apostar</Button>
                    <Button onClick={clearBet} className="!bg-red-500">Cancelar</Button>
                </div>
            ) : <p>Nenhuma seleção no boletim de aposta</p>}
        </>
    )
}

export default Bet