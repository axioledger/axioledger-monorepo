import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.js"

const root = document.getElementById("app")
if (!root) throw new Error("Mount element #app not found")
ReactDOM.createRoot(root).render(<React.StrictMode><App /></React.StrictMode>)
