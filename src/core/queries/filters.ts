import { Filters } from "@prisma/client";
import axios from "axios";

export type PickFilters = Pick<Filters, "id" | "name" | "exampleUrl">;

export const FETCH_FILTERS_QUERY = "FETCH_FILTERS_QUERY";
/**
 * Fetches all available filters from the API
 * @returns Array of filters
 */
export const fetchFilters = async () =>
  await axios.get<PickFilters[]>(`/api/filters`);
