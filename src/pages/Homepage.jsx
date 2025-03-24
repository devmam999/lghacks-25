import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Popup Component
const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <p className="text-gray-900 dark:text-white mb-4">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg focus:outline-none hover:scale-105 transition-all duration-300 cursor-pointer"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-green-600 focus:outline-none hover:scale-105 transition-all duration-300 cursor-pointer"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

const Homepage = () => {
    const [task, setTask] = useState('');
    const [time, setTime] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [priority, setPriority] = useState('Medium'); // Default priority
    const [timeRestriction, setTimeRestriction] = useState('');
    const [tasks, setTasks] = useState([]);
    const [timeError, setTimeError] = useState('');
    const [preferredTimeError, setPreferredTimeError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const navigate = useNavigate();

    const validateTimeRange = (input) => {
        const timeRangeRegex = /^\d+\s*(hours?|minutes?)$/i;
        return timeRangeRegex.test(input);
    };

    const validateTimeFormat = (input) => {
        const timeFormatRegex = /^(Morning|Afternoon|Evening|Night|\d{1,2}:\d{2}\s?(AM|PM)|(\d{1,2}\s?(AM|PM)))$/i;
        return timeFormatRegex.test(input);
    };

    const handleAddTask = () => {
        const isTimeValid = validateTimeRange(time);
        const isPreferredTimeValid = preferredTime ? validateTimeFormat(preferredTime) : true;

        if (!isTimeValid) {
            setTimeError('Please enter a valid time range (e.g., 2 hours or 30 minutes).');
            return;
        } else {
            setTimeError('');
        }

        if (!isPreferredTimeValid) {
            setPreferredTimeError('Please enter a valid preferred time (e.g., 8 AM, 8:45 AM, or Morning).');
            return;
        } else {
            setPreferredTimeError('');
        }

        if (task.trim() && time.trim()) {
            setTasks([...tasks, { task, time, preferredTime, priority }]);
            setTask('');
            setTime('');
            setPreferredTime('');
            setPriority('Medium'); // Reset priority to default
        } else {
            alert('Please enter both a task and the time needed!');
        }
    };

    const handleFinish = () => {
        setShowConfirmation(true);
    };

    const confirmFinish = () => {
        setShowConfirmation(false);

        // Generate schedule
        const schedule = generateSchedule(tasks, timeRestriction);

        // Redirect to schedule page with the generated schedule
        navigate('/schedule', {
            state: { tasks, timeRestriction, schedule },
        });
    };

    const generateSchedule = (tasks, timeRestriction) => {
        const timeSlots = [];
        const startTime = 9 * 60; // Start at 9:00 AM (in minutes)
        let endTime = 18 * 60; // Default end time at 6:00 PM (in minutes)
    
        // Parse time restriction (e.g., "No tasks after 6 PM")
        if (timeRestriction) {
            const restrictionMatch = timeRestriction.match(/no tasks after (\d{1,2}(:\d{2})?\s?(AM|PM)?)/i);
            if (restrictionMatch) {
                const restrictedTime = restrictionMatch[1];
                endTime = convertTimeToMinutes(restrictedTime);
            }
        }
    
        const bufferTime = 30; // 30-minute buffer between tasks
        let currentTime = startTime;
    
        // Convert tasks to minutes and add priority weight
        const tasksInMinutes = tasks.map((taskItem) => {
            const duration = parseInt(taskItem.time);
            return {
                ...taskItem,
                duration: taskItem.time.includes('hour') ? duration * 60 : duration,
                priorityWeight: taskItem.priority === 'High' ? 3 : taskItem.priority === 'Medium' ? 2 : 1,
            };
        });
    
        // Sort tasks by priority (High first)
        tasksInMinutes.sort((a, b) => b.priorityWeight - a.priorityWeight);
    
        // Allocate tasks to time slots
        for (const taskItem of tasksInMinutes) {
            let taskStartTime = currentTime;
    
            // If preferred time is provided, try to allocate the task to the preferred time
            if (taskItem.preferredTime) {
                const preferredTimeInMinutes = convertTimeToMinutes(taskItem.preferredTime);
                if (
                    preferredTimeInMinutes >= currentTime && // Preferred time is after the current time
                    preferredTimeInMinutes + taskItem.duration <= endTime // Task fits within the restricted time
                ) {
                    taskStartTime = preferredTimeInMinutes;
                }
            }
    
            // Ensure the task fits within the time restrictions
            if (taskStartTime + taskItem.duration <= endTime) {
                timeSlots.push({
                    task: taskItem.task,
                    start: taskStartTime,
                    end: taskStartTime + taskItem.duration,
                    priority: taskItem.priority, // Use the user-assigned priority
                });
                currentTime = taskStartTime + taskItem.duration + bufferTime; // Add buffer time
            } else {
                // If the task cannot be scheduled, skip it and show a warning
                console.warn(`Task "${taskItem.task}" cannot be scheduled within the available time.`);
            }
        }
    
        // Convert time slots to readable format
        const formattedSchedule = timeSlots.map((slot) => {
            const startHour = Math.floor(slot.start / 60);
            const startMinute = slot.start % 60;
            const endHour = Math.floor(slot.end / 60);
            const endMinute = slot.end % 60;
            return {
                task: slot.task,
                time: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
                priority: slot.priority, // Include priority in the schedule
            };
        });
    
        return formattedSchedule;
    };

    const convertTimeToMinutes = (time) => {
        const timeRegex = /(\d{1,2}):(\d{2})\s?(AM|PM)?/i;
        const match = time.match(timeRegex);

        if (match) {
            let hour = parseInt(match[1]);
            const minute = parseInt(match[2]);
            const period = match[3]?.toUpperCase();

            if (period === 'PM' && hour !== 12) {
                hour += 12;
            } else if (period === 'AM' && hour === 12) {
                hour = 0;
            }

            return hour * 60 + minute;
        }

        return 0; // Default to 0 if time is invalid
    };

    const cancelFinish = () => {
        setShowConfirmation(false);
    };

    const handleDeleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    return (
        <div className="min-h-screen w-full">
            <div className="flex flex-col items-center justify-start min-h-screen w-full p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="font-bold text-[48px] mt-8 text-gray-900 dark:text-white">
                    LockedIn: Your ultimate planner
                </div>

                <div className="font-bold text-[16px] mt-16 text-center max-w-2xl text-gray-700 dark:text-gray-300">
                    This website helps you plan your day effectively and eliminates procrastination with the Pomodoro Technique.
                </div>

                <div className="flex w-full max-w-6xl mt-16">
                    <div className="w-1/2 pr-8 border-r border-gray-300 dark:border-gray-700">
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

                        <div>
                            <label htmlFor="taskInput" className="block text-lg font-medium mb-4 text-gray-900 dark:text-white">
                                What are your tasks for today?
                            </label>

                            <input
                                type="text"
                                id="taskInput"
                                placeholder="Enter your task..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                            />

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

                            <div className="mb-4">
    <select
        id="priorityInput"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-pointer"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
    >
        <option value="High" style={{ color: 'red' }}>High Priority</option>
        <option value="Medium" style={{ color: 'orange' }}>Medium Priority</option>
        <option value="Low" style={{ color: 'green' }}>Low Priority</option>
    </select>
</div>

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

                            <div className="flex justify-center space-x-4">
                                <button
                                    className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-all duration-300 hover:scale-105 cursor-pointer"
                                    onClick={handleAddTask}
                                >
                                    Add Task
                                </button>

                                <button
                                    className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-green-600 focus:outline-none transition-all duration-300 hover:scale-105 cursor-pointer"
                                    onClick={handleFinish}
                                >
                                    Finish Adding Tasks
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 pl-8">
                        {timeRestriction && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Time Restrictions</h2>
                                <p className="p-4 rounded-lg shadow-sm bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100">
                                    ⚠️ {timeRestriction}
                                </p>
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Tasks for Today</h2>
                            {tasks.length > 0 ? (
                                <ul className="space-y-4">
                                    {tasks.map((taskItem, index) => (
                                        <li
                                            key={index}
                                            className="group p-4 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-white flex justify-between items-center"
                                        >
                                            <div>
                                                <span className="font-semibold">{taskItem.task}</span> - <span className="text-gray-600 dark:text-gray-400">{taskItem.time}</span>
                                                {taskItem.preferredTime && (
                                                    <span className="text-gray-600 dark:text-gray-400"> (Preferred: {taskItem.preferredTime})</span>
                                                )}
                                                <span className={`text-${taskItem.priority === 'High' ? 'red' : taskItem.priority === 'Medium' ? 'yellow' : 'green'}-500`}>
                                                    - Priority: {taskItem.priority}
                                                </span>
                                            </div>
                                            <button
                                                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-600 p-0 bg-transparent border-none cursor-pointer"
                                                onClick={() => handleDeleteTask(index)}
                                            >
                                                ×
                                            </button>
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

            {showConfirmation && (
                <ConfirmationPopup
                    message="Are you sure you want to finish and generate a schedule?"
                    onConfirm={confirmFinish}
                    onCancel={cancelFinish}
                />
            )}
        </div>
    );
};

export default Homepage;