"use strict";
export default {
  data() {
    return {
      query: '',
      resources: [],
      loading: false
    };
  },
  watch: {
    query(newQuery) {
      if (newQuery) {
        this.fetchResources(newQuery);
      } else {
        this.resources = [];
      }
    }
  },
  methods: {
    async fetchResources(query) {
      this.loading = true;
      try {
        const response = await fetch(`/api/resources?query=${query}`);
        this.resources = await response.json();
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  template: `
    <div>
      <input v-model="query" type="text" placeholder="Search resources..." />
      <div v-if="loading">Loading...</div>
      <ul v-if="resources.length > 0">
        <li v-for="resource in resources" :key="resource.id">
          <strong>{{ resource.title }}</strong> - {{ resource.description }}
        </li>
      </ul>
      <p v-else>No resources found.</p>
    </div>
  `
};
