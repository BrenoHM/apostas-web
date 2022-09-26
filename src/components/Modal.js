import { useState } from "react";
import Button from "./Button";
import Head from "next/head";
import Input from "./Input";
import axios from "@/lib/axios";
import InputError from "./InputError";

const Modal = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showLoadingForm, setShowLoadingForm] = useState(true);
  const [value, setValue] = useState(0);
  const [showError, setShowError] = useState(false);

  const payment = () => {
    if( !value ) {
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
        value : value,
        result: JSON.stringify(data),
        status: data.status
      }
      const result = await axios.post('/api/deposit', body);
      if( result.data.success ) {
        alert('Pagamento realizado com sucesso!')
      }
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
          // callback chamado quando o Brick estiver pronto
        },
        onSubmit: (cardFormData) => {
          // callback chamado o usuário clicar no botão de submissão dos dados
          // ejemplo de envío de los datos recolectados por el Brick a su servidor
          return new Promise((resolve, reject) => {
              axios.post("/process_payment", cardFormData)
              .then((response) => {
                  // if(response.data.status == 'approved'){
                  //   alert('Pagamento realizado com sucesso')
                  //   //window.location.href = window.location.href
                  // }else{
                  //   alert(response.data.status)
                  // }
                  saveDeposit(response.data)
                  // receber o resultado do pagamento
                  resolve(response);
              })
              .catch((error) => {
                  // lidar com a resposta de erro ao tentar criar o pagamento
                  alert('Erro ao processar o pagamento!')
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
        <script src="https://sdk.mercadopago.com/js/v2"></script>
      </Head>
      <Button type="button" className="mr-2" onClick={() => setShowModal(true)}>Depositar</Button>

      {showModal ? (
        <>
          <div className="w-full flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
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
        <div className="w-full flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
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