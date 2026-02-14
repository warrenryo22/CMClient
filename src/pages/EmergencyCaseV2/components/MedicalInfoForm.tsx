import { VitalSignsV2DTO } from "@/types/emergencyCaseV2Types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card/Card";
import Label from "@/components/form/Label";
import Input from "@/components/input/InputField";
import TextArea from "@/components/input/TextArea";
import { Heart, Activity, Thermometer, Wind, Stethoscope } from "lucide-react";

interface MedicalInfoFormProps {
  vitalSigns: VitalSignsV2DTO;
  assessment: string;
  diagnosis: string;
  onVitalSignsChange: (vitalSigns: VitalSignsV2DTO) => void;
  onAssessmentChange: (value: string) => void;
  onDiagnosisChange: (value: string) => void;
}

const MedicalInfoForm: React.FC<MedicalInfoFormProps> = ({
  vitalSigns,
  assessment,
  diagnosis,
  onVitalSignsChange,
  onAssessmentChange,
  onDiagnosisChange,
}) => {
  const updateVitalSign = (field: keyof VitalSignsV2DTO, value: string) => {
    onVitalSignsChange({ ...vitalSigns, [field]: value });
  };

  const vitalSignFields = [
    {
      key: "bloodPressure" as keyof VitalSignsV2DTO,
      label: "Blood Pressure",
      placeholder: "120/80",
      icon: Heart,
      unit: "mmHg",
      color: "text-red-600",
    },
    {
      key: "heartRate" as keyof VitalSignsV2DTO,
      label: "Heart Rate",
      placeholder: "72",
      icon: Activity,
      unit: "bpm",
      color: "text-pink-600",
    },
    {
      key: "temperature" as keyof VitalSignsV2DTO,
      label: "Temperature",
      placeholder: "36.8",
      icon: Thermometer,
      unit: "°C",
      color: "text-orange-600",
    },
    {
      key: "oxygenSaturation" as keyof VitalSignsV2DTO,
      label: "Oxygen Saturation",
      placeholder: "98",
      icon: Wind,
      unit: "%",
      color: "text-blue-600",
    },
    {
      key: "respiratoryRate" as keyof VitalSignsV2DTO,
      label: "Respiratory Rate",
      placeholder: "16",
      icon: Stethoscope,
      unit: "breaths/min",
      color: "text-teal-600",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <Activity size={20} />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {vitalSignFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Icon size={16} className={field.color} />
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      value={vitalSigns[field.key]}
                      onChange={(e) => updateVitalSign(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {field.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <Stethoscope size={20} />
            Medical Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Clinical Assessment</Label>
            <TextArea
              value={assessment}
              onChange={onAssessmentChange}
              placeholder="Describe the patient's condition, findings, and clinical observations..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <Label>Initial Diagnosis</Label>
            <TextArea
              value={diagnosis}
              onChange={onDiagnosisChange}
              placeholder="Preliminary diagnosis or suspected condition..."
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalInfoForm;
