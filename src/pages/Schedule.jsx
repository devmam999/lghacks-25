import React from 'react';
import { useLocation } from 'react-router-dom';

const Schedule = () => {
    const location = useLocation();
    const { tasks, timeRestriction, schedule } = location.state || { tasks: [], timeRestriction: '', schedule: [] };

    return (
        <div className="min-h-screen w-full p-4 bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
            <div className="max-w-6xl mx-auto flex-1">
                <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
                    Your Schedule for Today
                </h1>

                {timeRestriction && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Time Restrictions</h2>
                        <p className="p-4 rounded-lg shadow-sm bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100">
                            ⚠️ {timeRestriction}
                        </p>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Schedule</h2>
                    <ul className="space-y-6">
    {schedule.map((item, index) => (
        <li
            key={index}
            className="p-6 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
        >
            <div className="flex justify-between items-center">
                <div>
                    <span className="font-semibold">{item.task}</span> - <span className="text-gray-600 dark:text-gray-400">{item.time}</span>
                </div>
                <span className={`text-${item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'yellow' : 'green'}-500`}>
                    Priority: {item.priority}
                </span>
            </div>
        </li>
    ))}
</ul>
                </div>
            </div>

            {/* "Start Now" Button */}
            <div className="flex justify-center mt-8 mb-8">
                <button
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => {
                        // Functionality to be added later
                        console.log('Start Now clicked');
                    }}
                >
                    Start Now
                </button>
            </div>
        </div>
    );
};

export default Schedule;