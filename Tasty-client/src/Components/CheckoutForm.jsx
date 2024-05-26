import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import usePurchase from "../Hooks/usePurchase";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CheckoutForm = () => {
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('')
    const [transactionId, setTransactionId] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [purchase, refetch] = usePurchase();
    const navigate = useNavigate();


    const totalFee = purchase.dollars;
    const coin = purchase.coins
    useEffect(() => {
        if (totalFee > 0) {
            axiosSecure.post('/create-payment-intent', { fee: totalFee })
                .then(res => {
                    console.log(res.data.clientSecret);
                    setClientSecret(res.data.clientSecret);
                })
        }

    }, [axiosSecure, totalFee])


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return
        }
        const card = elements.getElement(CardElement)

        if (card === null) {
            return
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            console.log('payment error', error);
            setError(error.message);
        }
        else {
            console.log('payment method', paymentMethod)
            setError('');
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        })

        if (confirmError) {
            console.log('confirm error')
        }

        else {
            if (paymentIntent.status === 'succeeded') {
                setTransactionId(paymentIntent.id);
                const payment = {
                    email: user.email,
                    fee: totalFee,
                    coin: coin,
                    transactionId: paymentIntent.id,
                }

                const res = await axiosSecure.post('/payments', payment);
                if (res.data?.paymentResult?.insertedId) {
                    Swal.fire({
                        title: "Payment Successful",
                        text: "You have successfully paid the  fee.",
                        icon: "success"
                    });
                    refetch();
                    navigate('/allRecipes')
                    window.location.reload()
                }

            }
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            <button type="submit" disabled={!stripe || !clientSecret} className="btn btn-sm md:btn-md lg:btn-md text-white bg-orange-600 hover:text-orange-600 hover:bg-white mt-5">
                Pay
            </button>
            <p className="text-red-600 text-center font-semibold">{error}</p>
            {transactionId && <p className="text-green-600 text-center font-semibold"> Your transaction id: <span className="text-violet-600">{transactionId}</span></p>}
        </form>
    );
};

export default CheckoutForm;