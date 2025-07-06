'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone must be 10 digits");
      return;
    }

    if (!/^\d{6}$/.test(form.password)) {
      setError("Password must be 6 digits");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("fname", data.fname);
        router.push("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="text"
          name="phone"
          placeholder="Phone (10 digits)"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (6 digits)"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Login
        </button> <br/> <br/>

        <p style={{textAlign:"center"}}>Don't have an account......<Link style={{color:"blue", textDecoration:"underline"}} href={"/signup"}>SignUp</Link></p>
        
        {error && <p className="text-center text-red-500 text-sm mt-4">{error}</p>}
      </form>
    </div>
  );
}
