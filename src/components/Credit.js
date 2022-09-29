import { useEffect, useState, useContext } from "react"
import { LoadingContext } from "@/contexts/LoadingContext"
import Swal from 'sweetalert2'
import axios from "@/lib/axios"

const Credit = ({amount, clearAmount}) => {

    const {setShowLoading} = useContext(LoadingContext)
    const [showLoadingForm, setShowLoadingForm] = useState(true)

    useEffect(() => {
        const mp = new MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);
        const bricksBuilder = mp.bricks();
        renderCardPaymentBrick(bricksBuilder);
    }, [])

    const saveDeposit = async (data) => {
        try {
          const body = {
            gateway_id: data.id,
            value : amount,
            method: 'credit',
            result: JSON.stringify(data),
            status: data.status
          }
          const result = await axios.post('/api/deposit', body);
          clearAmount()
        } catch (error) {
          console.log(error)
        }
    }
    
    const renderCardPaymentBrick = async (bricksBuilder) => {
    
        const settings = {
          initialization: {
            amount: amount, //valor do processamento a ser realizado
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
    }

    return(
        <div id="cardPaymentBrick_container">
            { showLoadingForm && <p className="p-5">Carregando...</p> }
        </div>
    )
}

export default Credit