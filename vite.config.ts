import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            accountThemeImplementation: "none",
            environmentVariables: [
                { name: "ZS_PRODUCT_ID", default: "hypredge" },
                { name: "THEME_PRIMARY_COLOR", default: "" },
                { name: "THEME_BACKGROUND_COLOR", default: "" },
                { name: "THEME_LIGHT_MODE", default: "" }
            ]
        })
    ]
});
