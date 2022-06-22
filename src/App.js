import React, { useEffect, useState, lazy, Suspense } from "react";
import { routes,route } from "./routes";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Container, Drawer } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { projectName } from "./theme/themeConfig";

// lazy loading
const Login = lazy(() => import("./Pages/Login/Login"));
const SideBar = lazy(() => import("./Components/Sidebar/SideBar"));
const Header = lazy(() => import("./Components/Header/Header"));

const App = () => {
  // state
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  console.log(user?.role)
  
  // sidebar width
  const [drawerWidth, setDrawerWidth] = useState(240);

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = () => {
    if (!user) {
      navigate("/");
    }
  };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Suspense>
      {user && (
        <>
          {/* Sidebar */}
          <Drawer
            variant="permanent"
            anchor="left"
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<div>Loading...</div>}>
                <SideBar
                  drawerWidth={drawerWidth}
                  setDrawerWidth={setDrawerWidth}
                />
              </Suspense>
            </ErrorBoundary>
          </Drawer>
          {/* Main content (Header / Main Content / Footer) */}
          <Box
            sx={{
              paddingLeft: {
                xs: 0,
                md: `${drawerWidth}px`,
              },
              transition: "padding-left 200ms",
              backgroundColor: "#f8f8f8",
            }}
            minHeight="100vh"
          >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<div>Loading...</div>}>
                <Header drawerWidth={240} />
              </Suspense>
            </ErrorBoundary>
            <Container
              maxWidth="xl"
              sx={{
                backgroundColor: "#f8f8f8",
                py: 2,
                minHeight: "calc(100vh - 130px)",
              }}
            >
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<div>Loading...</div>}>
                  {user?.role=="manager"?
                  <Routes>
                    {route.map((item) => {
                      return (
                        <Route path={item.path} element={item.component} />
                      );
                    })}
                  </Routes>:
                  <Routes>
                  {routes.map((item) => {
                    return (
                      <Route path={item.path} element={item.component} />
                    );
                  })}
                </Routes>
                  }
                </Suspense>
              </ErrorBoundary>
            </Container>
            <Box
              sx={{
                textAlign: "center",
                borderTop: "1px solid #F4F5F7",
                backgroundColor: "#e5e5e5",
              }}
              paddingY={3}
              className="text-dark fw-bold"
            >
              {projectName} @ DEVELO IT
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

export default App;
