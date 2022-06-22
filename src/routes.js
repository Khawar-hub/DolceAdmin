import { BarChart, Dashboard,Home,Add,Settings,ManageAccounts,Category,DataObject,NotificationAdd,Place
 } from "@mui/icons-material";
import Stats from "./Pages/Stats/Stats";
import Users from "./Pages/Users/Users";
import Homes from './Pages/Home/Home'
import Organization from './Pages/Orgranization/Organization'
import Setting from './Pages/Settings/Settings'
import Managers from './Pages/Managers/Managers'
import Categories from './Pages/Categories/Categories'
import Products from './Pages/Products/Products'
import NewOrders from './Pages/NewOrders/NewOrders'
import Country from './Pages/Country/Country'


export const routes = [
  {
    path: "/admin/home",
    name: "Home",
    icon: () => <Home />,
    component: <Homes />,
  },
  {
    path: "/admin/neworders",
    name: "New Orders",
    icon: () => <NotificationAdd/>,
    component: <NewOrders />,
  },
  {
    path: "/admin/organization",
    name: "Add Organization",
    icon: () => <Add />,
    component: <Organization />,
  },
  {
    path: "/admin/managers",
    name: "Managers",
    icon: () => <ManageAccounts />,
    component: <Managers />,
  },
  
  {
    path: "/admin/users",
    name: "Users",
    icon: () => <BarChart />,
    component: <Users />,
  },
  {
    path: "/admin/category",
    name: "Categories",
    icon: () => <Category />,
    component: <Categories />,
  },
  {
    path: "/admin/products",
    name: "Products",
    icon: () => <DataObject />,
    component: <Products />,
  },
  {
    path: "/admin/country",
    name: "Countries",
    icon: () => <Place />,
    component: <Country />,
  },
  {
    path: "/admin/statistics",
    name: "Statistics",
    icon: () => <Dashboard />,
    component: <Stats />,
  },
  {
    path: "/admin/settings",
    name: "Settings",
    icon: () => <Settings />,
    component: <Setting />,
  },
];
export const route = [
  {
    path: "/admin/home",
    name: "Home",
    icon: () => <Home />,
    component: <Homes />,
  },
  
  {
    path: "/admin/users",
    name: "Users",
    icon: () => <BarChart />,
    component: <Users />,
  },
 
];
