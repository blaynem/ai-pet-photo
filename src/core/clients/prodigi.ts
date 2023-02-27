import axios, { AxiosResponse } from "axios";

/**
    based on the prodigi API documentation at: https://www.prodigi.com/print-api/docs/reference/
 */

export type Product = {
  // this is the identifier for the product
  sku: string;

  description: string;
  productDimensions: {
    width: number;
    height: number;
    units: string;
  };
  attributes: Record<string, unknown>;
  printAreas: Record<string, unknown>;
  variants: {
    attributes: Record<string, unknown>;
    shipsTo: string[];
    printAreaSizes: Record<string, unknown>;
  }[];
};

export type Status = {
  stage: string;
  issues: string[];
  details: Details;
};

export type Recipient = {
  name: string;
  email: string | null;
  phoneNumber: string | null;
  address: {
    line1: string;
    line2: string;
    postalOrZipCode: string;
    countryCode: string;
    townOrCity: string;
    stateOrCounty: string | null;
  };
};

export type Item = {
  id: string;
  status: string;
  merchantReference: string;
  sku: string;
  copies: number;
  sizing: string;
  attributes: Record<string, unknown>;
  assets: {
    id: string;
    printArea: string;
    md5Hash: string;
    url: string;
    status: string;
  }[];
  recipientCost: {
    amount: string;
    currency: string;
  };
};

export type Details = {
  downloadAssets: string;
  printReadyAssetsPrepared: string;
  allocateProductionLocation: string;
  inProduction: string;
  shipping: string;
};

export type Order = {
  id: string;
  created: string;
  lastUpdated: string;
  callbackUrl?: string | null;
  merchantReference?: string;
  shippingMethod: string;
  idempotencyKey?: string | null;
  status?: Status;
  charges: any[];
  shipments: any[];
  recipient: Recipient;
  items: Item[];
  packingSlip: any;
  metadata: Record<string, unknown>;
};

export type Charge = {
  id: string;
  prodigiInvoiceNumber: string;
  totalCost: Cost;
  items: ChargeItem[];
};

export type Cost = {
  amount: string;
  currency: string;
};

export type ChargeItem = {
  id: string;
  description: string;
  itemSku: string;
  itemId: string;
  shipmentId: string;
  merchantItemReference: string;
  cost: Cost;
};

export type CreateOrder = {
  merchantReference?: string;
  shippingMethod: string;
  recipient: Recipient;
  items: Item[];
  metadata: Record<string, unknown>;
};

export type Asset = {
  printArea: string;
  url: string;
};

export type PackingSlip = {
  url: string;
  status: string;
};

export type Carrier = {
  name: string;
  service: string;
};
export type ShipmentItem = {
  itemId: string;
};

export type FullfillmentLocation = {
  countryCode: string;
  labCode: string;
};

export type OrderRequest = {
  merchantReference?: string;
  shippingMethod: string;
  recipient: Recipient;
  items: Item[];
  metadata: Record<string, unknown>;
};

export type OrderResponse = {
  outcome: string;
  order: Order;
  traceParent: string;
};

export type GetOrderActionsResponse = {
  outcome: string;
  cancel: {
    isAvailable: string;
  };
  changeRecipientDetails: {
    isAvailable: string;
  };
  changeShippingMethod: {
    isAvailable: string;
  };
  changeMetaData: {
    isAvailable: string;
  };
  traceParent: string;
};

interface ProdigiClient {
  get: <t>(url: string) => Promise<AxiosResponse<t>>;
  post: <t>(
    url: string,
    data: OrderRequest | Recipient | ShippingMethod | null,
    headers?: any
  ) => Promise<AxiosResponse<t>>;
}

export enum ShippingMethod {
  STANDARD = "Standard",
  BUDGET = "Budget",
  OVERNIGHT = "Overnight",
  EXPRESS = "Express",
}

const prodigiClient: ProdigiClient = axios.create({
  baseURL: `${process.env.PRODIGI_API_URL}/v4.0`,
  headers: {
    Authorization: `Token ${process.env.PRODIGI_API_KEY}`,
    "Content-Type": "application/json",
    "Accept-Encoding": "*",
  },
});

export default prodigiClient;
