import React, { useState } from 'react';

const Homepage = () => {
    // State to manage the task input
    const [task, setTask] = useState('');
    // State to manage the time input
    const [time, setTime] = useState('');
    // State to manage the preferred time period input
    const [preferredTime, setPreferredTime] = useState('');
    // State to manage the overall time restriction
    const [timeRestriction, setTimeRestriction] = useState('');
    // State to store the list of tasks
    const [tasks, setTasks] = useState([]);

    // Function to handle adding a task
    const handleAddTask = () => {
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

                {/* Time Restriction Input (Overall) */}
                <div className="text-center mt-16 w-full max-w-2xl">
                    <label htmlFor="timeRestrictionInput" className="block text-lg font-medium mb-4 text-gray-900 dark:text-white">
                        Do you have any time restrictions today? (Optional)
                    </label>
                    <input
                        type="text"
                        id="timeRestrictionInput"
                        placeholder="Enter time restrictions (e.g., No tasks after 6 PM)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        value={timeRestriction}
                        onChange={(e) => setTimeRestriction(e.target.value)}
                    />
                </div>

                {/* Task Input and Buttons */}
                <div className="text-center mt-8 w-full max-w-2xl">
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
                    <input
                        type="text"
                        id="timeInput"
                        placeholder="Time needed (e.g., 2 hours)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />

                    {/* Preferred Time Input (Optional) */}
                    <input
                        type="text"
                        id="preferredTimeInput"
                        placeholder="Preferred time period (optional, e.g., Morning)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                    />

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

                {/* Display Time Restriction (Overall) */}
                {timeRestriction && (
                    <div className="mt-12 w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Time Restrictions</h2>
                        <p className="p-4 rounded-lg shadow-sm bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100">
                            ⚠️ {timeRestriction}
                        </p>
                    </div>
                )}

                {/* Display Tasks */}
                <div className="mt-12 w-full max-w-2xl">
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
    )
}

export default Homepage;