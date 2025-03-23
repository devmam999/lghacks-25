import React, { useState } from 'react';

const Homepage = () => {
    // State to manage the task input
    const [task, setTask] = useState('');
    const [time, setTime] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [timeRestriction, setTimeRestriction] = useState('');
    const [tasks, setTasks] = useState([]);

    // State to manage validation errors
    const [timeError, setTimeError] = useState('');
    const [preferredTimeError, setPreferredTimeError] = useState('');

    // Function to validate time range (e.g., 2 hours, 30 minutes)
    const validateTimeRange = (input) => {
        const timeRangeRegex = /^\d+\s*(hours?|minutes?)$/i;
        return timeRangeRegex.test(input);
    };

    // Function to validate time format (e.g., 8 AM, Morning)
    const validateTimeFormat = (input) => {
        const timeFormatRegex = /^(Morning|Afternoon|Evening|Night|\d{1,2}\s?(AM|PM))$/i;
        return timeFormatRegex.test(input);
    };

    // Function to handle adding a task
    const handleAddTask = () => {
        // Validate time inputs
        const isTimeValid = validateTimeRange(time);
        const isPreferredTimeValid = preferredTime ? validateTimeFormat(preferredTime) : true;

        if (!isTimeValid) {
            setTimeError('Please enter a valid time range (e.g., 2 hours or 30 minutes).');
            return;
        } else {
            setTimeError('');
        }

        if (!isPreferredTimeValid) {
            setPreferredTimeError('Please enter a valid preferred time (e.g., 8 AM or Morning).');
            return;
        } else {
            setPreferredTimeError('');
        }

        if (task.trim() && time.trim()) {
            // Add the task to the list, including the preferred time if provided
            setTasks([...tasks, { task, time, preferredTime }]);
            // Clear the input fields
            setTask('');
            setTime('');
            setPreferredTime('');
        } else {
            alert('Please enter both a task and the time needed!');
        }
    };

    // Function to handle finishing tasks
    const handleFinish = () => {
        setTasks([]); // Clear all tasks
        alert('All tasks completed!');
    };

    return (
        <div className={`min-h-screen w-full`}>
            <div className="flex flex-col items-center justify-start min-h-screen w-full p-4 bg-white dark:bg-gray-900 transition-colors duration-300">

                {/* Header */}
                <div className="font-bold text-[48px] mt-8 text-gray-900 dark:text-white">
                    LockedIn: Your ultimate planner
                </div>

                {/* Subheader */}
                <div className="font-bold text-[16px] mt-16 text-center max-w-2xl text-gray-700 dark:text-gray-300">
                    This website helps you plan your day effectively and eliminates procrastination with the Pomodoro Technique.
                </div>

                {/* Main Content (Two Columns) */}
                <div className="flex w-full max-w-6xl mt-16">
                    {/* Left Column: Input Section */}
                    <div className="w-1/2 pr-8 border-r border-gray-300 dark:border-gray-700">
                        {/* Time Restriction Input (Overall) */}
                        <div className="mb-8">
                            <label htmlFor="timeRestrictionInput" className="block text-lg font-medium mb-4 text-gray-900 dark:text-white">
                                Do you have any time restrictions today? (Optional)
                            </label>
                            <input
                                type="text"
                                id="timeRestrictionInput"
                                placeholder="Enter time restrictions (e.g., No tasks after 6 PM)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={timeRestriction}
                                onChange={(e) => setTimeRestriction(e.target.value)}
                            />
                        </div>

                        {/* Task Input and Buttons */}
                        <div>
                            <label htmlFor="taskInput" className="block text-lg font-medium mb-4 text-gray-900 dark:text-white">
                                What are your tasks for today?
                            </label>

                            {/* Task Input */}
                            <input
                                type="text"
                                id="taskInput"
                                placeholder="Enter your task..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                            />

                            {/* Time Input */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="timeInput"
                                    placeholder="Time needed (e.g., 2 hours or 30 minutes)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                                {timeError && (
                                    <p className="text-red-500 text-sm mt-1">{timeError}</p>
                                )}
                            </div>

                            {/* Preferred Time Input (Optional) */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    id="preferredTimeInput"
                                    placeholder="Preferred time period (optional, e.g., Morning or 8 AM)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    value={preferredTime}
                                    onChange={(e) => setPreferredTime(e.target.value)}
                                />
                                {preferredTimeError && (
                                    <p className="text-red-500 text-sm mt-1">{preferredTimeError}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-center space-x-4">
                                {/* Add Task Button (Blue) */}
                                <button
                                    className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105"
                                    onClick={handleAddTask}
                                >
                                    Add Task
                                </button>

                                {/* Finish Button (Green) */}
                                <button
                                    className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 hover:scale-105"
                                    onClick={handleFinish}
                                >
                                    Finish Adding Tasks
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Task Display Section */}
                    <div className="w-1/2 pl-8">
                        {/* Display Time Restriction (Overall) */}
                        {timeRestriction && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Time Restrictions</h2>
                                <p className="p-4 rounded-lg shadow-sm bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100">
                                    ⚠️ {timeRestriction}
                                </p>
                            </div>
                        )}

                        {/* Display Tasks */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Tasks for Today</h2>
                            {tasks.length > 0 ? (
                                <ul className="space-y-4">
                                    {tasks.map((taskItem, index) => (
                                        <li key={index} className="p-4 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white">
                                            <span className="font-semibold">{taskItem.task}</span> - <span className="text-gray-600 dark:text-gray-400">{taskItem.time}</span>
                                            {taskItem.preferredTime && (
                                                <span className="text-gray-600 dark:text-gray-400"> (Preferred: {taskItem.preferredTime})</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No tasks added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage;