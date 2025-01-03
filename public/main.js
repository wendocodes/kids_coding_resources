const { createApp, reactive, onMounted, computed } = Vue;
const socket = io(); 

createApp({
    setup() {
        const state = reactive({
            resources: [], 
            newResource: { title: "", category: "", link: "" },
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
                    body: JSON.stringify(state.newResource), // This must contain title, category, and link
                });
        
                if (!res.ok) throw new Error("Failed to add resource.");
                const newResource = await res.json();
                state.resources.push(newResource);
            } catch (err) {
                console.error(err); // Logs any error caught here
                alert("Failed to add resource.");
            }
        };
        

        // Listen for real-time updates
        socket.on("update-resources", (newResource) => {
            state.resources.push(newResource); 
        });

        onMounted(fetchResources);

        return { state, addResource };
    },
}).mount("#app");
