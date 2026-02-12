import { GetUserDetailsDTO } from "@/types/userManagementTypes";
import ProfileSidebar from "./ProfileSidebar";
import CustomTabs, { TabItem } from "@/components/tabs/CustomTabs";

interface OverallDetailsProps {
  user: GetUserDetailsDTO;
  tabs: TabItem[];
}

const OverallDetails = ({ user, tabs }: OverallDetailsProps) => {
  return (
    <div className=" mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Profile Card */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ProfileSidebar user={user} />
        </div>

        {/* Right Content - Tabs */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <CustomTabs
              tabs={tabs}
              variant="minimal"
              defaultKey="personal-info"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallDetails;
