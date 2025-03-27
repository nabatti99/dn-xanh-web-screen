import { joinPaths } from "@remix-run/router";
import { ROOT } from "@global/constants";

export const TEST_PAGE = "test";
export const TEST_PAGE_PATH = joinPaths([ROOT, TEST_PAGE]);