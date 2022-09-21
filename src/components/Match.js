import { useContext } from 'react'
import Image from "next/image"
import { BetsContext } from '@/contexts/BetsContext'

const Match = ({matche}) => {

    const { setOpenBet } = useContext(BetsContext)

    const handleOpenBet = (matche, tip) => {
        matche['bet'] = tip
        setOpenBet(matche)
    }

    return (
        <div className="mb-7">
            <h3 className="border border-slate-300 bg-gray-500 text-white text-center">Estádio {matche.stadium_name}</h3>
            <div className="flex justify-between">
                <div className='flex-1'>
                    <div className="border border-slate-300 bg-gray-100 text-center">Mandante</div>
                    <div className='flex flex-col items-center pt-5'>
                        
                            <span>{matche.home_name}</span>
                            <Image
                                src={`https://cdn.footystats.org/img/${matche.home_image}`}
                                width="64"
                                height="64"
                                className='max-w-full'
                            />
                            <button
                                title="Apostar"
                                className="mt-2 rounded bg-green-300 hover:bg-green-400 p-2 border border-green-500"
                                onClick={() => handleOpenBet(matche, 'home')}>
                                {matche.odds_ft_1}
                            </button>
                        
                    </div>
                </div>
                <div className='flex-1'>
                    <div className="border border-slate-300 bg-gray-100 text-center">Empate</div>
                    <div className='flex justify-center py-12'>
                        <button
                            title="Apostar"
                            className="mt-2 rounded bg-green-300 hover:bg-green-400 p-2 border border-green-500"
                            onClick={() => handleOpenBet(matche, 'x')}>
                            {matche.odds_ft_x}
                        </button>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className="border border-slate-300 bg-gray-100 text-center">Visitante</div>
                    <div className='flex flex-col items-center pt-5'>
                        <span>{matche.away_name}</span>
                        <Image
                            src={`https://cdn.footystats.org/img/${matche.away_image}`}
                            width="64"
                            height="64"
                            className='max-w-full'
                        />
                        <button
                            title="Apostar"
                            className="mt-2 rounded bg-green-300 hover:bg-green-400 p-2 border border-green-500"
                            onClick={() => handleOpenBet(matche, 'away')}>
                            {matche.odds_ft_2}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Match