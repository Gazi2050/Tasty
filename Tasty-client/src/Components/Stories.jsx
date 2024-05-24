import { useEffect, useState } from "react";
import CountUp from 'react-countup';

const Stories = () => {

    const [stories, setStories] = useState([]);

    useEffect(() => {
        fetch('stories.json')
            .then(res => res.json())
            .then(data => {
                setStories(data);
            });
    }, []);

    return (
        <div className="bg-black py-10 px-5">
            <div className="space-y-2">
                <h1 className="text-center text-2xl  lg:text-3xl font-bold text-orange-600">Success Stories</h1>
                <p className="text-center text-sm font-medium text-white">Discover how our platform inspires culinary enthusiasts worldwide. Hear from our users as they share their kitchen adventures and culinary triumphs.</p>
            </div>
            <div className="lg:p-10 mt-5 lg:mt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stories.map(story => <div key={story.id}>
                    <div className="w-full px-8 py-4 mt-14 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                        <div className="flex justify-center -mt-16 md:justify-end">
                            <img className="object-cover w-20 h-20 border-2 border-orange-600 rounded-full dark:border-blue-400" alt="Testimonial avatar" src={story.image} />
                        </div>

                        <h2 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white md:mt-0">{story.title}</h2>

                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">{story.testimonial}</p>

                        <div className="flex justify-end mt-4">
                            <p className="text-lg font-medium text-orange-600 dark:text-blue-300" role="link">{story.user}</p>
                        </div>
                        <div className="flex justify-end">
                            <p className="text-sm text-slate-400 ">{story.location}</p>
                        </div>
                    </div>
                </div>)

                }
            </div>
            <div className="flex justify-center items-center mt-8">
                <div>
                    <p className="text-center text-white font-medium text-6xl"><CountUp end={900} duration={5} /></p>
                    <p className="text-center font-medium text-xl text-orange-600">Recipes</p>
                </div>
                <div className="divider divider-horizontal divider-primary"></div>
                <div>
                    <p className="text-center text-white font-medium text-6xl"><CountUp end={100} duration={5} /></p>
                    <p className="text-center font-medium text-xl text-orange-600">Users</p>
                </div>
            </div>
        </div>
    );
};

export default Stories;