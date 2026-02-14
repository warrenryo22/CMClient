import { useState } from 'react';
import { UserRoles, AppointmentReasons } from '@/enums/commons';
import { WalkInFormData, initialFormData, requiresIdentification, isVisitor } from './types';
import ProgressStepper from './components/ProgressStepper';
import IntroStep from './components/IntroStep';
import RoleSelectionStep from './components/RoleSelectionStep';
import IdentificationStep from './components/IdentificationStep';
import VisitorInfoStep from './components/VisitorInfoStep';
import AppointmentReasonStep from './components/AppointmentReasonStep';
import Button from '@/components/buttons/Button';
import PageMeta from '@/components/common/PageMeta';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { walkinService } from '@/services/walkinService';
import { VerifyPayloadDTO } from '@/types/walkinTypes';

const Walkins = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WalkInFormData>(initialFormData);
  const [isIdValidated, setIsIdValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { label: 'Welcome', description: 'Introduction' },
    { label: 'Role', description: 'Select role' },
    { label: 'Identity', description: 'Verify ID' },
    { label: 'Reason', description: 'Visit reason' },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleRoleSelection = (role: UserRoles) => {
    setFormData((prev) => ({ ...prev, role }));
    setIsIdValidated(false);
  };

  const handleValidateId = async (): Promise<boolean> => {
    if(!formData.role) return false;
    const payload = new VerifyPayloadDTO({
      IdentificationNumber : formData.identificationNumber,
      UserRole : formData.role
    })
    const isValid = await walkinService.VerifiyStudentNo(payload);
    setIsIdValidated(isValid.IsValid);
    return isValid.IsValid;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await walkinService.CreateWalkin(formData);
      if(!response) return;
      setFormData(initialFormData);
      setCurrentStep(0);
      setIsIdValidated(false);
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if can proceed to next step
  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 0: // Intro
        return true;
      case 1: // Role selection
        return formData.role !== null;
      case 2: // Identity verification
        if (requiresIdentification(formData.role)) {
          return isIdValidated;
        }
        if (isVisitor(formData.role)) {
          return !!(
            formData.firstName &&
            formData.lastName &&
            formData.birthDate
          );
        }
        return false;
      case 3: // Appointment reason
        if (formData.appointmentReason === AppointmentReasons.OTHER_HEALTH_CONCERNS) {
          return !!formData.otherReason.trim();
        }
        return formData.appointmentReason !== null;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <IntroStep onNext={handleNext} />;
      
      case 1:
        return (
          <RoleSelectionStep
            selectedRole={formData.role}
            onSelectRole={handleRoleSelection}
          />
        );
      
      case 2:
        if (requiresIdentification(formData.role)) {
          return (
            <IdentificationStep
              role={formData.role!}
              identificationNumber={formData.identificationNumber}
              onChangeId={(id) =>
                setFormData((prev) => ({ ...prev, identificationNumber: id }))
              }
              onValidate={handleValidateId}
            />
          );
        }
        if (isVisitor(formData.role)) {
          return (
            <VisitorInfoStep
              firstName={formData.firstName}
              lastName={formData.lastName}
              birthDate={formData.birthDate}
              onChangeFirstName={(value) =>
                setFormData((prev) => ({ ...prev, firstName: value }))
              }
              onChangeLastName={(value) =>
                setFormData((prev) => ({ ...prev, lastName: value }))
              }
              onChangeBirthDate={(date) =>
                setFormData((prev) => ({ ...prev, birthDate: date }))
              }
            />
          );
        }
        return null;
      
      case 3:
        return (
          <AppointmentReasonStep
            selectedReason={formData.appointmentReason}
            otherReason={formData.otherReason}
            onSelectReason={(reason) =>
              setFormData((prev) => ({ ...prev, appointmentReason: reason }))
            }
            onChangeOtherReason={(value) =>
              setFormData((prev) => ({ ...prev, otherReason: value }))
            }
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center dark:bg-gray-950 py-8 px-4">
      <PageMeta
        title="CMS | Walk-In Registration"
        description="Register your clinic walk-in visit"
      />

      <div className="max-w-4xl mx-auto">
        {currentStep > 0 && (
          <ProgressStepper steps={steps} currentStep={currentStep - 1} />
        )}

        <div className="mt-8">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        {currentStep > 0 && (
          <div className="flex items-center justify-between mt-8 max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={handleBack}
              startIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>

            {currentStep < 3 && (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                endIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next
              </Button>
            )}

            {currentStep === 3 && (
              <Button
                onClick={handleSubmit}
                disabled={!canProceedToNext() || isSubmitting}
                isLoading={isSubmitting}
                startIcon={<CheckCircle className="w-4 h-4" />}
              >
                Submit Registration
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Walkins;
