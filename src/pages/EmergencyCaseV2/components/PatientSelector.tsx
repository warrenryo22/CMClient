import { useState } from "react";
import {
  GraduationCap,
  Briefcase,
  Search,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/Card";
import Input from "@/components/input/InputField";
import Button from "@/components/buttons/Button";
import Label from "@/components/form/Label";
import { VerifyPayloadDTO } from "@/types/walkinTypes";
import { walkinService } from "@/services/walkinService";
import { Gender, UserRoles } from "@/enums/commons";
import { userManagementService } from "@/services/userManagementService";
import { GetUserDetailsDTO } from "@/types/userManagementTypes";

interface PatientSelectorProps {
  onPatientSelected: (patient: GetUserDetailsDTO) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
  onPatientSelected,
}) => {
  const [selectedType, setSelectedType] = useState<UserRoles | null>(null);
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Visitor fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const patientTypes = [
    {
      type: UserRoles.STUDENTS,
      icon: GraduationCap,
      title: "Student",
      description: "Currently enrolled student",
      color: "sky",
    },
    {
      type: UserRoles.TEACHERS,
      icon: Briefcase,
      title: "Teacher/Staff",
      description: "Faculty or staff member",
      color: "violet",
    },
  ];

  const handleVerify = async () => {
    if (!selectedType) return;

    setValidationError(null);
    setIsVerified(false);

    try {
      setIsVerifying(true);

      const payload = new VerifyPayloadDTO({
        IdentificationNumber: identificationNumber,
        UserRole: selectedType,
      });

      const isValid = await walkinService.VerifiyStudentNo(payload);

      if (!isValid.IsValid) {
        setValidationError("Identification number not found in the system.");
        setIsVerified(false);
        return;
      }

      if (!isValid.UserDetailsId) {
        setValidationError("Unable to retrieve user details.");
        return;
      }

      const response = await userManagementService.GetUserProfileDetails(
        Number(isValid.UserDetailsId),
        false,
      );

      setIsVerified(true);
      onPatientSelected(response);
    } catch (error) {
      setValidationError("Failed to verify identity. Please try again.");
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVisitorSubmit = () => {
    const birthDateObj = new Date(birthDate);

    const visitorPatient: GetUserDetailsDTO = {
      Role: UserRoles.VISITOR,
      FirstName: firstName,
      LastName: lastName,
      DateOfBirth: birthDateObj,
      Gender: gender === "Male" ? Gender.MALE : Gender.FEMALE,
    };

    setIsVerified(true);
    setValidationError(null);
    onPatientSelected(visitorPatient);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sky-700">
          <Search size={20} />
          Patient Identification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient Type Selection */}
        {!selectedType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.type}
                  onClick={() => {
                    setSelectedType(type.type);
                    setValidationError(null);
                  }}
                  className={`
                    p-6 rounded-lg border-2 transition-all duration-200
                    hover:shadow-md hover:-translate-y-1
                    border-gray-200 hover:border-${type.color}-300
                  `}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-${type.color}-100 flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className={`text-${type.color}-600`} size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {type.title}
                  </h3>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Student/Teacher Verification */}
        {selectedType && selectedType !== UserRoles.VISITOR && !isVerified && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                {selectedType === UserRoles.STUDENTS
                  ? "Student"
                  : "Teacher/Staff"}{" "}
                Verification
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedType(null);
                  setIdentificationNumber("");
                  setValidationError(null);
                }}
              >
                Change Type
              </Button>
            </div>

            <div>
              <Label>
                {selectedType === UserRoles.STUDENTS
                  ? "Student Number"
                  : "Employee ID"}
              </Label>
              <Input
                placeholder={`Enter ${
                  selectedType === UserRoles.STUDENTS
                    ? "student number"
                    : "employee ID"
                }`}
                value={identificationNumber}
                onChange={(e) => {
                  setIdentificationNumber(e.target.value);
                  setValidationError(null);
                }}
                error={!!validationError}
                hint={validationError || ""}
                className="mb-3"
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={!identificationNumber.trim() || isVerifying}
              className="w-full"
              isLoading={isVerifying}
              startIcon={
                isVerifying ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Search size={16} />
                )
              }
            >
              {isVerifying ? "Verifying..." : "Verify Identity"}
            </Button>

            {/* Error Alert */}
            {validationError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-sm text-red-700">{validationError}</p>
              </div>
            )}
          </div>
        )}

        {/* Visitor Section (unchanged except gender fix) */}
        {selectedType === UserRoles.VISITOR && !isVerified && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                Visitor Information
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                Change Type
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Birth Date</Label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleVisitorSubmit}
              disabled={!firstName || !lastName || !birthDate || !gender}
              className="w-full"
              startIcon={<CheckCircle2 size={16} />}
            >
              Confirm Visitor Information
            </Button>
          </div>
        )}

        {/* Verified State */}
        {isVerified && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-900">
                  Patient Verified
                </h4>
                <p className="text-sm text-emerald-700">
                  {selectedType === UserRoles.VISITOR
                    ? `${firstName} ${lastName}`
                    : "Identity verified successfully"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientSelector;
