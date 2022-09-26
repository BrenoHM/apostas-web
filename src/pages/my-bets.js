import AppLayout from "@/components/Layouts/AppLayout"
import Head from "next/head"
import { useState, useEffect, useContext } from "react"
import axios from "@/lib/axios"
import { LoadingContext } from "@/contexts/LoadingContext"

const MyBets = () => {

    const {setShowLoading} = useContext(LoadingContext)
    const [filter, setFilter] = useState('opened')
    const [bets, setBets] = useState([])

    useEffect(() => {
        setShowLoading(true)
        loadBets()
    }, [filter])

    const loadBets = async () => {
        try {
            const result = await axios.get(`/api/bets?filter=${filter}`)
            setBets(result.data.data)
            setShowLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AppLayout

            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Minhas apostas
                </h2>
            }>

            <Head>
                <title>Minhas apostas</title>
            </Head>

            <div className="py-9">
                <div className="sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex">
                                <button
                                    className={`${ filter == 'opened' ? 'bg-sky-700 text-white' : '' } border rounded p-2 cursor-pointer mr-5 focus:text-white focus:bg-sky-700`}
                                    onClick={() => setFilter('opened')}
                                >ABERTAS</button>
                                <button
                                    className={`${ filter == 'processed' ? 'bg-sky-700 text-white' : '' } border rounded p-2 cursor-pointer mr-5 focus:text-white focus:bg-sky-700`}
                                    onClick={() => setFilter('processed')}
                                >PROCESSADAS</button>
                            </div>

                            <table className="border-collapse border border-slate-400 w-full mt-5">
                                <thead>
                                    <tr>
                                        <th className="border border-slate-300">ID</th>
                                        <th className="border border-slate-300">Casa</th>
                                        <th className="border border-slate-300">Visitante</th>
                                        <th className="border border-slate-300">R$ Aposta</th>
                                        <th className="border border-slate-300">ODD</th>
                                        <th className="border border-slate-300">R$ Valor a receber</th>
                                        <th className="border border-slate-300">Status</th>
                                        <th className="border border-slate-300">Resultado</th>
                                        <th className="border border-slate-300">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bets.length > 0 ? bets.map(bet => (
                                        <tr key={bet.id} className={ bet.status == 'processed' ? (bet.winning_tem == bet.bet ? 'bg-green-100' : 'bg-red-100') : 'bg-blue-100' }>
                                            <td className="border border-slate-300 p-2 text-center">{bet.id}</td>
                                            <td className="border border-slate-300 p-2 text-center">{bet.name_home}</td>
                                            <td className="border border-slate-300 p-2 text-center">{bet.name_away}</td>
                                            <td className="border border-slate-300 p-2 text-center">{bet.bet_value}</td>
                                            <td className="border border-slate-300 p-2 text-center">{bet.odd}</td>
                                            <td className="border border-slate-300 p-2 text-center">{(bet.bet_value * bet.odd).toFixed(2)}</td>
                                            <td className="border border-slate-300 p-2 text-center">{bet.status == 'processed' ? 'Processada' : 'Aberta'}</td>
                                            <td className="border border-slate-300 p-2 text-center">{ bet.status == 'processed' ? (bet.winning_tem == bet.bet ? 'Vitória' : 'Derrota') : '' }</td>
                                            <td className="border border-slate-300 p-2 text-center">{bet.created_at}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="9" className="border border-slate-300 p-2 text-center">Nenhuma aposta encontrada</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}

export default MyBets