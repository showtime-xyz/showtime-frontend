export function deleteAppCache() {
  localStorage.removeItem("app-cache");
  localStorage.removeItem("showExplanationv2");
  // TODO: showClaimExplanation is not used anymore, remove soon
  localStorage.removeItem("showClaimExplanation");
}
