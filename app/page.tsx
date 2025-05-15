"use client";

import { Mail, User, Phone, Trash2, Edit2, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Student>({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editId) {
        // Update existing student
        const response = await fetch('/api/students', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, id: editId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update student');
        }

        toast.success("Student updated successfully");
        resetForm();
      } else {
        // Add new student
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to add student');
        }

        toast.success("Student added successfully");
        resetForm();
      }
      getStudents();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
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

  function handleEdit(student: Student) {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      gender: student.gender
    });
    if (student.id) {
      setEditId(student.id);
      // Scroll to form on mobile
      if (window.innerWidth < 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  async function handleDelete(id: string | undefined) {
    if (!id) return;
    
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student');
      }

      toast.success("Student deleted successfully");
      getStudents();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setConfirmDelete(null);
      setSubmitting(false);
    }
  }

  async function getStudents() {
    setLoading(true);
    try {
      const response = await fetch('/api/students');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch students');
      }

      setStudents(data);
      setFilteredStudents(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm)
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Student Management System
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Add, update and manage student records in one place
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-600 px-4 py-4">
                <h2 className="text-xl font-bold text-white">
                  {editId ? "Update Student" : "Add New Student"}
                </h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
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
                        placeholder="John Doe"
                        className="w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
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
                        className="w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        required
                      />
                    </div>
                  </div>
                  //commit test yawa
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
                        className="w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
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
                      className="w-full pl-3 pr-10 py-2 border bg-white border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-no-repeat transition duration-200"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="flex-1 p-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                      {submitting ? (
                        <Loader2 size={20} className="animate-spin mr-2" />
                      ) : null}
                      {editId ? "Update" : "Submit"}
                    </button>
                    {editId && (
                      <button 
                        type="button"
                        onClick={resetForm}
                        disabled={submitting}
                        className="flex-1 p-2 rounded-md bg-gray-500 text-white font-medium hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-600 px-4 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Registered Students</h2>
                
                {/* Search bar */}
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={18} className="text-indigo-300" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-indigo-700 border border-indigo-500 rounded-md text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
              </div>

              <div className="overflow-hidden overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                      <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                      <p className="text-gray-500">Loading students...</p>
                    </div>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">No students found</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? "Try a different search term" : "Add your first student using the form"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Gender</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-gray-500 text-sm md:hidden">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{student.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              student.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 
                              student.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {student.gender}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEdit(student)}
                                disabled={submitting}
                                className="inline-flex items-center p-1.5 border border-indigo-500 rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(student.id)}
                                disabled={submitting}
                                className={`inline-flex items-center p-1.5 border rounded-md focus:outline-none focus:ring-2 ${
                                  confirmDelete === student.id
                                    ? "border-red-700 text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                    : "border-red-500 text-red-600 bg-white hover:bg-red-50 focus:ring-red-500"
                                }`}
                                title={confirmDelete === student.id ? "Confirm Delete" : "Delete"}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 opacity-50 cursor-not-allowed">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 opacity-50 cursor-not-allowed">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{filteredStudents.length}</span> of{" "}
                      <span className="font-medium">{students.length}</span> students
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={getStudents}
                      disabled={loading || submitting}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin mr-2" />
                      ) : null}
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
