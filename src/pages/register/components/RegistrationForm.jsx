import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerAPI, setToken } from "../../../utils/authAPI";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Нэрээ оруулна уу";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "И-мэйл хаяг буруу байна";
    if (formData.password.length < 6)
      newErrors.password = "Нууц үг 6-аас дээш тэмдэгттэй байх ёстой";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Нууц үг таарахгүй байна";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "Та нөхцөлийг зөвшөөрнө үү";
    if (!formData.agreeToPrivacy)
      newErrors.agreeToPrivacy = "Та нууцлалын бодлогыг зөвшөөрнө үү";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const payload = {
        username: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      const res = await registerAPI(payload);
      if (res.token) {
        setToken(res.token);
        navigate("/", { state: { message: "Бүртгэл амжилттай боллоо!" } });
      } else {
        setErrors({ submit: res.error || "Бүртгэл амжилтгүй боллоо" });
      }
    } catch (err) {
      setErrors({ submit: "Серверийн алдаа гарлаа. Дахин оролдоно уу." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 max-w-lg mx-auto transition-all">
      <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-8">
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 
                       text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 
                       text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="88110011"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 
                       text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Password</label>
          <input
            type="password"
            name="password"
            placeholder="•••••••"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 
                       text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="•••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 
                       text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="pt-4 space-y-3">
          <label className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <span>I agree to the Terms of Service</span>
          </label>

          <label className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="agreeToPrivacy"
              checked={formData.agreeToPrivacy}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <span>I agree to the Privacy Policy</span>
          </label>

          {(errors.agreeToTerms || errors.agreeToPrivacy) && (
            <p className="text-sm text-red-500 mt-1">
              {errors.agreeToTerms || errors.agreeToPrivacy}
            </p>
          )}
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mt-2">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                     shadow-md hover:shadow-lg transition duration-200 disabled:opacity-70"
        >
          {isLoading ? "Registering..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
