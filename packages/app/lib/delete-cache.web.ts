export function deleteAppCache() {
  localStorage.removeItem("app-cache");
  localStorage.removeItem("showExplanationv2");
  localStorage.removeItem("showClaimExplanation");
}
