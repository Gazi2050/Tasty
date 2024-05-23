
import { Link } from 'react-router-dom';

const ErrorElement = () => {
    return (
        <div className="h-screen flex justify-center items-center bg-black">
            <div>
                <div className="text-center text-orange-600">
                    <p className="text-8xl font-bold ">404</p>
                    <p className="text-2xl">Page Not Found</p>
                </div>
                <div className="space-x-5 flex justify-center items-center pt-3">
                    <Link to={'/'}>
                        <button className="btn btn-outline text-orange-600">Home</button>
                    </Link>
                    <Link to={-1}>
                        <button className="btn btn-outline text-orange-600">Back</button>
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default ErrorElement;