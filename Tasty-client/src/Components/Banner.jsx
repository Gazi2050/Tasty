import { Link } from "react-router-dom";


const Banner = () => {
    return (
        <div>
            <div className="hero min-h-screen bg-fixed" style={{ backgroundImage: 'url(https://tinypic.host/images/2024/05/23/banner.jpg)' }}>
                <div className="hero-overlay bg-black bg-opacity-90"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">Discover <span className="text-orange-600">Delicious</span></h1>
                        <p className="mb-5">Dive into a world of culinary delight! Explore, share, and enjoy recipes from around the globe. Whether you're a seasoned chef or a kitchen newbie, there's something here for everyone.</p>
                        <div className="space-x-2">
                            <Link to={'/allRecipes'} className="btn bg-orange-600 text-white border-0 hover:bg-black hover:text-orange-600">See recipes </Link>
                            <Link to={'/addRecipes'} className="btn bg-orange-600 text-white border-0 hover:bg-black hover:text-orange-600">Add recipes</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;