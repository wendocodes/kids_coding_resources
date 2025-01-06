'use strict';
const { createApp, reactive, onMounted } = Vue;
const socket = io();

createApp({
    setup() {
        const state = reactive({
            resources: [], // Array to store fetched resources
            newResource: {
                title: "",
                category: "",
                link: "",
                description: ""
            },
        });

        // Fetch all resources
        const fetchResources = async () => {
            try {
                const res = await fetch("/api/resources");
                if (!res.ok) throw new Error("Failed to fetch resources");
                state.resources = await res.json();
            } catch (err) {
                console.error(err);
                alert("Failed to load resources");
            }
        };

        // Add a new resource
        const addResource = async () => {
            try {
                const res = await fetch("/api/resources", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(state.newResource),
                });

                if (!res.ok) throw new Error("Failed to add resource.");
                const newResource = await res.json();
                state.resources.push(newResource);
                state.newResource = { title: "", category: "", link: "", description: "" };
            } catch (err) {
                console.error(err);
                alert("Failed to add resource.");
            }
        };

        // Delete a resource
        const deleteResource = async (id) => {
            if (!confirm("Are you sure you want to delete this resource?")) return;

            try {
                const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });

                if (!res.ok) throw new Error("Failed to delete resource.");
                alert("Resource deleted successfully!");

                // Update the resources array in the state
                state.resources = state.resources.filter(resource => resource.id !== id);
            } catch (err) {
                console.error(err);
                alert("Failed to delete resource.");
            }
        };

        // Listen for real-time updates
        socket.on("update-resources", (newResource) => {
            state.resources.push(newResource);
        });

        // Fetch resources on component mount
        onMounted(fetchResources);

        // Return all methods and state for use in the template
        return { state, addResource, deleteResource };
    },
}).mount("#app");
