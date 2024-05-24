import { useState, useEffect } from 'react';
import img from '../assets/IMG-7053.jpg';

const DevInfo = () => {
    const [info, setInfo] = useState({});

    useEffect(() => {
        fetch('info.json')
            .then(res => res.json())
            .then(data => {
                setInfo(data);
            });
    }, []);

    return (
        <div>
            <section className="bg-gray-900 text-white py-10">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-semibold text-orange-600 text-center mb-8">About the Developer</h1>

                    <div className="flex flex-col lg:flex-row items-center lg:items-start">
                        <img className="object-cover w-full lg:mx-6 lg:w-[25%] rounded-xl h-72 lg:h-96" src={img} alt="img" />

                        <div className="lg:w-3/4">
                            <p className="text-lg text-orange-500 font-semibold mb-2">
                                Name : <span>{info.name}</span>
                            </p>
                            <p className="text-sm text-gray-300 mb-2">
                                Date of Birth : {info.date_of_birth}
                            </p>

                            <p className="text-sm text-gray-300 mb-2">
                                Address : {info.address?.street}, {info.address?.post_office}, {info.address?.police_station}, {info.address?.city}, {info.address?.country}
                            </p>

                            <p className="text-sm text-gray-300 mb-2">
                                Email : {info.contact?.email}
                            </p>

                            <p className="text-sm text-gray-300 mb-2">
                                Mobile : {info.contact?.mobile}
                            </p>

                            <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
                                <a href={info.portfolio_website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-400 mb-2 md:mb-0">Portfolio Website</a>
                                <a href={info.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-400 mb-2 md:mb-0">GitHub</a>
                                <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-400">LinkedIn</a>
                            </div>


                            <div className="mt-6">
                                <h2 className="text-xl text-white mb-4">Education :</h2>
                                {info.education?.map((edu, index) => (
                                    <div key={index} className="mb-4">
                                        <p className="text-lg text-orange-500 font-semibold">{edu.degree}</p>
                                        <p className="text-sm text-gray-300">{edu.institution}</p>
                                        <p className="text-sm text-gray-300">{edu.address}</p>
                                        <p className="text-sm text-gray-300">GPA: {edu.gpa ? edu.gpa : '(Ongoing)'}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="my-6">
                                <h2 className="text-xl text-white mb-4">Skills :</h2>
                                <ul className="list-disc list-inside text-sm text-gray-300">
                                    {info.skills?.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-lg text-orange-500 font-semibold mb-2">
                                Experience : <span className='text-white text-sm font-normal'>{info.experience}</span>
                            </p>
                            <p className="text-lg text-orange-500 font-semibold mb-2">
                                References : <span className='text-white text-sm font-normal'>{info.references}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DevInfo;
