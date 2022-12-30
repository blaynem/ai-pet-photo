import {
  PricingPackageId,
  FIFTY_CREDIT_PACKAGE,
  HUNDRED_CREDIT_PACKAGE,
  PROMOTION_STUDIO_PACKAGE,
  STANDARD_STUDIO_PACKAGE,
} from "../constants";

/**
 * Get package info by package id
 */
export const getPackageInfo = (packageId: string) => {
  if (packageId === PricingPackageId.FIFTY_CREDIT) {
    return FIFTY_CREDIT_PACKAGE;
  }
  if (packageId === PricingPackageId.HUNDRED_CREDIT) {
    return HUNDRED_CREDIT_PACKAGE;
  }
  if (packageId === PricingPackageId.PROMOTION_STUDIO) {
    return PROMOTION_STUDIO_PACKAGE;
  }
  if (packageId === PricingPackageId.STANDARD_STUDIO) {
    return STANDARD_STUDIO_PACKAGE;
  }
};
