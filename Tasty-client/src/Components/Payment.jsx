import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const Payment = () => {
    const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

    return (
        <div className="min-h-screen">
            <div>
                <h1 className="text-orange-600 text-xl lg:text-4xl md:text-3xl text-center font-bold p-10">Payment</h1>
            </div>
            <div className="p-10">
                <Elements stripe={stripePromise}>
                    <CheckoutForm></CheckoutForm>
                </Elements>
            </div>
        </div>
    );
};

export default Payment;