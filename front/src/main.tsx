import React, { StrictMode } from "react";
import { type Root, createRoot } from "react-dom/client";
import App from "./pages/App.tsx";
import "./main.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const domNode: HTMLElement | null = document.getElementById("root");

const darkTheme = createTheme({
	palette: {
		mode: "dark", // Enables dark mode globally
	},
});

const queryClient = new QueryClient();

if (domNode) {
	const root: Root = createRoot(domNode);

	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={darkTheme}>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<App />} />
							{/* <Route path="/session/:id" element={<WheelGame />} /> */}
						</Routes>
					</BrowserRouter>
				</ThemeProvider>
			</QueryClientProvider>
		</StrictMode>,
	);
}
