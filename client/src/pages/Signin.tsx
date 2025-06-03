import { useNavigate } from "react-router";
import { useState } from "react";
import { login } from "../api/auth";

export default function Signin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const { email, password } = formData;
        // Call the login API
        const response = await login(email, password);
        if (response.error) {
            setError(response.error);
            return;
        }
        console.log("Login successful:", response);
        localStorage.setItem("sessionId", response.token);

        // navigate to the home page
        navigate("/");
    }
    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-10">Sign in</h1>
            <div className="max-w-md mx-auto mt-10">
                {/* Sign Up Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Sign in
                    </button>
                </form>
            </div>
            {error && <div className="max-w-md mx-auto mt-4 text-red-500">{error}</div>}
            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Don't have an account? <span className="text-blue-500 hover:underline" onClick={() => navigate("/signup")}>Sign up</span>
                </p>
            </div>
        </div>
    )
}
