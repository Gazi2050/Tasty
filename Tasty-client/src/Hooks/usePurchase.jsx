import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";


const useOrder = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { data: purchase = [], refetch, } = useQuery({
        queryKey: ['purchase', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/coin/${user.email}`);
            return res.data;
        }
    })

    return [purchase, refetch]
};

export default useOrder;