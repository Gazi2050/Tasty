import { RiCopperCoinLine } from 'react-icons/ri';
import toast, { Toaster } from 'react-hot-toast';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import { useContext } from 'react';
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate } from 'react-router-dom';

const PurchaseCoin = () => {
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate()
    const handlePurchase = async (coins, dollars) => {
        try {
            const purchaseData = {
                coins,
                dollars,
                email: user?.email
            };

            const response = await axiosPublic.post('/coin', [purchaseData]);

            if (response.data.success) {
                toast.success('Purchase successful!');
                navigate('/payment')
            } else {
                toast.error('Failed to process the purchase.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center py-8">
            <Toaster />
            <div className="flex justify-center items-center space-x-2">
                <h1 className="text-center font-bold text-2xl sm:text-3xl lg:text-4xl py-4 text-orange-500">
                    Purchase Coin
                </h1>
                <span className="text-2xl sm:text-3xl lg:text-4xl text-orange-500">
                    <RiCopperCoinLine />
                </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
                <div className="card w-full sm:w-80 bg-orange-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">100 Coins</h2>
                        <p className="text-lg font-semibold">$1.00</p>
                        <div className="card-actions justify-end">
                            <button
                                className="btn btn-primary"
                                onClick={() => handlePurchase(100, 1)}
                            >
                                Purchase
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card w-full sm:w-80 bg-orange-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">500 Coins</h2>
                        <p className="text-lg font-semibold">$5.00</p>
                        <div className="card-actions justify-end">
                            <button
                                className="btn btn-primary"
                                onClick={() => handlePurchase(500, 5)}
                            >
                                Purchase
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card w-full sm:w-80 bg-orange-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">1000 Coins</h2>
                        <p className="text-lg font-semibold">$10.00</p>
                        <div className="card-actions justify-end">
                            <button
                                className="btn btn-primary"
                                onClick={() => handlePurchase(1000, 10)}
                            >
                                Purchase
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCoin;
