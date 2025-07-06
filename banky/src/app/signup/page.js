'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = () => {
    const errs = {};

    if (!form.fname.trim()) errs.fname = "First name is required";
    if (!form.lname.trim()) errs.lname = "Last name is required";

    if (!/^\d{10}$/.test(form.phone)) {
      errs.phone = "Phone must be exactly 10 digits";
    }

    if (!/^\d{6}$/.test(form.password)) {
      errs.password = "Password must be exactly 6 digits";
    }

    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Create an Account</h2>

        {["fname", "lname", "phone", "password"].map((field) => (
          <div key={field} className="mb-4">
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={
                field === "fname" ? "First Name" :
                field === "lname" ? "Last Name" :
                field === "phone" ? "(10 digits)eg.....9075439876" : "Password (6 digits)"
              }
              value={form[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
          </div>
        ))}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Sign Up
        </button> <br/> <br/>

        <p style={{textAlign:"center"}}>Already have an account......<Link style={{color:"blue", textDecoration:"underline"}} href={"/login"}>Login</Link></p>

        {message && <p className="text-center text-sm mt-4 text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
