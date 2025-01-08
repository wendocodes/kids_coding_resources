"use strict";
const { createApp, reactive, onMounted, ref, computed } = Vue;
const socket = io();

createApp({
    setup() {
        const state = reactive({
            resources: [],
            newResource: {
                title: "",
                category: "",
                link: "",
                description: ""
            },
        });

        const selectedCategory = ref("");

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


        // Computed property for filtering resources
        const filteredResources = computed(() => {
            if (!selectedCategory.value) return state.resources;
            return state.resources.filter(
                (resource) => resource.category === selectedCategory.value
            );
        });

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

        onMounted(fetchResources);

        return { state, selectedCategory, addResource, filteredResources, deleteResource };
    },
}).mount("#app");
