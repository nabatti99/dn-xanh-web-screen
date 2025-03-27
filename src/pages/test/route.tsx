import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { TEST_PAGE_PATH } from "./constants";

const TestPage = lazy(() => import("./test-page"));

export const testRoute: RouteObject = {
    index: true,
    path: TEST_PAGE_PATH,
    element: <TestPage />,
};
