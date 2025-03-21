import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useEffect , useState } from 'react'
import React from 'react'
import axios from 'axios'
import API_URL from '../../utils/config'
import { toast } from 'react-toastify'

export default function Profile() {
  const [doctor, setDoctor] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/data`, { withCredentials: true });
        setDoctor(response.data.doctor);
        setFormData(response.data.doctor);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctor();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${API_URL}/api/auth/update`, formData, { withCredentials: true });
      toast.success("Profile Updated Successfully")
      setDoctor(response.data.doctor);
    } catch (error) {
      console.error('Error updating doctor data:', error);
     toast.error("Error updating details")
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
          
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData?.name || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData?.email || ''}
                  disabled
                  className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="position" className="block text-sm/6 font-medium text-gray-900">
                Position
              </label>
              <div className="mt-2">
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData?.position || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="specialization" className="block text-sm/6 font-medium text-gray-900">
                Specialization
              </label>
              <div className="mt-2">
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  value={formData?.specialization || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="gender" className="block text-sm/6 font-medium text-gray-900">
                Gender
              </label>
              <div className="mt-2">
                <select
                  id="gender"
                  name="gender"
                  value={formData?.gender || ''}
                  onChange={handleChange}
                  className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="clinicAddress" className="block text-sm/6 font-medium text-gray-900">
                Clinic Address
              </label>
              <div className="mt-2">
                <textarea
                  id="clinicAddress"
                  name="clinicAddress"
                  value={formData?.clinicAddress || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}  
