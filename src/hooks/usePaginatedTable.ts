import { useEffect, useMemo, useRef, useState } from "react";
import { GetPaginatedDTO, PaginatedTableResponse } from "../types/globalTypes";
import {  PaginatedType, UserRoles } from "../enums/commons";
import { debounceMap } from "../utilities/debounceMap";
import { formatDate } from "../utilities/helpers";
interface usePaginatedExtraProps<T> {
    fetchFunction: (params: GetPaginatedDTO) => Promise<PaginatedTableResponse<T>>,
    syncProducts?: (branchId?: string) => Promise<boolean>;
    exportTableFunction?: (params: GetPaginatedDTO) => void;
    importFunction?: () => Promise<boolean>;
    syncService?: () => Promise<boolean>;
    defaultParams?: GetPaginatedDTO;
    showExportPDF?: boolean;
    showExportExcel?: boolean;
    showImport?: boolean;
    showSync?: boolean;
    showSyncProducts?: boolean;
    mode?: PaginatedType;
    onSyncProductsClick?: () => void;
}

export interface filterProps {
    UserRoles?: UserRoles[];
    BranchIds?: string[];
    SupplierIds?: number[];
    BrandIds?: number[];
    CategoryIds?: number[];
    TagIds?: number[];
    DateFilter?: [Date, Date] | undefined;
}

export function usePaginatedTable<T>(
    props: usePaginatedExtraProps<T>
) {
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalEntries, setTotalEntries] = useState<number>(0);
    const [tableValues, setTableValues] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>("");
    const [exportExcelLoading, setExportExcelLoading] = useState(false);
    const [exportPDFLoading, setExportPDFLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    const lastSearchRef = useRef<string>("");
    const [filters, setFilters] = useState<filterProps>({
        UserRoles: [],
        BranchIds: [],
        SupplierIds: [],
        BrandIds: [],
        CategoryIds: [],
        TagIds: [],
        DateFilter: undefined,
    });
    const [syncProductsLoading, setSyncProductsLoading] = useState(false);
    const firstLoadRef = useRef(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const totalPages = Math.ceil(totalEntries / rowsPerPage);

    const [paginationParams, setPaginationParams] = useState<GetPaginatedDTO>(new GetPaginatedDTO({
        ...props?.defaultParams,
    }));

    const fetchData = async () => {
        setIsLoading(true);
        if (firstLoadRef.current) setInitialLoading(true);
        const response = await props.fetchFunction(paginationParams);
        if (response) {
            setTableValues(prev =>
                props.mode === PaginatedType.INFINITE && paginationParams.Skip > 0
                    ? [...prev, ...response.ResponseData]  // APPEND
                    : response.ResponseData                // REPLACE
            );

            setTotalEntries(response.Count);
            setTotalValue(response.TotalValue ?? 0);
        }

        setIsLoading(false);
        if (firstLoadRef.current) {
            firstLoadRef.current = false;
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [paginationParams]);

    const onPageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            const newSkip = (page - 1) * paginationParams.Take;
            setPaginationParams(
                (prev) =>
                    new GetPaginatedDTO({
                        ...prev,
                        Take: paginationParams.Take,
                        Skip: newSkip,
                        SearchValue: searchValue,
                    })
            );
            setCurrentPage(page);
        }
    };

    const handleRowsOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTake = parseInt(e.target.value, 10);
        const updatedParams: GetPaginatedDTO = {
            ...paginationParams,
            Take: newTake,
            Skip: 0,
        };

        setPaginationParams(updatedParams);
        setRowsPerPage(newTake);
        setCurrentPage(1);

        if (props.mode === PaginatedType.INFINITE) {
            setTableValues([]);
        }
    };

    const handleSearchValueChange = (value: string, ignoreDebounce?: boolean) => {
        if (ignoreDebounce) {
            debounceMap.clear("search");
            setSearchValue(value);
            setCurrentPage(1);
            if (props.mode === PaginatedType.INFINITE) {
                setTableValues([]);
            }
            setPaginationParams(
                (prev) =>
                    new GetPaginatedDTO({
                        ...prev,
                        Take: rowsPerPage,
                        Skip: 0,
                        SearchValue: value,
                    })
            );

            return;
        }

        debounceMap.debounce(
            "search",
            () => {
                if (lastSearchRef.current !== value) lastSearchRef.current = value;
                else return;
                setSearchValue(value);
                setCurrentPage(1);
                if (props.mode === PaginatedType.INFINITE) {
                    setTableValues([]);
                }
                setPaginationParams(
                    (prev) =>
                        new GetPaginatedDTO({
                            ...prev,
                            Take: rowsPerPage,
                            Skip: 0,
                            SearchValue: value,
                        })
                );
            },
            600
        );
    };

    const handleExportExcel = async () => {
        if (!props?.exportTableFunction) return;
        setExportExcelLoading(true);
        // paginationParams.ExportOption = ExportOption.EXCEL;
        await props?.exportTableFunction(paginationParams);
        setExportExcelLoading(false);
    }

    const handleExportPDF = async () => {
        if (!props?.exportTableFunction) return;
        setExportPDFLoading(true);
        // paginationParams.ExportOption = ExportOption.PDF;
        await props?.exportTableFunction(paginationParams);
        setExportPDFLoading(false);
    }

    const handleImport = async () => {
        if (!props?.importFunction) return;
        setImportLoading(true);
        await props?.importFunction();
        setImportLoading(false);
    }

    const handleSync = async () => {
        if (!props?.syncService) return;
        setSyncLoading(true);
        await props?.syncService();
        setSyncLoading(false);
    }

    const handleSyncProducts = async (branchId?: string) => {
        if (!props?.syncProducts) return;

        setSyncProductsLoading(true);
        await props?.syncProducts(branchId);
        fetchData();
        setSyncProductsLoading(false);
    };

    const handleSyncProductsClick = () => {
        if (props?.onSyncProductsClick) {
            props.onSyncProductsClick();
        } else if (props?.syncProducts) {
            handleSyncProducts();
        }
    };

    const updateFilterState = <K extends keyof filterProps>(
        key: K,
        value: filterProps[K]) => {
        setFilters(prev => ({
            ...prev!,
            [key]: value,
        }));

        if (props.mode === PaginatedType.INFINITE) {
            setTableValues([]);
        }

        setPaginationParams(prev => {
            if (key === "DateFilter") {
                const dateRange = value as [Date, Date] | undefined;
                return {
                    ...prev,
                    DateStart: dateRange ? formatDate(dateRange[0]) : undefined,
                    DateEnd: dateRange ? formatDate(dateRange[1]) : undefined,
                    Skip: 0,
                };
            }

            return {
                ...prev,
                [key]: value,
                Skip: 0,
            };
        });

        setCurrentPage(1);
    };

    const handleClearFilter = () => {
        const cleared: filterProps = {
            UserRoles: [],
            BranchIds: [],
            SupplierIds: [],
            BrandIds: [],
            CategoryIds: [],
            TagIds: [],
            DateFilter: undefined,
        };

        setFilters(cleared);

        if (props.mode === PaginatedType.INFINITE) {
            setTableValues([]);
        }

        setPaginationParams(prev => ({
            ...prev,
            DateStart: undefined,
            DateEnd: undefined,
            Skip: 0,
        }));

        setCurrentPage(1);
    };

    const activeFilterCount = useMemo(() => {
        if (!filters) return 0;

        return Object.values(filters).reduce((count, value) => {
            if (Array.isArray(value) && value.length > 0) {
                return count + 1;
            }
            return count;
        }, 0);
    }, [filters]);

    return {
        tableValues,
        isLoading,
        rowsPerPage,
        currentPage,
        totalEntries,
        totalPages,
        searchValue,
        exportExcelLoading,
        exportPDFLoading,
        syncLoading,
        importLoading,
        syncProductsLoading,
        initialLoading,
        totalValue,
        paginationParams,
        setPaginationParams,
        setTableValues,
        startIndex: (currentPage - 1) * rowsPerPage,
        endIndex: Math.min(currentPage * rowsPerPage, totalEntries),
        onPageChange,
        handleRowsOnChange,
        handleSearchValueChange,
        handleExportExcel: props?.showExportExcel
            ? handleExportExcel
            : undefined,
        handleExportPDF: props?.showExportPDF
            ? handleExportPDF
            : undefined,
        handleImport: props?.showImport
            ? handleImport
            : undefined,
        handleSync: props?.showSync
            ? handleSync
            : undefined,
        handleSyncProducts,
        handleSyncProductsClick: props?.showSyncProducts
            ? handleSyncProductsClick
            : undefined,
        refresh: fetchData,
        filters,
        activeFilterCount,
        updateFilterState,
        handleClearFilter,

        setCurrentPage,
    };
}