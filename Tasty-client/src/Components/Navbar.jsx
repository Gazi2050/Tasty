import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import { RiCopperCoinLine } from "react-icons/ri";
import Swal from "sweetalert2";
const Navbar = () => {

    const { user, googleSignIn, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const axiosPublic = useAxiosPublic();
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        if (user?.email) {
            const url = `https://tasty-server.vercel.app/allUsers/${user.email}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setUserInfo(data);
                    }
                });
        }
    }, [user]);

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                const googleUser = result.user;
                console.log(googleUser);
                const userInfo = {
                    displayName: googleUser?.displayName,
                    photoURL: googleUser?.photoURL,
                    email: googleUser?.email,
                    coin: parseInt(50, 10)
                };
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        if (res.data.insertedId === null) {
                            Swal.fire({
                                title: 'Welcome Back!',
                                text: `Logged in as ${googleUser.email}.`,
                                icon: 'success',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                window.location.reload();
                                navigate(from, { replace: true });
                            });
                        } else {
                            Swal.fire({
                                title: 'Success!',
                                text: `Logged in as ${googleUser.email}. Congratulations on earning 50 coins!`,
                                icon: 'success',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                window.location.reload();
                                navigate(from, { replace: true });
                            });
                        }
                    });
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                toast.error(errorMessage);
            });
    };





    const handleLogOut = () => {
        logOut()
            .then(result => {
                toast.success("User LogOut Successfully")
                console.log(result)
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message;
                console.log(errorCode);
                toast.error(errorMessage)

            });
    }

    return (
        <div>
            <div className="navbar bg-gray-300">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 font-semibold">
                            <li><NavLink to={'/'}>Home </NavLink></li>
                            <li><NavLink to={'/allRecipes'}>Recipes </NavLink></li>
                            {user ?
                                (<>
                                    <li><NavLink to={'/addRecipe'}>Add-recipes</NavLink></li>
                                    <button onClick={handleLogOut} type="button" className="block lg:hidden md:hidden btn btn-sm border-2 text-lg hover:bg-orange-100">LogOut</button>
                                </>)
                                :
                                (null)}
                        </ul>
                    </div>
                    <Link to={'/'} className="btn btn-ghost text-3xl font-bold text-orange-600">Tasty</Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-lg font-semibold space-x-1">
                        <li><NavLink to={'/'}>Home </NavLink></li>
                        <li><NavLink to={'/allRecipes'}>Recipes </NavLink></li>
                        {user ?
                            (<li><NavLink to={'/addRecipe'}>Add-recipes</NavLink></li>)
                            :
                            (null)
                        }
                    </ul>
                </div>
                <div className="navbar-end">
                    {user ?
                        (<div className="flex justify-center items-center space-x-3">
                            <div className="flex justify-center items-center space-x-1">
                                <RiCopperCoinLine className="text-3xl text-orange-600" />
                                <p className="text-black text-lg font-bold">{userInfo.coin}</p>
                            </div>
                            <div className="avatar">
                                <div className="w-12 lg:w-16 rounded-full border-2 border-orange-600">
                                    <img src={user.photoURL} />
                                </div>
                            </div>
                            <div>
                                <button onClick={handleLogOut} type="button" className="hidden lg:block md:block btn btn-sm border-2 text-lg hover:bg-orange-100">LogOut</button>
                            </div>
                        </div>)
                        :
                        (<button onClick={handleGoogleSignIn} type="button" className="btn border-2 text-lg hover:bg-orange-100"><FcGoogle className="text-2xl" />LogIn</button>)
                    }
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default Navbar;