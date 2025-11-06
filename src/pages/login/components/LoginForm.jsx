import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";
import { login, setToken } from "../../../utils/authAPI";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setErrors({ general: "Please fill in all fields." });
    }

    setIsLoading(true);

    try {
      const res = await login(formData);

      if (res.error) {
        setErrors({ general: res.error });
      } else {
        setToken(res.token, res.role);

        // ✅ Redirect based on role
        if (res.role === "CENTER_ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/gaming-center-map");
        }
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: "Login failed. Try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card p-8 rounded-2xl shadow-lg border border-border">
      <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
        Sign in to GameCenter Connect
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
          className="w-full"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
          className="w-full"
        />

        {errors.general && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-600 text-sm">
            {errors.general}
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isLoading}
          fullWidth
          iconName="LogIn"
          iconPosition="left"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className="text-sm text-center mt-4 text-muted-foreground">
        Don't have an account?{" "}
        <a href="/register" className="text-primary hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
