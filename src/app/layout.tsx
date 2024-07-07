"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import theme from "./theme";
import { store } from '@/lib/store';
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from 'react-redux';
import Navbar from "../_component/Navbar/page";
import ProtectedRoute from "../_component/ProtectedRoute";
import useAuth from "../hooks/useToken";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <RootProvider>
              <Navbar />
              <ProtectedRoute>
                {children}
              </ProtectedRoute>
            </RootProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}

function RootProvider({ children }: { children: React.ReactNode }) {
  useAuth();
  return <>{children}</>;
}
