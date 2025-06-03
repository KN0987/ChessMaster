import { useNavigate } from "react-router"
export default function Signin() {
    const navigate = useNavigate();
  return (
    <div>
        <h1 className="text-3xl font-bold text-center mt-10">Sign in</h1>
        <div className="max-w-md mx-auto mt-10">
            {/* Sign Up Form */}
            <form className="space-y-4">
            <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded"
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded"
            />
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
            >
                Sign in
            </button>
            </form>
        </div>
        <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                Don't have an account? <span className="text-blue-500 hover:underline" onClick={()=> navigate("/signup")}>Sign up</span>
            </p>
        </div>
    </div>
  )
}
