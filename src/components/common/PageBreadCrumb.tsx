import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  separator?: React.ReactNode;
  className?: string;
  title: string;
  buttonChilren?: React.ReactNode;
}

const PageBreadCrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  separator,
  className = "",
  title,
  buttonChilren
}) => {
  const defaultSeparator = <ChevronRight className="w-4 h-4 text-gray-400" />;
  const separatorElement = separator ?? defaultSeparator;

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">{title}</h2>
        <nav aria-label="Breadcrumb" className={className}>
          <ol className="flex items-center space-x-2 text-sm">
            {showHome && (
              <>
                <li>
                  <a
                    href="/"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Home"
                  >
                    <Home className="w-4 h-4" />
                  </a>
                </li>
                {items.length > 0 && (
                  <li className="flex items-center" aria-hidden="true">
                    {separatorElement}
                  </li>
                )}
              </>
            )}

            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <React.Fragment key={index}>
                  <li>
                    {isLast ? (
                      <span
                        className="font-medium text-gray-900 dark:text-gray-400"
                        aria-current="page"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <a
                        href={item.href || "#"}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>

                  {!isLast && (
                    <li className="flex items-center" aria-hidden="true">
                      {separatorElement}
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      </div>
      <div className="">
        {buttonChilren}
      </div>
    </div>
  );
};

export default PageBreadCrumb;
