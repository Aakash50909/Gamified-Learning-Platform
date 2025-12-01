import React, { useState, useEffect } from "react";
import { ExternalLink, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const DSAPractice = () => {
    const { user, updateStats } = useAuth(); // We will use updateStats from AuthContext
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Problems on Load
    useEffect(() => {
        fetch(`${API_BASE_URL}/dsa/problems`)
            .then(res => res.json())
            .then(data => {
                setProblems(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    // 2. Handle Solve Click
    const handleSolve = async (problem) => {
        if (!user?.id) return alert("Please login first");

        // A. Open GFG Link in new tab
        window.open(problem.link, "_blank");

        // B. Call API to award points (Simulating verification)
        try {
            const res = await fetch(`${API_BASE_URL}/dsa/solve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, problemId: problem._id }),
            });

            const data = await res.json();

            if (data.success) {
                alert(`Correct! +${problem.points} Points`);
                // Update local context so Dashboard updates immediately
                updateStats({ dsaPoints: data.newPoints });
            }
        } catch (err) {
            console.error("Error solving:", err);
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Loading Problems...</div>;

    return (
        <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((prob) => (
                <div key={prob._id} className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-white">{prob.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${prob.difficulty === "Easy" ? "bg-green-500/20 text-green-400" :
                            prob.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-red-500/20 text-red-400"
                            }`}>
                            {prob.difficulty}
                        </span>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-purple-400 font-bold">{prob.points} XP</span>

                        <button
                            onClick={() => handleSolve(prob)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all"
                        >
                            <span>Solve</span>
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DSAPractice;