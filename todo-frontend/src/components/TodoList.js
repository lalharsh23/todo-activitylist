import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TodoList = () => {
  const [activities, setActivities] = useState([]);
  const [name, setName] = useState("");
  const [activeActivityId, setActiveActivityId] = useState(null);

  const timerRef = useRef(null);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("https://todo-activitylist.onrender.com/api/activities", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setActivities(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    if (activeActivityId !== null) {
      timerRef.current = setInterval(() => {
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity._id === activeActivityId
              ? { ...activity, duration: activity.duration + 1 }
              : activity
          )
        );
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [activeActivityId]);
  const addActivity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://todo-activitylist.onrender.com/api/activities",
        { name },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setActivities([...activities, res.data]);
      setName("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAction = async (id, action) => {
    try {
      // Find the activity by id
      const activity = activities.find((activity) => activity._id === id);
      console.log("act", activity);
      let durn = activity.duration;

      if (action === "Pause" || action === "End") {
        // Call the duration update API
        await axios.put(
          `https://todo-activitylist.onrender.com/api/activities/${id}/duration`,
          { duration: durn },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Update the activity in the local state
        setActivities(
          activities.map((activity) =>
            activity._id === id ? { ...activity, duration: durn } : activity
          )
        );
      }
      const res = await axios.put(
        `https://todo-activitylist.onrender.com/api/activities/${id}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setActivities(
        activities.map((activity) =>
          activity._id === id ? res.data : activity
        )
      );

      if (action === "Start" || action === "Resume") {
        if (activeActivityId !== null && activeActivityId !== id) {
          await handleAction(activeActivityId, "Pause");
        }
        setActiveActivityId(id);
      } else if (action === "Pause" || action === "End") {
        setActiveActivityId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="flex justify-between font-bold text-xl">
        <p className="pl-3 text-4xl">ToDo App</p>
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="mt-2 mr-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <form
          onSubmit={addActivity}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6"
        >
          <h2 className="text-2xl font-bold mb-4">Add New Activity</h2>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New Activity"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Add
          </button>
        </form>
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">S.NO</th>
                <th className="py-3 px-6 text-left">Activity Name</th>
                <th className="py-3 px-6 text-left">Activity Duration</th>
                <th className="py-3 px-6 text-left">Actions</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {activities.map((activity, index) => (
                <tr
                  key={activity._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-3 px-6 text-left">{activity.name}</td>
                  <td className="py-3 px-6 text-left">
                    {formatDuration(activity.duration)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {activity.status !== "Completed" ? (
                      <>
                        {activity.status === "Pending" && (
                          <button
                            onClick={() => handleAction(activity._id, "Start")}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                          >
                            Start
                          </button>
                        )}
                        {activity.status === "Ongoing" && (
                          <>
                            <button
                              onClick={() =>
                                handleAction(activity._id, "Pause")
                              }
                              className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300 mr-2"
                            >
                              Pause
                            </button>
                            <button
                              onClick={() => handleAction(activity._id, "End")}
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                            >
                              End
                            </button>
                          </>
                        )}
                        {activity.status === "Paused" && (
                          <button
                            onClick={() => handleAction(activity._id, "Resume")}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300"
                          >
                            Resume
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          alert(JSON.stringify(activity.logs, null, 2))
                        }
                        className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition duration-300"
                      >
                        Show Details
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-6 text-left">{activity.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default TodoList;
