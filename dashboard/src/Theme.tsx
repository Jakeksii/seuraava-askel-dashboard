import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material";
import { ReactNode } from "react";

const theme = createTheme({
    palette: {
        primary: { //https://coolors.co/palette/FFE8D6-DDBEA9-CB997E
            light: "#5c7876",
          main: '#455e5d',
          dark: '#364746',
            contrastText: '#fff',
        },
        secondary: { //https://coolors.co/palette/B7B7A4-A5A58D-6B705C
            light: '#B7B7A4',
            main: '#A5A58D',
            dark: '#6B705C'
        },
        info: { //https://coolors.co/palette/f6fff8-eaf4f4-cce3de
            light: '#f6fff8',
            main: '#eaf4f4',
            dark: '#cce3de'
        },
        success: { //https://coolors.co/palette/73A942-538D22-245501
            light: '#73A942',
            main: '#538D22',
            dark: '#245501',
        },
        error: { //https://coolors.co/palette/AD2831-800E13-640D14
            light: '#AD2831',
            main: '#800E13',
            dark: '#640D14',
        },
        warning: { //https://coolors.co/palette/FFDA3D-FDC43F-FDB833
            light: '#FFDA3D',
            main: '#FDC43F',
            dark: '#FDB833',
        }
    },
    typography: {
        button: {
            textTransform: 'none'
        }
    }
})

export default function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <MUIThemeProvider theme={theme}>
            {children}
        </MUIThemeProvider>
    )
}

