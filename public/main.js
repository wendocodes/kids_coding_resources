const { createApp, reactive, onMounted, computed } = Vue;

createApp({
    setup() {
        const state = reactive({
            resources: [],
            user: null,
            selectedCategory: "",
            newResource: { title: "", category: "", link: "", description: "" },
        });

        /**
         * Fetch all resources from the server
         * Updates the resources array in the state
         */
        const fetchResources = async () => {
            try {
                const res = await fetch("/api/resources");
                if (res.ok) {
                    const data = await res.json();
                    state.resources = data || [];
                } else {
                    console.error("Failed to fetch resources:", res.status);
                    state.resources = [];
                }
            } catch (err) {
                console.error("Error fetching resources:", err);
                state.resources = [];
            }
        };

        /**
         * Fetch the current user session from the server
         * Updates the user object in the state
         * Also fetches resources after obtaining session data
         */
        const fetchUserSession = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    state.user = await res.json();
                } else {
                    state.user = null;
                }
                await fetchResources();
            } catch (err) {
                console.error("Error fetching session:", err);
                state.user = null;
            }
        };

        /**
         * Add a new resource to the server (Admin only)
         * Sends new resource data to the server and updates state
         */
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
                fetchResources();
                state.newResource = { title: "", category: "", link: "", description: "" };
            } catch (err) {
                console.error("Error adding resource:", err);
            }
        };

        /**
         * Delete a resource from the server (Admin only)
         * Sends delete request to the server and updates state
         * @param {number} id - The ID of the resource to delete
         */
        const deleteResource = async (id) => {
            if (!state.user || state.user.role !== "admin") {
                alert("Only admins can delete resources.");
                return;
            }

            try {
                await fetch(`/api/resources/${id}`, { method: "DELETE" });
                fetchResources();
            } catch (err) {
                console.error("Error deleting resource:", err);
            }
        };

        /**
         * Log out the current user
         * Sends logout request to the server, resets user state, and fetches resources
         */
        const logout = async () => {
            try {
                await fetch("/api/logout", { method: "POST" });
                state.user = null;
                fetchResources();
            } catch (err) {
                console.error("Error logging out:", err);
            }
        };

        /**
         * Compute a filtered list of resources based on the selected category
         * Returns all resources if no category is selected
         */
        const filteredResources = computed(() => {
            if (!state.resources || state.resources.length === 0) return [];
            if (!state.selectedCategory) return state.resources;
            return state.resources.filter(
                (resource) => resource.category === state.selectedCategory
            );
        });

        /**
         * Fetch resources and user session data when the component is mounted
         */
        onMounted(() => {
            fetchUserSession();
        });

        return { state, addResource, deleteResource, logout, filteredResources };
    }
}).mount("#app");