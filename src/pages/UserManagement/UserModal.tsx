import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Courses,
  Department,
  DoctorSpecializations,
  Gender,
  Position,
  UserRoles,
  YearLevels,
} from "../../enums/commons";
import { RegisterUserDTO } from "@/types/authTypes";
import { MainModal } from "@/components/modals/MainModal";
import Label from "@/components/form/Label";
import SearchableSelect from "@/components/form/SearchableSelect";
import Input from "@/components/input/InputField";
import Button from "@/components/buttons/Button";
import { authService } from "@/services/authService";
import DatePicker from "@/components/input/DatePicker";

interface UserModalProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  accRole?: UserRoles;
}
const UserModal = ({ isOpen, onClose, accRole }: UserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  //   const [showPassword, setShowPassword] = useState(false);
  //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    reset,
    watch,
    setValue,
    formState: { touchedFields, isSubmitted, errors },
  } = useForm<RegisterUserDTO>();
  const selectedUser = watch("SystemRole");

  useEffect(() => {
    if (!isOpen) return;
    if (accRole) setValue("SystemRole", accRole);
  }, [isOpen, accRole]);

  const handleClose = () => {
    reset();
    onClose(false);
  };

  const onSubmit = async (data: RegisterUserDTO) => {
    setIsLoading(true);
    const response = await authService.createUser(data);

    if (response) {
      reset(new RegisterUserDTO());
      onClose(true);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <MainModal
        title="ADD USER"
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-3xl"
      >
        <form
          className="flex flex-col px-2 mt-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          {!accRole && (
            <div className="mb-3">
              <Label>User Role</Label>
              <Controller
                name="SystemRole"
                control={control}
                rules={{ required: "User Role is required" }}
                render={({ field, fieldState }) => (
                  <SearchableSelect
                    placeholder="Select a Role"
                    options={Object.entries(UserRoles)
                      .filter(
                        ([key, value]) =>
                          !isNaN(Number(value)) &&
                          key !== "SUPERUSER" &&
                          key !== "FRANCHISEE" &&
                          key !== "CUSTOMER",
                      )
                      .map(([key, value]) => ({
                        value: Number(value),
                        label: key.replace(/_/g, " "),
                      }))}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                    className={fieldState.error ? "border-red-500" : ""}
                  />
                )}
              />
              {touchedFields.SystemRole || isSubmitted ? (
                <span className="mt-1 block text-xs text-red-500">
                  {errors.SystemRole?.message}
                </span>
              ) : null}
            </div>
          )}

          <div className="mb-3">
            <Label>Email</Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="example@gmail.com"
                {...register("Email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.Email}
                hint={
                  touchedFields.Email || isSubmitted
                    ? errors.Email?.message
                    : ""
                }
              />
            </div>
          </div>

          {/* <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("Password", {
                  required: "Password is required.",
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                    message:
                      "Password must be at least 8 characters, include an uppercase letter and a symbol",
                  },
                })}
                error={!!errors.Password}
                hint={
                  touchedFields.Password || isSubmitted
                    ? errors.Password?.message
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
            <div>
              <Label>Confirm Password</Label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("ConfirmPass", {
                  required: "Confirm password is required.",
                  validate: (value) =>
                    value === watch("Password") || "Password do not match",
                })}
                error={!!errors.ConfirmPass}
                hint={
                  touchedFields.ConfirmPass || isSubmitted
                    ? errors.ConfirmPass?.message
                    : ""
                }
                endIcon={
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </span>
                }
              />
            </div>
          </div> */}
          <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>First Name</Label>
              <Input
                type="text"
                placeholder="Enter firstname"
                {...register("FirstName", {
                  required: "Firstname required.",
                })}
                error={!!errors.FirstName}
                hint={
                  touchedFields.FirstName || isSubmitted
                    ? errors.FirstName?.message
                    : ""
                }
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                type="text"
                placeholder="Enter lastname"
                {...register("LastName", {
                  required: "Lastname is required",
                })}
                error={!!errors.LastName}
                hint={
                  touchedFields.LastName || isSubmitted
                    ? errors.LastName?.message
                    : ""
                }
              />
            </div>
          </div>
          <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Gender</Label>
              <Controller
                name="Gender"
                control={control}
                rules={{ required: "Gender is required" }}
                render={({ field, fieldState }) => (
                  <SearchableSelect
                    placeholder="Select a gender"
                    options={Object.entries(Gender)
                      .filter(([_, value]) => !isNaN(Number(value)))
                      .map(([key, value]) => ({
                        value: Number(value),
                        label: key.replace(/_/g, " "),
                      }))}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                    className={fieldState.error ? "border-red-500" : ""}
                  />
                )}
              />
              {touchedFields.Gender || isSubmitted ? (
                <span className="mt-1 block text-xs text-red-500">
                  {errors.Gender?.message}
                </span>
              ) : null}
            </div>
            <div>
              <Controller
                name="BirthDate"
                control={control}
                rules={{ required: "BirthDate is required" }}
                render={({ field, fieldState }) => (
                  <DatePicker
                    id="date-picker"
                    placeholder="Select a date"
                    value={field.value}
                    label="BirthDate"
                    onChange={field.onChange}
                    className={fieldState.invalid ? "border-red-500" : ""}
                  />
                )}
              />
              {(touchedFields || isSubmitted) && errors.BirthDate && (
                <span className="mt-1 block text-xs text-red-500">
                  {errors.BirthDate.message}
                </span>
              )}
            </div>
          </div>
          <div className="mb-3">
            <Label>Phone</Label>
            <Input
              type="text"
              placeholder="e.g. 09123456789"
              {...register("Phone", {
                required: "Phone number required.",
                pattern: {
                  value: /^(09|\+639)\d{9}$/,
                  message: "Invalid phone number",
                },
              })}
              error={!!errors.Phone}
              hint={
                touchedFields.Phone || isSubmitted ? errors.Phone?.message : ""
              }
            />
          </div>
          {selectedUser === UserRoles.STUDENTS && (
            <>
              <div className="mb-3">
                <Label>Student Number</Label>
                <Input
                  type="number"
                  placeholder="ex. 20016296"
                  {...register("StudentNumber", {
                    required: "Student number required.",
                  })}
                  error={!!errors.StudentNumber}
                  hint={
                    touchedFields.StudentNumber || isSubmitted
                      ? errors.StudentNumber?.message
                      : ""
                  }
                />
              </div>
              <div className="mb-3">
                <Label>Course</Label>
                <Controller
                  name="Course"
                  control={control}
                  rules={{ required: "Course is required" }}
                  render={({ field, fieldState }) => (
                    <SearchableSelect
                      placeholder="Select a Course"
                      options={Object.entries(Courses)
                        .filter(([_, value]) => !isNaN(Number(value)))
                        .map(([key, value]) => ({
                          value: Number(value),
                          label: key.replace(/_/g, " "),
                        }))}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      className={fieldState.error ? "border-red-500" : ""}
                    />
                  )}
                />
                {touchedFields.Course || isSubmitted ? (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.Course?.message}
                  </span>
                ) : null}
              </div>
              <div className="mb-3">
                <Label>Year Level</Label>
                <Controller
                  name="YearLevel"
                  control={control}
                  rules={{ required: "Year Level is required" }}
                  render={({ field, fieldState }) => (
                    <SearchableSelect
                      placeholder="Select a Year Level"
                      options={Object.entries(YearLevels)
                        .filter(([_, value]) => !isNaN(Number(value)))
                        .map(([key, value]) => ({
                          value: Number(value),
                          label: key.replace(/_/g, " "),
                        }))}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      className={fieldState.error ? "border-red-500" : ""}
                    />
                  )}
                />
                {touchedFields.YearLevel || isSubmitted ? (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.YearLevel?.message}
                  </span>
                ) : null}
              </div>
            </>
          )}
          {selectedUser === UserRoles.TEACHERS && (
            <>
              <div className="mb-3">
                <Label>Employee Number</Label>
                <Input
                  type="number"
                  placeholder="ex. 20016296"
                  {...register("EmployeeNo", {
                    required: "Employee number required.",
                  })}
                  error={!!errors.EmployeeNo}
                  hint={
                    touchedFields.EmployeeNo || isSubmitted
                      ? errors.EmployeeNo?.message
                      : ""
                  }
                />
              </div>
              <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="mb-3">
                  <Label>Position</Label>
                  <Controller
                    name="Position"
                    control={control}
                    rules={{ required: "Position is required" }}
                    render={({ field, fieldState }) => (
                      <SearchableSelect
                        placeholder="Select a position"
                        options={Object.entries(Position)
                          .filter(([_, value]) => !isNaN(Number(value)))
                          .map(([key, value]) => ({
                            value: Number(value),
                            label: key.replace(/_/g, " "),
                          }))}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {touchedFields.Position || isSubmitted ? (
                    <span className="mt-1 block text-xs text-red-500">
                      {errors.Position?.message}
                    </span>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label>Department</Label>
                  <Controller
                    name="Department"
                    control={control}
                    rules={{ required: "Department is required" }}
                    render={({ field, fieldState }) => (
                      <SearchableSelect
                        placeholder="Select a department"
                        options={Object.entries(Department)
                          .filter(([_, value]) => !isNaN(Number(value)))
                          .map(([key, value]) => ({
                            value: Number(value),
                            label: key.replace(/_/g, " "),
                          }))}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {touchedFields.Position || isSubmitted ? (
                    <span className="mt-1 block text-xs text-red-500">
                      {errors.Position?.message}
                    </span>
                  ) : null}
                </div>
              </div>
            </>
          )}
          {selectedUser === UserRoles.DOCTORS && (
            <>
              <div className="mb-3">
                <Label>Specialization</Label>
                <Controller
                  name="Specialization"
                  control={control}
                  rules={{ required: "Specialization is required" }}
                  render={({ field, fieldState }) => (
                    <SearchableSelect
                      placeholder="Select a specialization"
                      options={Object.entries(DoctorSpecializations)
                        .filter(([_, value]) => !isNaN(Number(value)))
                        .map(([key, value]) => ({
                          value: Number(value),
                          label: key.replace(/_/g, " "),
                        }))}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      className={fieldState.error ? "border-red-500" : ""}
                    />
                  )}
                />
                {touchedFields.Specialization || isSubmitted ? (
                  <span className="mt-1 block text-xs text-red-500">
                    {errors.Specialization?.message}
                  </span>
                ) : null}
              </div>
              <div className="mb-3">
                <Label>License Number (optional)</Label>
                <Input
                  type="text"
                  placeholder="ex. MED-987654"
                  {...register("LicenseNumber")}
                  error={!!errors.LicenseNumber}
                  hint={
                    touchedFields.LicenseNumber || isSubmitted
                      ? errors.LicenseNumber?.message
                      : ""
                  }
                />
              </div>
            </>
          )}
          <div className="mb-3">
            <Label>Address</Label>
            <Input
              type="text"
              placeholder="Enter Address"
              {...register("Address", { required: "Address required." })}
              error={!!errors.Address}
              hint={
                touchedFields.Address || isSubmitted
                  ? errors.Address?.message
                  : ""
              }
            />
          </div>
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>City</Label>
              <Input
                type="text"
                placeholder="Enter City"
                {...register("City", { required: "City required." })}
                error={!!errors.City}
                hint={
                  touchedFields.City || isSubmitted ? errors.City?.message : ""
                }
              />
            </div>
            <div>
              <Label>Region</Label>
              <Input
                type="text"
                placeholder="Enter Region"
                {...register("Region", { required: "Region is required" })}
                error={!!errors.Region}
                hint={
                  touchedFields.Region || isSubmitted
                    ? errors.Region?.message
                    : ""
                }
              />
            </div>
          </div>

          <div className="flex gap-1.5 justify-end">
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </MainModal>
    </div>
  );
};

export default UserModal;
