import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  priority: yup.string().required("Priority is required"),
  category: yup.string().required("Category is required"),
  attachment: yup.mixed(),
  contactEmail: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  preferredContact: yup.string().required("Preferred contact method is required"),
  expectedResolutionDate: yup.date().required("Expected resolution date is required"),
  departmentAffected: yup.string().required("Department is required"),
});

const TicketForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
        <input
          {...register("title")}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <textarea
          {...register("description")}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
        <select
          {...register("priority")}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Attachment</label>
        <input
          type="file"
          {...register("attachment")}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Contact Email</label>
        <input
          type="email"
          {...register("contactEmail")}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
        <input
          type="tel"
          {...register("phone")}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Contact Method</label>
        <select
          {...register("preferredContact")}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Contact Method</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
        {errors.preferredContact && <p className="text-red-500 text-xs mt-1">{errors.preferredContact.message}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Expected Resolution Date</label>
        <input
          type="date"
          {...register("expectedResolutionDate")}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.expectedResolutionDate && <p className="text-red-500 text-xs mt-1">{errors.expectedResolutionDate.message}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Department Affected</label>
        <select
          {...register("departmentAffected")}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Department</option>
          <option value="sales">Sales</option>
          <option value="marketing">Marketing</option>
          <option value="engineering">Engineering</option>
          <option value="support">Support</option>
          <option value="other">Other</option>
        </select>
        {errors.departmentAffected && <p className="text-red-500 text-xs mt-1">{errors.departmentAffected.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
};

export default TicketForm;