import React from 'react';

const UPSkeletonLoading: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="w-80 bg-white shadow-sm p-6">
        {/* Profile Header */}
        <div className="bg-blue-800 h-20 rounded-t-lg -mx-6 -mt-6 mb-16"></div>
        <div className="flex justify-center -mt-12 mb-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        
        {/* Name */}
        <div className="text-center mb-2">
          <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
        </div>

        {/* Personal Info Section */}
        <div className="mt-8">
          <div className="h-5 bg-gray-300 rounded w-28 mb-4 animate-pulse"></div>
          
          {/* Email */}
          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-40 animate-pulse"></div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
            <div className="h-8 bg-blue-100 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-8">
        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        </div>

        {/* Certificate Card 1 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded animate-pulse"></div>
              <div>
                <div className="h-5 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
          </div>

          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded p-4">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-red-300 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-red-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-3 bg-red-100 rounded w-64 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Card 2 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded animate-pulse"></div>
              <div>
                <div className="h-5 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-52 animate-pulse"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-40 animate-pulse"></div>
          </div>

          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPSkeletonLoading;