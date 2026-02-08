import React, { useState } from "react";

export interface TabItem {
  key: string;
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  variant?: "floating" | "minimal" | "bordered";
  defaultKey?: string;
  className?: string;
}

const CustomTabs: React.FC<TabsProps> = ({
  tabs,
  variant = "floating",
  defaultKey,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultKey || tabs[0]?.key
  );

  const renderFloatingVariant = () => (
    <div className="relative flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? "text-gray-900 dark:text-white shadow-md bg-white dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tab.title}
          </button>
        );
      })}
    </div>
  );

  const renderMinimalVariant = () => (
    <div className="flex gap-8 border-b-2 border-gray-100 dark:border-gray-800">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative pb-4 text-sm font-semibold transition-colors ${
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tab.title}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );

  const renderBorderedVariant = () => (
    <div className="inline-flex gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {tab.title}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      <nav className="mb-6">
        {variant === "floating" && renderFloatingVariant()}
        {variant === "minimal" && renderMinimalVariant()}
        {variant === "bordered" && renderBorderedVariant()}
      </nav>

      <div className="mt-6">
        {tabs.map(
          (tab) =>
            activeTab === tab.key && (
              <div key={tab.key} className="animate-in fade-in duration-300">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  );
};


export default CustomTabs;