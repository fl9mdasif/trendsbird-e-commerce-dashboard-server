"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_auth_1 = require("../modules/auth/routes.auth");
const route_permission_1 = require("../modules/permission/route.permission");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: routes_auth_1.AuthRoutes,
    },
    {
        path: "/permissions",
        route: route_permission_1.PermissionRoutes,
    },
    // {
    //   path: "/roles",
    //   route: RoleRoutes,
    // },
    // {
    //   path: "/users",
    //   route: UserRoutes,
    // },
    // {
    //   path: "/media",
    //   route: MediaRoutes,
    // },
    // {
    //   path: "/categories",
    //   route: CategoryRoutes,
    // },
    // {
    //   path: "/brands",
    //   route: BrandRoutes,
    // },
    // {
    //   path: "/attributes",
    //   route: AttributeRoutes,
    // },
    // {
    //   path: "/products",
    //   route: ProductRoutes,
    // },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
//# sourceMappingURL=index.js.map