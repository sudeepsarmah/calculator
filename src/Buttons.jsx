import { ACTIONS } from "./actions"

export default function Buttons({ dispatch, digit }) {
    return (
        <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>{digit}</button>
    )
}