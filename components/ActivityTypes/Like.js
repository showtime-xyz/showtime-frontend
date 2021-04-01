import React from "react";

export default function Like({ act }) {
  return (
    <div>
      {act.type} - {act.amount}
    </div>
  );
}
