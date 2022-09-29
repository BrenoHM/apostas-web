import Credit from "@/components/Credit"
import Input from "@/components/Input"
import AppLayout from "@/components/Layouts/AppLayout"
import Pix from "@/components/Pix"
import Bill from "@/components/Bill"
import Head from "next/head"
import { useState } from "react"
import {BsXDiamondFill, BsFillCreditCard2BackFill, BsUpc} from "react-icons/bs";

const Deposit = () => {

    const [method, setMethod] = useState('')
    const [amount, setAmount] = useState(0)

    const validated = (m) => {
        return (method == m && amount >= 30 && amount <= 1000)
    }
    
    return(
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Realizar Deposito
                </h2>
            }>
            <Head>
                <title>Realizar Deposito</title>
                <script src={process.env.NEXT_PUBLIC_SDK_MP}></script>
            </Head>

            <div className="py-9">
                <div className="sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="font-bold text-center text-xl">Informe o valor e selecione a forma de deposito:</h2>
                            <div className="my-5 text-center">
                                <Input
                                    type="number"
                                    min="30"
                                    max="1000"
                                    id="form-checkout__transactionAmount"
                                    name="transactionAmount"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    required />
                                <span className="block mt-5">Mínino R$ 30,00 e máximo R$ 1.000,00</span>
                            </div>
                            <div className="my-5 text-center">
                                <button
                                    className={`disabled:opacity-[0.5] text-5xl border rounded p-2 ${ method == 'pix' ? 'border-lime-500' : '' }`}
                                    onClick={() => setMethod('pix')}
                                    title="Pix"
                                    disabled={amount < 30 || amount > 1000}>
                                    <BsXDiamondFill />
                                </button>

                                <button
                                    className={`disabled:opacity-[0.5] text-5xl border rounded p-2 mx-5 ${ method == 'credit' ? 'border-lime-500' : '' }`}
                                    onClick={() => setMethod('credit')}
                                    title="Cartão"
                                    disabled={amount < 30 || amount > 1000}>
                                    <BsFillCreditCard2BackFill />
                                </button>

                                <button
                                    className={`disabled:opacity-[0.5] text-5xl border rounded p-2 ${ method == 'bill' ? 'border-lime-500' : '' }`}
                                    onClick={() => setMethod('bill')}
                                    title="Boleto"
                                    disabled={amount < 30 || amount > 1000}>
                                    <BsUpc />
                                </button>
                            </div>
                            { validated('pix') && <Pix amount={amount} clearAmount={() => {setAmount(0); setMethod('')}} />}
                            { validated('credit') && <Credit amount={amount} clearAmount={() => {setAmount(0); setMethod('')}} />}
                            { validated('bill') && <Bill amount={amount} clearAmount={() => {setAmount(0); setMethod('')}} />}
                        </div>
                    </div>
                </div>
            </div>
                        
        </AppLayout>
    )
}

export default Deposit