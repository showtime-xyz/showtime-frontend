import { DropForm } from "./drop-form"
import React from "react"
import { DropExplanation } from "./drop-explanation"
import { MMKV } from "react-native-mmkv"

const store = new MMKV();
const  STORE_KEY = 'explanationShown'

export const Drop = () => {
    const [showExplanation, setShowExplanation] = React.useState(() => !store.getBoolean(STORE_KEY))
   
    const hideExplanation = () => {
        setShowExplanation(false);
        store.set(STORE_KEY, true)
    }

    return showExplanation ? <DropExplanation onDone={hideExplanation} /> : <DropForm />
}