const { createApp, reactive, onMounted, computed } = Vue;

createApp({
    setup() {
        const state = reactive({
            resources: [],
            user: null,
            selectedCategory: "",
            newResource: { title: "", category: "", link: "", description: "" },
        });
        

        // Fetch all resources
        const fetchResources = async () => {
            try {
                const res = await fetch("/api/resources");
                if (res.ok) {
                    const data = await res.json();
                    state.resources = data || []; // Set to an empty array if undefined
                    console.log("Fetched resources:", state.resources);
                } else {
                    console.error("Failed to fetch resources:", res.status);
                    state.resources = []; // Reset to empty on failure
                }
            } catch (err) {
                console.error("Error fetching resources:", err);
                state.resources = []; // Reset to empty on error
            }
        };
        

        // Fetch user session
        const fetchUserSession = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    state.user = await res.json();
                }
            } catch (err) {
                console.error("Error fetching session:", err);
            }
        };

        // Add a new resource (Admin only)
        const addResource = async () => {
            if (!state.user || state.user.role !== "admin") {
                alert("Only admins can add resources.");
                return;
            }

            const { title, category, link, description } = state.newResource;
            try {
                await fetch("/api/resources", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title, category, link, description }),
                });
                fetchResources(); // Reload resources after adding a new one
                state.newResource = { title: "", category: "", link: "", description: "" }; // Reset the form
            } catch (err) {
                console.error("Error adding resource:", err);
            }
        };

        // Delete a resource (Admin only)
        const deleteResource = async (id) => {
            if (!state.user || state.user.role !== "admin") {
                alert("Only admins can delete resources.");
                return;
            }

            try {
                await fetch(`/api/resources/${id}`, { method: "DELETE" });
                fetchResources(); // Reload resources after deletion
            } catch (err) {
                console.error("Error deleting resource:", err);
            }
        };

        // Logout
        const logout = async () => {
            try {
                await fetch("/api/logout", { method: "POST" });
                state.user = null;
                fetchResources(); // Reload resources after logout
            } catch (err) {
                console.error("Error logging out:", err);
            }
        };


        const filteredResources = computed(() => {
            if (!state.resources || state.resources.length === 0) return [];
            if (!state.selectedCategory) return state.resources;
            return state.resources.filter(
                (resource) => resource.category === state.selectedCategory
            );
        });
        
        

        onMounted(() => {
            fetchResources();
            fetchUserSession();
        });

        return { state, addResource, deleteResource, logout, filteredResources };
    }
}).mount("#app");
