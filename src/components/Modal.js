import { useState, useContext } from "react"
import Button from "./Button"
import Head from "next/head"
import Input from "./Input"
import axios from "@/lib/axios"
import InputError from "./InputError"
import Swal from 'sweetalert2'
import { LoadingContext } from "@/contexts/LoadingContext"

const Modal = () => {
  const {setShowLoading} = useContext(LoadingContext)
  const [showModal, setShowModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showLoadingForm, setShowLoadingForm] = useState(true);
  const [value, setValue] = useState(0);
  const [showError, setShowError] = useState(false);

  const payment = () => {
    if( !value || value <= 0 ) {
      setShowError(true)
      return
    }
    const mp = new MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);
    const bricksBuilder = mp.bricks();
    setShowModal(false)
    setShowPayment(true)
    renderCardPaymentBrick(bricksBuilder);
  }

  const saveDeposit = async (data) => {
    try {
      const body = {
        gateway_id: data.id,
        value : value,
        method: 'credit',
        result: JSON.stringify(data),
        status: data.status
      }
      const result = await axios.post('/api/deposit', body);
      setValue(0)
      setShowPayment(false)
    } catch (error) {
      console.log(error)
    }
  }

  const renderCardPaymentBrick = async (bricksBuilder) => {

    const settings = {
      initialization: {
        amount: value, //valor do processamento a ser realizado
      },
      customization: {
        paymentMethods: {
            maxInstallments: 1
        },
      },
      callbacks: {
        onReady: () => {
          console.log('brick ready')
        },
        onSubmit: (cardFormData) => {
          // callback chamado o usuário clicar no botão de submissão dos dados
          // ejemplo de envío de los datos recolectados por el Brick a su servidor
          setShowLoading(true)
          return new Promise((resolve, reject) => {
              axios.post("/process_payment", cardFormData)
              .then((response) => {
                  
                setShowLoading(false)
                if(response.data.status == 'approved'){
                    Swal.fire(
                      '',
                      'Seu pagamento foi aprovado!',
                      'success'
                    )
                  }else{
                    var message = "";
                    switch(response.data.status_detail){
                      case 'cc_rejected_other_reason':
                        message = "Pagamento foi recusado por erro geral!"
                        break
                      case 'pending_contingency':
                        message = "Pagamento está pendente!"
                        break
                      case 'cc_rejected_call_for_authorize':
                        message = "Pagamento recusado com validação para autorizar!"
                        break
                      case 'cc_rejected_insufficient_amount':
                        message = "Pagamento recusado por quantia insuficiente!"
                      case 'cc_rejected_bad_filled_security_code':
                        message = "Pagamento recusado por código de segurança inválido!"
                      case 'cc_rejected_bad_filled_date':
                        message = "Pagamento recusado por problema com a data de vencimento!"
                      case 'cc_rejected_bad_filled_other':
                        message = "Pagamento recusado por erro no formulário!"
                    }

                    Swal.fire(
                      'Opss!!!',
                      message,
                      'error'
                    )
                  }

                  //salva de qualquer forma
                  saveDeposit(response.data)
                  // receber o resultado do pagamento
                  resolve(response);
              })
              .catch((error) => {
                  setShowLoading(false)
                  // lidar com a resposta de erro ao tentar criar o pagamento
                  Swal.fire('Opss!!!','Erro ao processar o pagamento!','info')
                  reject(error);
              })
            });
        },
        onError: (error) => { 
          // callback chamado para todos os casos de erro do Brick
          alert(JSON.stringify(error))
        },
      },
    };
    const cardPaymentBrickController = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
    setShowLoadingForm(false)
  };

  return (
    <>
      <Head>
        <script src={process.env.NEXT_PUBLIC_SDK_MP}></script>
      </Head>
      <Button type="button" className="mr-2" onClick={() => setShowModal(true)}>Depositar</Button>

      {showModal ? (
        <>
          <div className="w-full flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-5">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">Depositar</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => {
                      setValue(0)
                      setShowError(false)
                      setShowModal(false)
                    }}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 rounded-full">
                      x
                    </span>
                  </button>
                </div>

                {showError && <InputError messages={['Informe um valor para o depósito']} className="mt-5" />}

                <Input
                  type="number"
                  placeholder="Valor do deposito"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="mt-5"
                  autoFocus
                  min="0"
                />
                  
                <Button
                  className="!inline-block mt-5"
                  type="button"
                  onClick={() => payment()}
                >
                  Depositar
                </Button>
                
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showPayment ? (
        <>
        <div className="w-full flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">Depositar</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => {
                      setValue(0)
                      setShowError(false)
                      setShowPayment(false)
                    }}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>

                <div id="cardPaymentBrick_container">
                  { showLoadingForm && <p className="p-5">Carregando...</p> }
                </div>
                
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;