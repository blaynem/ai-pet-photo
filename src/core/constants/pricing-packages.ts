import { PurchaseType } from "@prisma/client";

export enum PricingPackageId {
  FIFTY_CREDIT = "fifty-credit-package",
  HUNDRED_CREDIT = "hundred-credit-package",
  PROMOTION_STUDIO = "promotion-studio-package",
  STANDARD_STUDIO = "studio-standard-package",
}

export type PricingPackage = {
  id: PricingPackageId;
  bonusCredits: number;
  credits: number;
  totalCredits: number;
  price: number;
  purchaseType: PurchaseType;
};

export const STANDARD_STUDIO_PACKAGE: PricingPackage = {
  id: PricingPackageId.STANDARD_STUDIO,
  totalCredits: 0,
  price: 499,
  credits: 0,
  bonusCredits: 0,
  purchaseType: PurchaseType.STUDIO_PURCHASE,
};

export const PROMOTION_STUDIO_PACKAGE: PricingPackage = {
  id: PricingPackageId.PROMOTION_STUDIO,
  totalCredits: 3,
  price: 299,
  credits: 0,
  bonusCredits: 3,
  purchaseType: PurchaseType.PROMOTION_STUDIO_PURCHASE,
};

export const FIFTY_CREDIT_PACKAGE: PricingPackage = {
  id: PricingPackageId.FIFTY_CREDIT,
  totalCredits: 50,
  price: 499,
  credits: 50,
  bonusCredits: 0,
  purchaseType: PurchaseType.CREDIT_PURCHASE,
};

export const HUNDRED_CREDIT_PACKAGE: PricingPackage = {
  id: PricingPackageId.HUNDRED_CREDIT,
  totalCredits: 100,
  price: 999,
  credits: 100,
  bonusCredits: 0,
  purchaseType: PurchaseType.CREDIT_PURCHASE,
};