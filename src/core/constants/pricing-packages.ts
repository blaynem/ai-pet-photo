import { PurchaseType } from "@prisma/client";

export enum PricingPackageId {
  FIFTY_CREDIT = "fifty-credit-package",
  HUNDRED_CREDIT = "hundred-credit-package",
  PROMOTION_STUDIO = "promotion-studio-package",
  STANDARD_STUDIO = "studio-standard-package",
  PRINT = "print-package",
  CANVAS = "canvas-package",
  POSTER = "poster-package",
  HOODIE = "hoodie-package",
}

export type PricingPackage = {
  id: PricingPackageId;
  bonusCredits: number;
  credits: number;
  totalCredits: number;
  price: number;
  purchaseType: PurchaseType;
  displayName?: string;
};

export const STANDARD_STUDIO_PACKAGE: PricingPackage = {
  id: PricingPackageId.STANDARD_STUDIO,
  totalCredits: 5,
  price: 499,
  credits: 5,
  bonusCredits: 0,
  purchaseType: PurchaseType.STUDIO_PURCHASE,
  displayName: "Studio Standard",
};

export const PROMOTION_STUDIO_PACKAGE: PricingPackage = {
  id: PricingPackageId.PROMOTION_STUDIO,
  totalCredits: 3,
  price: 299,
  credits: 0,
  bonusCredits: 3,
  purchaseType: PurchaseType.PROMOTION_STUDIO_PURCHASE,
  displayName: "Promotional Studio",
};

export const FIFTY_CREDIT_PACKAGE: PricingPackage = {
  id: PricingPackageId.FIFTY_CREDIT,
  totalCredits: 50,
  price: 499,
  credits: 50,
  bonusCredits: 0,
  purchaseType: PurchaseType.CREDIT_PURCHASE,
  displayName: "50 Credits",
};

export const HUNDRED_CREDIT_PACKAGE: PricingPackage = {
  id: PricingPackageId.HUNDRED_CREDIT,
  totalCredits: 100,
  price: 999,
  credits: 100,
  bonusCredits: 0,
  purchaseType: PurchaseType.CREDIT_PURCHASE,
  displayName: "100 Credits",
};

export enum MerchPricingPackageId {
  HOODIE = "fifty-credit-package",
  HUNDRED_CREDIT = "hundred-credit-package",
  PROMOTION_STUDIO = "promotion-studio-package",
  STANDARD_STUDIO = "studio-standard-package",
}

export const HOODIE_PACKAGE: PricingPackage = {
  id: PricingPackageId.PRINT,
  totalCredits: 0,
  price: 4999,
  credits: 0,
  bonusCredits: 0,
  purchaseType: PurchaseType.CREDIT_PURCHASE,
  displayName: "Hoodie",
};
// make pricing packages for print, canvas, and poster

export const PRINT_PACKAGE: PricingPackage = {
  id: PricingPackageId.PRINT,
  totalCredits: 0,
  price: 4999,
  credits: 0,
  bonusCredits: 0,
  purchaseType: PurchaseType.CREDIT_PURCHASE,
  displayName: "Print",
};

export const CANVAS_PACKAGE: PricingPackage = {
  id: PricingPackageId.CANVAS,
  totalCredits: 0,
  price: 4999,
  credits: 0,
  bonusCredits: 0,
  purchaseType: PurchaseType.CREDIT_PURCHASE,
  displayName: "Canvas",
};

export const POSTER_PACKAGE: PricingPackage = {
  id: PricingPackageId.POSTER,
  totalCredits: 0,
  price: 4999,
  credits: 0,
  bonusCredits: 0,
  purchaseType: PurchaseType.CREDIT_PURCHASE,
  displayName: "Poster",
};

/**
 * Available options for purchasing credits
 */
export const creditsPackageOptions = [
  FIFTY_CREDIT_PACKAGE,
  HUNDRED_CREDIT_PACKAGE,
];

export const merchPackageOptions = [HOODIE_PACKAGE, PRINT_PACKAGE];
