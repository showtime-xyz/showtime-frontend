export function deleteAppCache() {
  localStorage.removeItem("app-cache");
  localStorage.delete("showExplanationv2");
  localStorage.delete("showClaimExplanation");
}
