import { ShippingMethod } from "./../clients/prodigi";
// create a service that will be used to make requests to the prodigi API
//
// this service will be used by the PrintService to make requests to the prodigi API
//

import axios, { AxiosResponse } from "axios";
import prodigiClient, {
  OrderRequest,
  OrderResponse,
  Recipient,
} from "../clients/prodigi";

export namespace PrintService {
  const client = prodigiClient;
  export const GetOrders = async () => {
    const response = await client.get<OrderResponse>("/orders");
    return response.data;
  };

  export const GetOrder = async (orderId: string) => {
    const response = await client.get<OrderResponse>(`/orders/${orderId}`);
    return response.data;
  };

  export const CreateOrder = async (order: OrderRequest) => {
    const response = await client.post<OrderResponse>("/orders", order);
    return response.data;
  };

  export const GetOrderActions = async (orderId: string) => {
    const response = await client.get<OrderResponse>(
      `/orders/${orderId}/actions`
    );
    return response.data;
  };

  export const CancelOrder = async (orderId: string) => {
    const response = await client.post<OrderResponse>(
      `/orders/${orderId}/actions/cancel`,
      null
    );
    return response.data;
  };

  export const ChangeRecipientDetails = async (
    orderId: string,
    recipient: Recipient
  ) => {
    const response = await client.post<OrderResponse>(
      `/orders/${orderId}/actions/changeRecipientDetails`,
      recipient
    );
    return response.data;
  };

  export const ChangeShippingMethod = async (
    orderId: string,
    shippingMethod: ShippingMethod
  ) => {
    const response = await client.post<OrderResponse>(
      `/orders/${orderId}/actions/changeShippingMethod`,
      shippingMethod
    );
    return response.data;
  };
}
