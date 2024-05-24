

const AllRecipes = () => {
    return (
        <div className="bg-black text-white min-h-screen">
            <h1 className="text-center font-bold text-2xl py-2 text-orange-500">AllRecipes</h1>
            {/* search */}
            <div className="px-5">
                <div className="flex  p-2 overflow-hidden border border-orange-600 rounded-lg">
                    <input
                        className="px-6 py-2 text-white placeholder-gray-500 outline-none  focus:placeholder-transparent w-full bg-transparent"
                        type="text"
                        placeholder="Search here"
                        required
                    />
                    <div className="flex justify-center items-center">
                        <button type="submit" className="btn btn-sm border-2 text-lg hover:bg-orange-100">Search</button>
                    </div>
                </div>
            </div>
            {/* cards */}
            <div>

            </div>
        </div>
    );
};

export default AllRecipes;