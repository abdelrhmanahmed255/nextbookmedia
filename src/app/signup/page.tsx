"use client";
import { useDispatch, useSelector } from 'react-redux';
import { resetSignUpForm, signUpUser } from '@/lib/userSlice';
import { RootState } from '@/lib/store';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  let dispatch = useDispatch();

// let { error } = useSelector((state: RootState) => state.userSignUP ?? {});


  let [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    dateOfBirth: '',
    gender: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  let router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(resetSignUpForm());
    dispatch<any>(signUpUser(formData as User))
      .then(() => {
        setIsLoading(false);
        router.push('/login');
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="max-w-sm md:max-w-xl mx-auto mt-5 pt-2 pb-12">
      <h1 className="text-blue-500 text-3xl font-semibold text-center ">Sign Up</h1>
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="EX: MO Salah"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="name@yahoo.com"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Password"
            required
            pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
          />
          <p className='text-sm text-gray-400 text-center'>at least one uppercase letter, one lowercase letter, one number, one special character</p>
        </div>
        <div className="mb-5">
          <label htmlFor="rePassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Confirm Password:
          </label>
          <input
            type="password"
            id="rePassword"
            name="rePassword"
            value={formData.rePassword}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Repeat Password"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Date Of Birth:
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender:</label>
          <div className="flex">
            <label className="mr-4">
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={handleChange}
                className="text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-500"
                required
              />{' '}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleChange}
                className="text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-500"
                required
              />{' '}
              Female
            </label>
          </div>
        </div>
        <button
          type="submit"
          className={`text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 mr-3 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V1.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5V4a8 8 0 01-8 8z"></path>
            </svg>
          ) : (
            'Sign Up'
          )}
        </button>
        {/* {error && <div className="bg-red-100 rounded-lg text-red-800 py-2 font-normal mt-3 px-3 text-center">{error}</div>} */}
        <div className="mt-4 text-gray-500 text-center">
          Already have an account?{' '}
          <Link href="/login" passHref>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
