import { defineStore } from "pinia";

export const useTaskFlowStore = defineStore("taskFlow", {
  state: () => ({
    currentFlow: null,
    savedFlows: [],
    executionResults: {},
  }),

  actions: {
    saveFlow(flowData) {
      this.savedFlows.push(flowData);
      localStorage.setItem("taskFlows", JSON.stringify(this.savedFlows));
    },

    loadSavedFlows() {
      const saved = localStorage.getItem("taskFlows");
      if (saved) {
        this.savedFlows = JSON.parse(saved);
      }
    },
  },
});
