import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Label from "../form/Label";
import Input from "../input/InputField";
import Button from "../buttons/Button";
import { useAuthStore } from "../../zustand/authStore";
import { useForm } from "react-hook-form";
import { LoginRequest } from "../../types/authTypes";
import { authService } from "../../services/authService";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const userClaims = useAuthStore((state) => state.userClaims);
  const navigate = useNavigate();

  useEffect(() => {
    if (userClaims?.role == "SUPERUSER") {
      navigate("/");
    } else if (userClaims?.role == "STUDENTS") {
      navigate("/student-dashboard");
    } else if(userClaims?.role == "DOCTORS"){
      navigate("/doctor-dashboard");
    } else if(userClaims?.role == "PROCUREMENT"){
      navigate("/stock-request-approval");
    } else if(userClaims?.role == "STAFF"){
      navigate("/clinic-staff-dashboard");
    }
  }, [accessToken, navigate, userClaims]);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await authService.login(data);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-1 bg-white p-10 rounded-lg shadow-xl lg:shadow-none dark:bg-[#05304a]">
      <div className="flex flex-col justify-center flex-1 w-full mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>{" "}
              </Label>
              <Input
                placeholder="info@gmail.com"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                hint={
                  touchedFields.email || isSubmitted
                    ? errors.email?.message
                    : ""
                }
              />
            </div>
            <div>
              <Label>
                Password <span className="text-error-500">*</span>{" "}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required.",
                  })}
                  error={!!errors.password}
                  hint={
                    touchedFields.password || isSubmitted
                      ? errors.password?.message
                      : ""
                  }
                  endIcon={
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </span>
                  }
                />
              </div>
            </div>
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Keep me logged in
                </span>
              </div>
              <Link
                to="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div> */}
            <div>
              <Button isLoading={isLoading} className="w-full" size="sm">
                Sign in
              </Button>
            </div>
          </div>
        </form>

        {/* <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Don&apos;t have an account? {""}
            <Link
              to="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign Up
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}
