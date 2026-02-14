import { RouteObject } from "react-router";
import { buildPublicRoute, buildRoute } from "./routeBuilder";

import SignIn from "../pages/AuthPages/SignIn";
import Analytics from "../pages/Dashboard/Analytics";
import { SYSTEMACCESS } from "../enums/systemAccess";
import AllUsers from "../pages/UserManagement/AllUsers";
import AllAppointments from "@/pages/Appointments/AllAppointments";
import OverallAppointments from "@/pages/Appointments/OverallAppointments";
import AppointmentDailySchedule from "@/pages/Appointments/AppointmentDailySchedule";
import DoctorAppointmentIndex from "@/pages/DoctorAppointments/DoctorAppointmentIndex";
import TodayAppointment from "@/pages/DoctorAppointments/TodayAppointment";
import CheckupPage from "@/pages/Checkup/CheckupPage";
import AllTodayAppointment from "@/pages/Appointments/AllTodayAppointment";
import AllProducts from "@/pages/Products/AllProducts";
import AllStocks from "@/pages/Stocks/AllStocks";
import AllStockRequest from "@/pages/Procurement/AllStockRequest";
import DashboardReports from "@/pages/DashboardReports/DashboardReports";
import AllMedicalRecords from "@/pages/MedicalRecords/AllMedicalRecords";
import ViewMedical from "@/pages/MedicalRecords/ViewMedical";
import Walkins from "@/pages/Walkins";
import WalkinTable from "@/pages/Appointments/WalkinTable";
import UserProfile from "@/pages/UserProfile";
import AllPatients from "@/pages/Patients/AllPatients";
import AllStudentMedicalRecords from "@/pages/MedicalRecords/StudentMedicalRecords/AllStudentMedicalRecords";
import { CertificatePreview, MedicalCertificateForm} from "@/pages/MedicalCertificate";
import AllMedCertRequest from "@/pages/MedicalCertificate/AllMedCertRequest";
import Home from "@/pages/Home";
import EmergencyCaseV2 from "@/pages/EmergencyCaseV2";
import CreateEmergencyCase from "@/pages/EmergencyCaseV2/CreateEmergencyCase";
import AllHospitals from "@/pages/Hospital/AllHospitals";

export const routes: RouteObject[] = [
    buildPublicRoute('/login', SignIn),
    buildRoute({ path: '/', component: Analytics, accessRights: SYSTEMACCESS.DASHBOARD }),
    buildRoute({ path: '/reports', component: DashboardReports, accessRights: SYSTEMACCESS.DASHBOARD }),


     buildRoute({ path: '/all-users', component: AllUsers, accessRights: SYSTEMACCESS.DASHBOARD }),


     // Student Dashboard Route
     buildRoute({ path: '/student-dashboard', component: Home, accessRights: SYSTEMACCESS.STUDENT_DASHBOARD }), 
     buildRoute({ path: '/all-appointments', component: AllAppointments, accessRights: SYSTEMACCESS.APPOINTMENTS }), 

     buildRoute({ path: '/all-products', component: AllProducts, accessRights: SYSTEMACCESS.ALL_PRODUCTS }), 
     buildRoute({ path: '/manage-stocks', component: AllStocks, accessRights: SYSTEMACCESS.ALL_PRODUCTS }), 




     buildRoute({ path: '/overall-appointments', component: OverallAppointments, accessRights: SYSTEMACCESS.OVERALL_APPOINTMENTS }), 
     buildRoute({ path: '/appointments/:date', component: AppointmentDailySchedule, accessRights: SYSTEMACCESS.OVERALL_APPOINTMENTS }), 
     buildRoute({ path: '/all-today-appointments', component: AllTodayAppointment, accessRights: SYSTEMACCESS.ALL_TODAYS_APPOINTMENT }), 
     buildRoute({ path: '/all-walkins', component: WalkinTable, accessRights: SYSTEMACCESS.ALL_WALKINS }),


     //
     buildRoute({ path: '/doctor-dashboard', component: Home, accessRights: SYSTEMACCESS.DOCTOR_DASHBOARD }), 
     buildRoute({ path: '/clinic-staff-dashboard', component: Home, accessRights: SYSTEMACCESS.STAFF_DASHBOARD }), 
     buildRoute({ path: '/doctor-appointments', component: DoctorAppointmentIndex, accessRights: SYSTEMACCESS.DOCTOR_APPOINTMENTS }), 
     buildRoute({ path: '/today-appointments', component: TodayAppointment, accessRights: SYSTEMACCESS.DOCTOR_APPOINTMENTS }), 
     buildRoute({ path: '/checkup/:appointmentId', component: CheckupPage, accessRights: SYSTEMACCESS.DOCTOR_APPOINTMENTS }), 


     buildRoute({ path: '/stock-request-approval', component: AllStockRequest, accessRights: SYSTEMACCESS.PROCUREMENT_APPROVAL }),
     
     buildRoute({ path: '/all-medical-records', component: AllMedicalRecords, accessRights: SYSTEMACCESS.MEDICAL_RECORDS }), 
     buildRoute({ path: '/view-medical-records/:medId', component: ViewMedical, accessRights: SYSTEMACCESS.VIEW_MEDICAL_DATA }),
     buildRoute({ path: '/user-profile/:userDetailsId', component: UserProfile, accessRights: SYSTEMACCESS.MEDICAL_RECORDS }),
     buildRoute({ path: '/all-patients', component: AllPatients, accessRights: SYSTEMACCESS.ALL_PATIENTS }),

     buildRoute({ path: '/student-medical-records', component: AllStudentMedicalRecords, accessRights: SYSTEMACCESS.STUDENT_MEDICAL_RECORDS }),
     buildRoute({ path: '/all-request-certificates', component: AllMedCertRequest, accessRights: SYSTEMACCESS.REQUEST_CERTIFICATES }),
     buildRoute({ path: '/create-medical-cert/:reqId', component: MedicalCertificateForm, accessRights: SYSTEMACCESS.REQUEST_CERTIFICATES }),
     buildRoute({ path: '/medical-certificate/view/:medId', component: CertificatePreview, accessRights: SYSTEMACCESS.REQUEST_CERTIFICATES }),

     buildRoute({ path: '/emergency-cases', component: EmergencyCaseV2, accessRights: SYSTEMACCESS.EMERGENCY_CASE }),
     buildRoute({ path: '/create-emergency-case', component: CreateEmergencyCase, accessRights: SYSTEMACCESS.EMERGENCY_CASE }),
     buildRoute({ path: '/all-hospitals', component: AllHospitals, accessRights: SYSTEMACCESS.ALL_HOSPITALS }),




     
     buildPublicRoute('/walkins', Walkins), 
     

     
     





]