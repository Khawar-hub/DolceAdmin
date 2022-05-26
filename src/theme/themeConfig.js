import { createTheme } from "@mui/material/styles";

const primaryColor = "#543f2d";
const tableHeadColor = "#9debd6";

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "white",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: tableHeadColor,
        },
      },
    },
  },
});

export const snackBarPlacement = { horizontal: "right", vertical: "top" };

export const projectName = "Dolce Days";
