import { useState } from "react";

import MintModal from "@/components/UI/Modals/MintModal";
import Layout from "@/components/layout";

const ModalTest = () => {
  const [mintModalOpen, setMintModalOpen] = useState(true);

  return (
    <>
      <MintModal open={mintModalOpen} onClose={() => setMintModalOpen(false)} />
      <Layout>
        <div className="flex items-center justify-center flex-1 text-4xl font-semibold text-gray-900 dark:text-gray-300 font-tomato">
          Minting modal
        </div>
      </Layout>
    </>
  );
};

export default ModalTest;
