import { BarChart, Dashboard,Home,Add,Settings } from "@mui/icons-material";
import Stats from "./Pages/Stats/Stats";
import Users from "./Pages/Users/Users";
import Homes from './Pages/Home/Home'
import Organization from './Pages/Orgranization/Organization'
import Setting from './Pages/Settings/Settings'
export const routes = [
  {
    path: "/admin/home",
    name: "Home",
    icon: () => <Home />,
    component: <Homes />,
  },
  {
    path: "/admin/organization",
    name: "Add Organization",
    icon: () => <Add />,
    component: <Organization />,
  },
  
  {
    path: "/admin/users",
    name: "Users",
    icon: () => <BarChart />,
    component: <Users />,
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
