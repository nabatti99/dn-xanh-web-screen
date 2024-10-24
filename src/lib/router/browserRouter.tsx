import { createBrowserRouter } from "react-router-dom";
import { Root } from "@global/Root";
import { ROOT } from "@global/constants";
import { ErrorPage } from "@pages/error";
import { homeRoute } from "@pages/home";

export const router = createBrowserRouter([
    {
        path: ROOT,
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [homeRoute],
    },
]);
