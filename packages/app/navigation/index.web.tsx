import { useState } from "react";

import { NavigationElementsProvider } from "app/navigation/navigation-elements-context";

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  return (
    <NavigationElementsProvider
      value={{
        isHeaderHidden,
        setIsHeaderHidden,
        isTabBarHidden,
        setIsTabBarHidden,
      }}
    >
      {children}
    </NavigationElementsProvider>
  );
}
