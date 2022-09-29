import Button from "@/components/Button"
import { LoadingContext } from "@/contexts/LoadingContext"
import axios from "@/lib/axios"
import { useState, useContext } from "react"
import Input from "./Input"
import {BsLock} from "react-icons/bs"

const Pix = ({amount, clearAmount}) => {

    const {setShowLoading} = useContext(LoadingContext);
    const [payerFirstName, setPayerFirstName] = useState(null)
    const [payerLastName, setPayerLastName] = useState(null)
    const [email, setEmail] = useState(null)
    const [identificationType, setIdentificationType] = useState('CPF')
    const [identificationNumber, setIdentificationNumber] = useState(null)
    const [description, setDescription] = useState('Deposito via pix.')

    const handleSubmit = async (e) => {
        setShowLoading(true);
        e.preventDefault()
        const data = {
            payerFirstName,
            payerLastName,
            email,
            identificationType,
            identificationNumber,
            transactionAmount: amount,
            description
        }

        const result = await axios.post('/process_payment_pix', data)
        if( result ) {
            setShowLoading(false);
            let a = document.createElement('a');
            a.target= '_blank';
            a.href= result.data.point_of_interaction.transaction_data.ticket_url;
            a.click();
        }
        saveDeposit(result.data)
    }

    const saveDeposit = async (data) => {
        try {
            const body = {
                gateway_id: data.id,
                value : amount,
                method: 'pix',
                result: JSON.stringify(data),
                status: data.status
            }
            const result = await axios.post('/api/deposit', body);
            clearAmount()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-5">
                <label className="inline-block" htmlFor="form-checkout__payerFirstName">Nome</label>
                <Input className="w-full" id="form-checkout__payerFirstName" name="payerFirstName" type="text" onChange={e => setPayerFirstName(e.target.value)} required />
            </div>
            <div className="mb-5">
                <label className="inline-block" htmlFor="form-checkout__payerLastName">Sobrenome</label>
                <Input className="w-full" id="form-checkout__payerLastName" name="payerLastName" type="text" onChange={e => setPayerLastName(e.target.value)} required />
            </div>
            <div className="mb-5">
                <label className="inline-block" htmlFor="form-checkout__email">E-mail</label>
                <Input className="w-full" id="form-checkout__email" name="email" type="email" onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-5">
                <label className="inline-block" htmlFor="form-checkout__identificationNumber">CPF</label>
                <Input className="w-full" id="form-checkout__identificationNumber" name="identificationNumber" type="text" onChange={e => setIdentificationNumber(e.target.value)} required />
            </div>

            <div className="mt-10">
                <Button className="!py-4 px-10 bg-[#009EE3]"><BsLock className="mr-2" /> Pagar com PIX</Button>
            </div>
        </form>
    )
}

export default Pix