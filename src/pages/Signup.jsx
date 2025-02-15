// src/pages/Signup.jsx
import { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // Default role
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.firstName || !formData.lastName) {
      setError('Please provide your full name');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        createdAt: new Date().toISOString()
      });

      // Redirect to login page after successful signup
      navigate('/login');
    } catch (error) {
      let errorMessage = 'Failed to create an account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex">
        <div className="w-1/2 hidden md:block">
          <img
            src="/auth.jpg"
            alt="Signup"
            className="object-contain w-full h-full rounded-l-lg"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Create Account</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C7CF8]"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C7CF8]"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C7CF8]"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C7CF8]"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C7CF8]"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C7CF8]"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Account Type</label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C7CF8]"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="agent">Support Agent</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C7CF8] text-white py-2 px-4 rounded hover:bg-[#6b6bf0] disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7C7CF8] hover:text-[#6b6bf0]">
                Log in
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p>Get started with Resolute. Create an account now!</p>
          </div>
        </div>
      </div>
    </div>
  );
}