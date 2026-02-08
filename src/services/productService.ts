import api from "@/api/axios";
import { GetPaginatedDTO, PaginatedTableResponse } from "@/types/globalTypes";
import { CreateDeliveryProductsDTOP, CreateProductDTO, GetProductPaginatedDTO, GetRequestStocksDTO } from "@/types/productTypes";
import { handleError } from "@/utilities/helpers";
import successModalInstance from "@/utilities/successModalInstance";

class ProductService{
    async CreateProduct(payload: CreateProductDTO) : Promise<boolean>{
        try {
            await api.post('products/create-product', payload);
            successModalInstance.show({
                message: `${payload.Title} has been created successfully`
            })
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }

    async GetProductsPaginated(payload: GetPaginatedDTO): Promise<PaginatedTableResponse<GetProductPaginatedDTO>>{
        try {
            const response = await api.get('products/get-product-paginated', {
                params: payload
            });
            return response.data.Data;
        } catch (error) {
            return new PaginatedTableResponse<GetProductPaginatedDTO>;
        }
    }

    async GetSingleProduct(productId: number) :Promise<CreateProductDTO>{
        try {
            const response = await api.get(`products/get-single-product/${productId}`);
            return response.data.Data;
        } catch (error) {
            return new CreateProductDTO;
        }
    }

    async UpdateProduct(productId: number, payload: CreateProductDTO): Promise<boolean>{
        try {
            await api.put(`products/update-product/${productId}`, payload);
            successModalInstance.show({
                message: `${payload.Title} has been updated successfully`
            });
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }

    async RequestStocks(payload: CreateDeliveryProductsDTOP): Promise<boolean>{
        try {
            await api.post('products/request-stocks', payload);
            successModalInstance.show({
                message: 'Stock has been requested to school admin'
            });
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }

    async GetRequestStocksPaginated(payload: GetPaginatedDTO): Promise<PaginatedTableResponse<GetRequestStocksDTO>>{
        try {
            const response = await api.get('products/get-request-stocks-paginated', {
                params: payload
            });

            return response.data.Data;
        } catch (error) {
            return new PaginatedTableResponse<GetRequestStocksDTO>;
        }
    }

    async ViewSinglePO(poId: number) : Promise<CreateDeliveryProductsDTOP>{
        try {
            const response = await api.get(`products/get-single-po/${poId}`);
            return response.data.Data;
        } catch (error) {
            return new CreateDeliveryProductsDTOP;
        }
    }

    async UpdateRequestStock(payload: CreateDeliveryProductsDTOP, poId: number) : Promise<boolean>{
        try {
            await api.put(`products/update-stock-request/${poId}`, payload);
            successModalInstance.show({
                message: 'Stock request has been updated',
            });

            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }

    async ReceiveDelivery(poId: number) : Promise<boolean>{
        try {
            await api.put(`products/receive-delivery/${poId}`);
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }
}

export const productService = new ProductService();