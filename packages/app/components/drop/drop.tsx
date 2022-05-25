import { DropForm } from "./drop-form"
import React from "react"
import { DropExplanation } from "./drop-explanation"
import { MMKV } from "react-native-mmkv"

const store = new MMKV();
const  STORE_KEY = 'showExplanation'

export const Drop = () => {
    const [showExplanation, setShowExplanation] = React.useState(() => store.getBoolean(STORE_KEY) ?? true)
   
    const hideExplanation = () => {
        setShowExplanation(false);
        store.set(STORE_KEY, false)
    }

    return showExplanation ? <DropExplanation onDone={hideExplanation} /> : <DropForm />
}