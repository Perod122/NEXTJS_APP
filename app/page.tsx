"use client";

import { Mail, User, Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { toast, Toaster } from "react-hot-toast";

interface Student {
  id?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
}

// Define the Database type for Supabase
interface Database {
  public: {
    Tables: {
      students: {
        Row: Student;
        Insert: Omit<Student, 'id'>;
        Update: Partial<Student>;
      };
    };
  };
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Student>({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    try {
      // Check if email already exists (except for the current record being edited)
      const { data: existingUser } = await supabase
        .from("students")
        .select("id")
        .eq("email", formData.email)
        .single() as { data: Student | null };

      if (existingUser && !editId) {
        toast.error("Email already exists!");
        return;
      }

      if (editId) {
        // Update existing student
        const { error } = await supabase
          .from("students")
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender
          })
          .eq("id", editId) as { error: any };

        if (error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.success("Student updated successfully");
          setEditId(null);
          resetForm();
          getStudents();
        }
      } else {
        // Add new student
        const { error } = await supabase
          .from("students")
          .insert([formData]) as { error: any };

        if (error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.success("Student added successfully");
          resetForm();
          getStudents();
        }
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "Male",
    });
    setEditId(null);
  }

  async function handleEdit(student: Student) {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      gender: student.gender
    });
    if (student.id) {
      setEditId(student.id);
    }
  }

  async function handleDelete(id: string | undefined) {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id) as { error: any };

      if (error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.success("Student deleted successfully");
        getStudents();
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  }

  async function getStudents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*") as { data: Student[] | null; error: any };
        
      if (error) {
        toast.error(`Error: ${error.message}`);
      } else if (data) {
        setStudents(data);
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <Toaster />
      {/* Left side - Form */}
      <div className="w-1/3 pr-4">
        <div className="shadow-lg p-8 rounded-lg bg-white h-full">
          <h1 className="text-3xl text-center text-orange-800 font-bold mb-8">
            Student Registration Form
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John"
                  className="w-full pl-10 pr-3 py-3 border bg-white border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-3 py-3 border bg-white border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (123) 456-7890"
                  className="w-full pl-10 pr-3 py-3 border bg-white border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full pl-3 pr-10 py-3 border bg-white border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-no-repeat transition duration-200"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Prefer not to say</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button 
                type="submit" 
                className="flex-1 p-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-200"
              >
                {editId ? "Update" : "Submit"}
              </button>
              {editId && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="flex-1 p-3 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Table */}
      <div className="w-10/12 pl-4">
        <div className="shadow-lg rounded-lg bg-white h-full p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Students</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              {loading ? (
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td colSpan={5} className="text-center py-4">Loading...</td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                        <button 
                        onClick={ () => handleEdit(student) }
                        className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
                          Edit
                        </button>
                        <button 
                        onClick={ () => handleDelete(student.id) }
                        className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
