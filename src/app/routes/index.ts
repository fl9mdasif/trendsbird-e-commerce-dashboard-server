import express from "express";
import { AuthRoutes } from "../modules/auth/routes.auth";
import { PermissionRoutes } from "../modules/permission/route.permission";
import { RoleRoutes } from "../modules/role/route.role";
import { UserRoutes } from "../modules/user/route.user";
import { MediaRoutes } from "../modules/media/route.media";
import { CategoryRoutes } from "../modules/category/route.category";
import { BrandRoutes } from "../modules/brand/route.brand";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/permissions",
    route: PermissionRoutes,
  },
  {
    path: "/roles",
    route: RoleRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/media",
    route: MediaRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/brands",
    route: BrandRoutes,
  },
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

export default router;
