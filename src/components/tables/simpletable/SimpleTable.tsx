import React from "react";

interface SimpleTableProps {
    title?: string;
    tableLoading?: boolean;
    children: React.ReactNode;
}

const SimpleTable: React.FC<SimpleTableProps> = ({ title, tableLoading, children }) => {
    return (
        <div className="w-full">
            {title && (
                <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    {title}
                </h2>
            )}

            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="min-w-full text-left text-gray-700 dark:text-gray-400">
                    {children}
                </table>
            </div>

            {tableLoading && (
                <p className="text-center py-3 text-sm text-gray-500">Loading...</p>
            )}
        </div>
    );
};

export default SimpleTable;
